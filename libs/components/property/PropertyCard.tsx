import { Box, Button, Stack, Typography } from '@mui/material';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';

import { CartItem } from '../../types/cart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Property } from '../../types/property/property';
import React from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { formatterStr } from '../../utils';
import property from '../../../pages/property';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';

interface PropertyCardType {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const LOCAL_STORAGE_KEY = 'my-cart';

const PropertyCard = (props: PropertyCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter(); // ✅ Needed for routing

	const imagePath: string = property?.propertyImages[0]
		? `${REACT_APP_API_URL}/${property?.propertyImages[0]}`
		: '/img/banner/header1.svg';

	// ✅ Now uses property from props
	const addToCart = () => {
		const existingCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]') as CartItem[];

		const newItem: CartItem = {
			id: property._id,
			name: property.propertyTitle,
			price: property.propertyPrice,
			image: imagePath,
			quantity: 1,
		};

		const updatedCart = existingCart.find((item) => item.id === newItem.id)
			? existingCart.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
			: [...existingCart, newItem];

		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
	};

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/property/detail',
							query: { id: property?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>

					{property && property?.propertyRank > topPropertyRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/property/detail',
									query: { id: property?._id },
								}}
							>
								<Typography className="property-title">{property.propertyTitle}</Typography>
							</Link>
							{!recentlyVisited && (
								<Stack className="buttons">
									<IconButton color={'default'}>
										<RemoveRedEyeIcon />
									</IconButton>
									<Typography className="view-cnt">{property?.propertyViews}</Typography>
									<IconButton
										color={'default'}
										onClick={(e) => {
											e.preventDefault();
											likePropertyHandler(user, property?._id);
										}}
									>
										{myFavorites ? (
											<FavoriteIcon color="primary" />
										) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon color="primary" />
										) : (
											<FavoriteBorderIcon />
										)}
									</IconButton>
									<Typography className="view-cnt">{property?.propertyLikes}</Typography>
								</Stack>
							)}
						</Stack>

						<Stack className="address">
							<Typography>
								{property.propertyAddress}, {property.propertyLocation}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<img src="/img/icons/bed.png " alt="" /> <Typography>{property.propertyBeds} bed</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/room.png" alt="" />
							<Typography>{property.propertyRooms} room</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/bathroom.png" alt="" />
							<Typography>{property.propertyBathroom} Bathrooms</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/expand.svg" alt="" />

							<Typography>
								{property?.propertySquare} m<sup>2</sup>
							</Typography>
						</Stack>
					</Stack>

					<Stack className="type-buttons">
						<Stack className="type">
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
								className={property.propertyBreakfast ? '' : 'disabled-type'}
							>
								<svg
									stroke="currentColor"
									fill="currentColor"
									strokeWidth="0"
									viewBox="0 0 16 16"
									height="1em"
									width="1em"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"></path>
								</svg>
								Free Breakfast Included
							</Typography>

							<Typography
								sx={{ fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
								className={property.propertyCancellation ? '' : 'disabled-type'}
							>
								<svg
									stroke="currentColor"
									fill="currentColor"
									strokeWidth="0"
									viewBox="0 0 16 16"
									height="1em"
									width="1em"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"></path>
								</svg>
								Free Cancellation Available
							</Typography>
						</Stack>
						<Box component={'div'} className={'price-box'}>
							<Typography className={'price-title'}>
								${formatterStr(property?.propertyPrice)}
								<span>/day</span>
								<Button onClick={addToCart} variant="contained" color="primary">
									Go to Cart
								</Button>
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default PropertyCard;
