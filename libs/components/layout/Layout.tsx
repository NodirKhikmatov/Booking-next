'use client';

import {
	AppBar,
	Box,
	Container,
	Drawer,
	FormControlLabel,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Switch,
	Toolbar,
	Typography,
} from '@mui/material';
import {
	Brightness4,
	Brightness7,
	ContactSupport,
	Help,
	Home,
	Menu as MenuIcon,
	Notifications,
	QuestionAnswer,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useTheme } from '../../../context/ThemeContext';

const menuItems = [
	{ text: 'Dashboard', icon: <Home />, path: '/' },
	{ text: 'Submit Question', icon: <QuestionAnswer />, path: '/submit-question' },
	{ text: 'My Questions', icon: <QuestionAnswer />, path: '/my-questions' },
	{ text: 'FAQs', icon: <Help />, path: '/faqs' },
	{ text: 'Notices', icon: <Notifications />, path: '/notices' },
	{ text: 'Contact Support', icon: <ContactSupport />, path: '/contact' },
];

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const { darkMode, toggleDarkMode } = useTheme();

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	const handleNavigation = (path: string) => {
		router.push(path);
		setDrawerOpen(false);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
						Customer Service Center
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={darkMode}
								onChange={toggleDarkMode}
								icon={<Brightness7 />}
								checkedIcon={<Brightness4 />}
							/>
						}
						label=""
					/>
				</Toolbar>
			</AppBar>

			<Drawer
				variant="temporary"
				open={drawerOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: 'auto' }}>
					<List>
						{menuItems.map((item) => (
							<ListItem
								button
								key={item.text}
								onClick={() => handleNavigation(item.path)}
								selected={pathname === item.path}
							>
								<ListItemIcon>{item.icon}</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>

			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<Container maxWidth="lg">{children}</Container>
			</Box>
		</Box>
	);
};
