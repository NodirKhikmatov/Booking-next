import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import { appWithTranslation } from 'next-i18next';
import { light } from '../scss/MaterialTheme';
import { useApollo } from '../apollo/client';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
