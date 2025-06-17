import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import React, { SyntheticEvent, useState } from 'react';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';

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

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/

	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		booking: [
			{
				id: '001',
				subject: 'How do I book a villa or penthouse?',
				content:
					'Simply select your desired property, choose dates, and complete the booking form. Our agents will follow up to confirm.',
			},
			{
				id: '002',
				subject: 'Can I make a last-minute booking?',
				content: 'Yes, subject to availability. We recommend contacting our team directly for urgent bookings.',
			},
			{
				id: '003',
				subject: 'Is there a minimum stay requirement?',
				content: 'Yes, most villas and penthouses have a minimum stay of 2–3 nights. Specifics vary by property.',
			},
			{
				id: '004',
				subject: 'What is the cancellation policy?',
				content:
					'Cancellations made 14 days prior are fully refundable. Please check individual listing policies for exceptions.',
			},
			{
				id: '005',
				subject: 'Can I modify my reservation after booking?',
				content: 'Yes, changes can be made depending on availability. Contact support for assistance.',
			},
		],
		payment: [
			{
				id: '006',
				subject: 'What payment methods do you accept?',
				content: 'We accept credit/debit cards, bank transfers, and some mobile payment options.',
			},
			{
				id: '007',
				subject: 'Do I need to pay a deposit?',
				content: 'Yes, a 30–50% deposit is usually required to confirm your booking.',
			},
			{
				id: '008',
				subject: 'Is the payment secure?',
				content: 'Absolutely. Our platform uses encryption and secure payment gateways to protect your information.',
			},
			{
				id: '009',
				subject: 'When is the remaining balance due?',
				content: 'The remaining balance is typically due 7 days before check-in.',
			},
		],
		property: [
			{
				id: '010',
				subject: 'Are the villas and penthouses private?',
				content: 'Yes, all listings are exclusive and private unless stated otherwise.',
			},
			{
				id: '011',
				subject: 'What amenities are included?',
				content:
					'Common amenities include pools, private chefs, housekeeping, and Wi-Fi. Check each listing for full details.',
			},
			{
				id: '012',
				subject: 'Can I request additional services?',
				content: 'Yes, we offer add-ons like airport transfers, private chefs, and spa treatments upon request.',
			},
			{
				id: '013',
				subject: 'Are pets allowed?',
				content: 'Some properties are pet-friendly. Please use the filters or ask our team for options.',
			},
		],
		guest: [
			{
				id: '014',
				subject: 'Is the property child-friendly?',
				content: 'Yes, many of our listings are suitable for families. Look for child-friendly tags on listings.',
			},
			{
				id: '015',
				subject: 'How do I check in?',
				content:
					'Check-in instructions will be emailed to you after booking. Most properties offer contactless check-in.',
			},
			{
				id: '016',
				subject: 'What should I do if I have an issue during my stay?',
				content: 'Contact our 24/7 guest support line. We’re here to help you immediately.',
			},
			{
				id: '017',
				subject: 'Can I host events or parties?',
				content: 'Some properties allow private events. Prior approval is required and additional fees may apply.',
			},
		],
		other: [
			{
				id: '018',
				subject: 'Do you offer loyalty rewards or membership?',
				content: 'We’re working on a loyalty program. Stay tuned!',
			},
			{
				id: '019',
				subject: 'Can I list my own villa or penthouse?',
				content: 'Yes, property owners can contact us to discuss listing terms and conditions.',
			},
			{
				id: '020',
				subject: 'Do you offer group or corporate booking options?',
				content: 'Yes, we handle large group bookings and corporate retreats. Contact us for tailored packages.',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
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
						Property
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('payment');
						}}
					>
						Payment
					</div>
					<div
						className={category === 'buyers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('buyers');
						}}
					>
						Foy Buyers
					</div>
					<div
						className={category === 'agents' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('agents');
						}}
					>
						For Agents
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						Membership
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('community');
						}}
					>
						Community
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data[category] &&
						data[category].map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
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
