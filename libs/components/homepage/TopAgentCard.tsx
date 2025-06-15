import { Box, Stack } from '@mui/material';

import { Member } from '../../types/member/member';
import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<div className="agent-photo">
					<img src={agentImage} alt={`${agent?.memberNick}'s photo`} />
				</div>

				<div className="agent-info">
					<strong>{agent?.memberNick}</strong>
					<span>{agent?.memberJob}</span>
				</div>
			</Stack>
		);
	}
};

export default TopAgentCard;
