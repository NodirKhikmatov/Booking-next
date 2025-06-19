import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import React, { SyntheticEvent, useState } from 'react';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('property');
	const [expanded, setExpanded] = useState<string | false>('panel1');
	const { t } = useTranslation('common');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/

	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	// Get FAQ data from translations
	const faqData: any = t('faq', { returnObjects: true });

	if (device === 'mobile') {
		return <div>{t('faq.mobile')}</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === 'property' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('property');
						}}
					>
						{t('categories.property')}
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('payment');
						}}
					>
						{t('categories.payment')}
					</div>
					<div
						className={category === 'booking' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('booking');
						}}
					>
						{t('categories.booking')}
					</div>
					<div
						className={category === 'guest' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('guest');
						}}
					>
						{t('categories.guest')}
					</div>
					<div
						className={category === 'buyers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('buyers');
						}}
					>
						{t('categories.buyers')}
					</div>
					<div
						className={category === 'agents' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('agents');
						}}
					>
						{t('categories.agents')}
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						{t('categories.membership')}
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('community');
						}}
					>
						{t('categories.community')}
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						{t('categories.other')}
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{/* @ts-ignore */}
					{faqData[category] &&
						faqData[category].map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										{t('Q')}
									</Typography>
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											{t('A')}
										</Typography>
										<Typography> {ele?.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
