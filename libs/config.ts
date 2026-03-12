/** Normalize API base URL for images/uploads - fixes malformed env vars */
function normalizeApiBaseUrl(): string {
	const url = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
	if (!url || typeof url !== 'string') return '';
	let cleaned = url.replace(/(https?|wss?):?\/\/+/gi, '').trim().replace(/^\/+/, '');
	const portMatch = cleaned.match(/:(\d+)/);
	const port = portMatch ? portMatch[1] : '4001';
	const hostMatch = cleaned.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[a-zA-Z0-9][a-zA-Z0-9.-]*)/);
	const host = hostMatch ? hostMatch[1] : 'localhost';
	return `http://${host}:${port}`;
}

export const REACT_APP_API_URL = normalizeApiBaseUrl() || `${process.env.REACT_APP_API_URL || ''}`;

export const availableOptions = ['propertyBreakfast', 'propertyCancellation'];

const thisYear = new Date().getFullYear();

export const propertyYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	propertyYears.push(String(i));
}

export const propertySquare = [0, 25, 50, 75, 100, 125, 150, 200, 300, 500];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topPropertyRank = 3;
