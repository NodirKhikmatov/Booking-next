import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import React, { useEffect } from 'react';
import { getJwtToken, updateUserInfo } from '../../auth';

import Chat from '../Chat';
import Footer from '../Footer';
import Head from 'next/head';
import { Stack } from '@mui/material';
import Top from '../Top';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';

const withLayoutFull = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

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
						<meta name={'title'} content={`Parador`} />
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
						<meta name={'title'} content={`Parador`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
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

export default withLayoutFull;
