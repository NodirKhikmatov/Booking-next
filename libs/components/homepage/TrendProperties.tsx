import { Autoplay, Navigation, Pagination } from 'swiper';
import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMutation, useQuery } from '@apollo/client';

import EastIcon from '@mui/icons-material/East';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { Message } from '@mui/icons-material';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';
import TrendPropertyCard from './TrendPropertyCard';
import WestIcon from '@mui/icons-material/West';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);

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
	/** HANDLERS **/
	

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			//execute likePropertyHandler Mutation
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
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
						<span>What we offer</span>
						<p>Get Our Special Offer</p>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
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
								WHAT WE OFFER
							</span>
							<p>Get Our Special Offer</p>
							{/* <p>Trend is based on likes</p> */}
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
								Trends Empty
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
