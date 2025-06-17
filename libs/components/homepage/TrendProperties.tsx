import { Autoplay, Navigation, Pagination } from 'swiper';
import { Box, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery } from '@apollo/client';

import EastIcon from '@mui/icons-material/East';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { Message } from '@mui/icons-material';
import { Messages } from '../../config';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';
import TrendPropertyCard from './TrendPropertyCard';
import WestIcon from '@mui/icons-material/West';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router'; // Fixed: Use Next.js router correctly
import { useTranslation } from 'next-i18next';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);
	const [lang, setLang] = useState<string>('en'); // Fixed: Remove null type
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const drop = Boolean(anchorEl2);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);

	let open = Boolean(anchorEl);

	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	/** APOLLO REQUESTS **/
	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProperties(data?.getProperties?.list);
		},
	});

	// Fixed: Initialize language from router locale and localStorage
	useEffect(() => {
		const initializeLanguage = () => {
			const storedLocale = localStorage.getItem('locale');
			const routerLocale = router.locale;

			if (!storedLocale) {
				const defaultLang = routerLocale || 'en';
				localStorage.setItem('locale', defaultLang);
				setLang(defaultLang);
			} else {
				setLang(storedLocale);
				// Sync router locale with stored locale if they differ
				if (routerLocale !== storedLocale) {
					router.push(router.asPath, router.asPath, { locale: storedLocale });
				}
			}
		};

		initializeLanguage();
	}, [router.locale]); // Fixed: Depend on router.locale instead of router

	// Fixed: Handle i18n language changes
	useEffect(() => {
		if (lang && i18n.language !== lang) {
			i18n.changeLanguage(lang);
		}
	}, [lang, i18n]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			const selectedLang = e.target.id;

			try {
				setLang(selectedLang);
				localStorage.setItem('locale', selectedLang);
				setAnchorEl2(null);

				// Change i18n language first
				await i18n.changeLanguage(selectedLang);

				// Then navigate with new locale
				await router.push(router.asPath, router.asPath, { locale: selectedLang });
			} catch (error) {
				console.error('Error changing language:', error);
				// Revert on error
				setLang(lang);
			}
		},
		[router, i18n, lang], // Fixed: Add i18n and lang to dependencies
	);

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			//execute likePropertyHandler Mutation
			if (!id) return;
			// @ts-ignore
			if (!user._id) throw new Error(Messages.NOT_AUTHENTICATED);
			await likeTargetProperty({
				variables: { input: id },
			});
			//execute getPropertiesRefetch
			await getPropertiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error:likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendProperties) console.log('trendProperties:', trendProperties);
	if (!trendProperties) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>{t('What we offer')}</span>
						<p>{t('Get Our Special Offer')}</p> {/* Fixed: Added translation */}
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								{t('Trends Empty')} {/* Fixed: Added translation */}
							</Box>
						) : (
							<div className="swiper-container">
								<Swiper
									className={'trend-property-swiper'}
									slidesPerView={'auto'}
									centeredSlides={true}
									spaceBetween={15}
									modules={[Autoplay]}
								>
									{trendProperties.map((property: Property) => {
										return (
											<SwiperSlide key={property._id} className={'trend-property-slide'}>
												<TrendPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
											</SwiperSlide>
										);
									})}
								</Swiper>
							</div>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component="div" className="left">
							<span className="section-title">
								<img src="icons/before.png" alt="" />
								{t('What We Offer')} {/* Fixed: Added translation */}
							</span>
							<p>{t('Get Our Special Offer')}</p> {/* Fixed: Added translation */}
							{/* <p>{t('Trend is based on likes')}</p> */}
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								{/* <WestIcon className={'swiper-trend-prev'} /> */}
								<div className={'swiper-trend-pagination'}></div>
								{/* <EastIcon className={'swiper-trend-next'} /> */}
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								{t('Trends Empty')} {/* Fixed: Added translation */}
							</Box>
						) : (
							<div className="swiper-container">
								<Swiper
									className={'trend-property-swiper'}
									slidesPerView={'auto'}
									spaceBetween={15}
									modules={[Autoplay, Navigation, Pagination]}
									navigation={{
										nextEl: '.swiper-trend-next',
										prevEl: '.swiper-trend-prev',
									}}
									pagination={{
										el: '.swiper-trend-pagination',
									}}
								>
									{trendProperties.map((property: Property) => {
										return (
											<SwiperSlide key={property._id} className={'trend-property-slide'}>
												<TrendPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
											</SwiperSlide>
										);
									})}
								</Swiper>
							</div>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 3,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
