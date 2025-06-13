import { Box, Divider, Stack, Typography } from '@mui/material';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';

import IconButton from '@mui/material/IconButton';
import { Property } from '../../types/property/property';
import React from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';

interface PopularPropertyCardProps {
	property: Property;
}

const PopularPropertyCard = (props: PopularPropertyCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		console.log('propertyId:', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					{property && property?.propertyRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${property.propertyPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property.propertyTitle}
					</strong>
					<p className={'desc'}>{property.propertyAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{property?.propertyBeds} bed</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{property?.propertyRooms} rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.propertySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{property?.propertyCancellation ? 'Cancellation' : 'sale'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					{property && property?.propertyRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property.propertyTitle}
					</strong>
					<br />
					<div className={'price'}>${property.propertyPrice} / Night</div>

					<div className={'options'}>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>
								{property?.propertySquare} m<sup>2</sup>{' '}
							</span>
						</div>
						<div>
							<img src="/img/icons/bed.png " alt="" />
							<span>{property?.propertyBeds} bed</span>
						</div>
						<div>
							<img src="/img/icons/room.png" alt="" />
							<span>{property?.propertyRooms} rooms</span>
						</div>
						<div>
							<img src="/img/icons/bathroom.png" alt="" />
							<span>{property?.propertyBathroom} bathroom</span>
						</div>

						{/* {property?.propertyFacility?.length > 0 && (
							<div>
								{property.propertyFacility.map((facility, index) => (
									<div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
										<img
											src={`/img/icons/${facility.toLowerCase().replace(/\s+/g, '')}.png`}
											alt={facility}
											width={24}
											height={24}
										/>

										<span>{facility}</span>
									</div>
								))}
							</div>
						)} */}

						<div>
							<img src="/img/icons/freewife.png" alt="" />
							<span>{property?.propertyFacility} Free Wife</span>
						</div>
						<div>
							<img src="/img/icons/parking.png" alt="" />
							<span>{property?.propertyParking} Parking</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
				</Box>
			</Stack>
		);
	}
};

export default PopularPropertyCard;
