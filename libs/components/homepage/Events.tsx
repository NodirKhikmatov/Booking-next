import { Box, Stack } from '@mui/material';

import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: '───January 12, 2026 ◉ Tips & Tricks ',
		description: 'We Offering Online Registration at Your Hotel',
		imageSrc: '/img/events/1.jpg',
	},
	{
		eventTitle: '─── December 12, 2025 ◉ Spa & Wellness',
		description: 'Our Health Club is Now Available for Your Fitness',
		imageSrc: '/img/events/2.jpg',
	},
	{
		eventTitle: '─── February 12, 2026 ◉ Popular Places',
		description: 'Restoring the Lighting Design in the Parador Places',
		imageSrc: '/img/events/3.jpg',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className="section-title">
								<img src="icons/before.png" alt="" width="24" height="24" />
								NEWS & BLOG
								<img src="icons/before.png" alt="" width="24" height="24" />
							</span>
							<p>
								<span>Check Latest Blog Post from</span>
								<br /> <br />
								<span> Blog List</span>
							</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
