'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { CssBaseline } from '@mui/material';

interface ThemeContextType {
	darkMode: boolean;
	toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedMode = localStorage.getItem('darkMode');
		if (savedMode) {
			setDarkMode(JSON.parse(savedMode));
		}
	}, []);

	const toggleDarkMode = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);
		localStorage.setItem('darkMode', JSON.stringify(newMode));
	};

	const theme = createTheme({
		palette: {
			mode: darkMode ? 'dark' : 'light',
			primary: {
				main: '#1976d2',
			},
			secondary: {
				main: '#dc004e',
			},
		},
		components: {
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: 12,
						boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
					},
				},
			},
		},
	});

	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
};
