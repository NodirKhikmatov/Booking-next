import { Box, Stack } from '@mui/material';

import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

type NoticeItem = {
	no: number;
	title: string;
	date: string;
	event?: boolean;
};

const Notice = () => {
	const device = useDeviceDetect();

	const data: NoticeItem[] = [
		{
			no: 1,
			event: true,
			title: 'Register to use and get discounts',
			date: '01.03.2024',
		},
		{
			no: 2,
			title: "It's absolutely free to upload and trade properties",
			date: '31.03.2024',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className="notice-content mobile">
				<span className="title">Notice</span>
				{data.map((ele) => (
					<Box key={ele.title} className={`notice-card ${ele.event ? 'event' : ''}`}>
						{ele.event ? <div>event</div> : <span className="notice-number">{ele.no}</span>}
						<span className="notice-title">{ele.title}</span>
						<span className="notice-date">{ele.date}</span>
					</Box>
				))}
			</Stack>
		);
	}

	return (
		<Stack className="notice-content">
			<span className="title">Notice</span>
			<Stack className="main">
				<Box className="top">
					<span>number</span>
					<span>title</span>
					<span>date</span>
				</Box>
				<Stack className="bottom">
					{data.map((ele) => (
						<div className={`notice-card ${ele.event ? 'event' : ''}`} key={ele.title}>
							{ele.event ? <div>event</div> : <span className="notice-number">{ele.no}</span>}
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
