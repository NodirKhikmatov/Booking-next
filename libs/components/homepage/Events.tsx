import { Box, Stack } from '@mui/material';

import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

interface EventData {
	eventTitle: string;
	description: string;
	imageSrc: string;
}

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	if (device === 'mobile') {
		return <div>{t('News CARD')}</div>;
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
					<span>{t(event?.eventTitle)}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{t(event?.description)}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	// Move events data inside component to use translation
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

	if (device === 'mobile') {
		return <div>{t('News CARD')}</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className="section-title">
								<img src="icons/before.png" alt="" width="24" height="24" />
								{t('NEWS & BLOG')}
								<img src="icons/before.png" alt="" width="24" height="24" />
							</span>
							<p>
								<span>{t('Check Latest Blog Post from')}</span>
								<br /> <br />
								<span>{t('Blog List')}</span>
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
