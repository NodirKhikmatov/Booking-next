import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Box, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { getJwtToken, updateUserInfo } from '../../auth';

import Chat from '../Chat';
import Footer from '../Footer';
import Head from 'next/head';
import Top from '../Top';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { userVar } from '../../../apollo/store';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					title = 'Hotel & Villas';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/11.avif';
					break;
				case '/Cart':
					title = 'Cart';
					desc = 'Home / For cancellation';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/agent':
					title = 'Team';
					desc = 'Home / cancellation';
					bgImage = '/img/banner/22.avif';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Home / For cancellation';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Home / For cancellation';
					bgImage = '/img/banner/header1.svg';
					break;
				case '/community':
					title = 'News';
					desc = 'Home / For cancellation';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / For cancellation';
					bgImage = '/img/banner/header2.svg';
					break;

				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / For cancellation';
					bgImage = '/img/banner/header1.svg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Parador</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Parador</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>
						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							sx={{
								position: 'relative',
								height: '300px',
								overflow: 'hidden',
							}}
						>
							{/* Background image */}
							<Box
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									backgroundImage: `url(${memoizedValues.bgImage})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
									backgroundColor: 'rgba(0, 0, 0, 0.8)', // darkness level
									backgroundBlendMode: 'multiply', // or try 'multiply'
									zIndex: -1,
								}}
							/>

							{/* Foreground content */}
							<Stack
								className="container"
								sx={{
									position: 'relative',
									zIndex: 1,
									color: 'white',
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center',
									height: '100%',
								}}
							>
								{/* Breadcrumb with hover link */}
								<Box sx={{ fontSize: '14px', color: '#ddd', mb: 1 }}>
									<span style={{ display: 'block', marginBottom: '30px', fontSize: '60px' }}>
										{t(memoizedValues.title)}
									</span>
									<Box
										component="a"
										href="/"
										sx={{
											color: '#ddd',
											textDecoration: 'underline',
											'&:hover': {
												color: '#b18e60',
											},
										}}
									>
										Home
									</Box>
									<span style={{ margin: '0 6px' }}>/</span>
									<strong style={{ fontSize: '14px' }}>{t(memoizedValues.title)}</strong>
								</Box>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{/* {user?._id && <Chat />} */}
						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
