import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject, from, split } from '@apollo/client';
import { error, log } from 'console';

import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { WebSocketLink } from '@apollo/client/link/ws';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { getJwtToken } from '../libs/auth';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { socketVar } from './store';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { useMemo } from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject>;

/** Normalize API URL - fixes malformed env vars (e.g. http://http//, wrong port placement) */
function normalizeApiUrl(url: string | undefined, protocol: 'http' | 'ws' = 'http'): string {
	if (!url || typeof url !== 'string') return protocol === 'ws' ? 'ws://127.0.0.1:3007' : 'http://localhost:4001/graphql';
	// Strip protocol prefixes (handles http://http//, ws://http//, etc.)
	let cleaned = url.replace(/(https?|wss?):?\/\/+/gi, '').trim();
	cleaned = cleaned.replace(/^\/+/, '');
	// Extract port (handles /:4001 or :4001)
	const portMatch = cleaned.match(/:(\d+)/);
	const port = portMatch ? portMatch[1] : '4001';
	// Extract host (IP or domain)
	const hostMatch = cleaned.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[a-zA-Z0-9][a-zA-Z0-9.-]*)/);
	const host = hostMatch ? hostMatch[1] : 'localhost';
	// Extract path (e.g. graphql)
	const pathMatch = cleaned.match(/\/(graphql.*)$/);
	const path = pathMatch ? pathMatch[1] : protocol === 'http' ? 'graphql' : '';
	const prefix = protocol === 'ws' ? 'ws://' : 'http://';
	return path ? `${prefix}${host}:${port}/${path}` : `${prefix}${host}:${port}`;
}

function getGraphqlUrl(): string {
	const url = process.env.REACT_APP_API_GRAPHQL_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL;
	return normalizeApiUrl(url, 'http');
}

function getWsUrl(): string {
	const url = process.env.REACT_APP_API_WS || process.env.NEXT_PUBLIC_API_WS;
	return normalizeApiUrl(url || '', 'ws') || 'ws://127.0.0.1:3007';
}

function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// execute refresh token
		return null;
	},
});

//Custom webSocket client
class LoggingWebSocket {
	private socket: WebSocket;

	constructor(url: string) {
		this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
		socketVar(this.socket);

		this.socket.onopen = () => {
			console.log('websocket connection');
		};

		this.socket.onmessage = (msg) => {
			console.log('websocket message', msg.data);
		};
		this.socket.onerror = (error) => {
			console.log('websocket, error:', error);
		};
	}
	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data);
	}
	close() {
		this.socket.close();
	}
}

function createIsomorphicLink() {
	if (typeof window !== 'undefined') {
		// const authLink = new ApolloLink((operation, forward) => {
		// 	operation.setContext(({ headers = {} }) => ({
		// 		headers: {
		// 			...headers,
		// 			...getHeaders(),
		// 		},
		// 	}));
		// 	console.warn('requesting.. ', operation);
		// 	return forward(operation);
		// });

		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(),
					'x-apollo-operation-name': operation.operationName || 'Unknown', // <-- Add this line
				},
			}));
			return forward(operation);
		});

		// @ts-ignore
		const link = new createUploadLink({
			uri: getGraphqlUrl(),
		});

		/* WEBSOCKET SUBSCRIPTION LINK */
		const wsLink = new WebSocketLink({
			uri: getWsUrl(),
			options: {
				reconnect: false,
				timeout: 30000,
				connectionParams: () => {
					return { headers: getHeaders() };
				},
			},
			webSocketImpl: LoggingWebSocket,
		});

		const errorLink = onError(({ graphQLErrors, networkError, response }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path, extensions }) => {
					console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
					if (!message.includes('input')) {
						sweetErrorAlert(message);
					}
				});
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
			// @ts-ignore
			if (networkError?.statusCode === 401) {
			}
		});

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			wsLink,
			authLink.concat(link),
		);

		return from([errorLink, tokenRefreshLink, splitLink]);
	}
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}

/**
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// No Subscription required for develop process

const httpLink = createHttpLink({
  uri: "http://localhost:3007/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
*/
