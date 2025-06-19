import { Box, Stack } from '@mui/material';

import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

type NoticeItem = {
	no: number;
	title: string;
	date: string;
	event?: boolean;
	key: string;
};

const Notice = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const data: NoticeItem[] = [
		{
			no: 1,
			event: true,
			key: 'register_discount',
			title: t('register_discount'),
			date: '01.03.2025',
		},
		{
			no: 2,
			key: 'free_booking_webapp',
			title: t('free_booking_webapp'),
			date: '07.03.2025',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className="notice-content mobile">
				<span className="title">{t('notice')}</span>
				{data.map((ele) => (
					<div key={ele.key} className={`notice-card ${ele.event ? 'event' : ''}`}>
						{ele.event ? <div>{t('event')}</div> : <span className="notice-number">{ele.no}</span>}
						<span className="notice-title">{ele.title}</span>
						<span className="notice-date">{ele.date}</span>
					</div>
				))}
			</Stack>
		);
	}

	return (
		<Stack className="notice-content">
			<span className="title">{t('notice')}</span>
			<Stack className="main">
				<div className="top">
					<span>{t('number')}</span>
					<span>{t('title')}</span>
					<span>{t('date')}</span>
				</div>
				<Stack className="bottom">
					{data.map((ele) => (
						<div className={`notice-card ${ele.event ? 'event' : ''}`} key={ele.key}>
							{ele.event ? <div>{t('event')}</div> : <span className="notice-number">{ele.no}</span>}
							<span className="notice-title">{ele.title}</span>
							<span className="notice-date">{ele.date}</span>
						</div>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notice;
