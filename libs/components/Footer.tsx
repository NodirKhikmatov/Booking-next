import { Box, Stack } from '@mui/material';

import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from 'next/link';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import moment from 'moment';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

const Footer = () => {
	const device = useDeviceDetect();
	const currentYear = moment().year();
	const { t } = useTranslation('common');

	const PropertyLinks = () => (
		<div>
			<strong>{t('Find Properties')}</strong>
			<Link href="/properties/villa">{t('Villas')}</Link>
			<Link href="/properties/penthouse">{t('Penthouses')}</Link>
			<Link href="/properties/serviced">{t('Serviced Apartments')}</Link>
			<Link href="/properties/short-term">{t('Short-term Rentals')}</Link>
		</div>
	);

	const QuickLinks = () => (
		<div>
			<strong>{t('Quick Links')}</strong>
			<Link href="/terms">{t('Terms of Use')}</Link>
			<Link href="/privacy">{t('Privacy Policy')}</Link>
			<Link href="/pricing">{t('Pricing Plans')}</Link>
			<Link href="/services">{t('Our Services')}</Link>
			<Link href="/support">{t('Contact Support')}</Link>
			<Link href="/faq">{t('FAQs')}</Link>
		</div>
	);

	const DiscoverLinks = () => (
		<div>
			<strong>{t('Discover')}</strong>
			<Link href="/location/seoul">{t('Seoul')}</Link>
			<Link href="/location/gyeongido">{t('Gyeongido')}</Link>
			<Link href="/location/busan">{t('Busan')}</Link>
			<Link href="/location/jejudo">{t('Jejudo')}</Link>
		</div>
	);

	const SocialIcons = () => (
		<div className={'media-box'}>
			<FacebookOutlinedIcon />
			<TelegramIcon />
			<InstagramIcon />
			<TwitterIcon />
		</div>
	);

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/booking.webp" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('total free customer care')}</span>
							<p>+82 10 2461 9944</p>
						</Box>
						<a
							href="https://www.google.com/maps/place/Girin-daero,+Wansan-gu,+Jeonju-si,+Jeollabuk-do"
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: 'none', color: 'inherit' }}
						>
							<Box component={'div'} className={'footer-box'}>
								<span>{t('JEONJU')}</span>
								<p>
									{t('Girin-daero, Wansan-gu, Jeonju-si,')}
									<br />
									{t('Jeonbuk State')}
								</p>
							</Box>
						</a>
						<Box component={'div'} className={'footer-box'}>
							<p>{t('follow us on social media')}</p>
							<div className={'media-box'}>
								<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
									<FacebookOutlinedIcon />
								</a>
								<a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
									<TelegramIcon />
								</a>
								<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
									<InstagramIcon />
								</a>
								<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
									<TwitterIcon />
								</a>
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>{t('Company')}</strong>
								<Link href="/properties/hotel">{t('Hotels')}</Link>

								<span>{t('Property Low to hide')}</span>
							</div>
							<div>
								<strong>{t('Quick Links')}</strong>
								<span>{t('Terms of Use')}</span>
								<span>{t('Privacy Policy')}</span>
								<span>{t('Pricing Plans')}</span>
								<span>{t('Our Services')}</span>
								<span>{t('Contact Support')}</span>
								<span>{t('FAQs')}</span>
							</div>
							<div>
								<strong>{t('Discover')}</strong>
								<span>{t('Seoul')}</span>
								<span>{t('Gyeongido')}</span>
								<span>{t('Busan')}</span>
								<span>{t('Jejudo')}</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>
						{t('© Parador - All rights reserved. Parador')} {moment().year()}
					</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/booking.webp" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('total free customer care')}</span>
							<p>+82 10 2461 9944</p>
						</Box>
						<a
							href="https://www.google.com/maps/place/Girin-daero,+Wansan-gu,+Jeonju-si,+Jeollabuk-do"
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: 'none', color: 'inherit' }}
						>
							<Box component={'div'} className={'footer-box'}>
								<span>{t('JEONJU')}</span>
								<p>
									{t('Girin-daero, Wansan-gu, Jeonju-si,')}
									<br />
									{t('Jeonbuk State')}
								</p>
							</Box>
						</a>
						<Box component={'div'} className={'footer-box'}>
							<p>{t('follow us on social media')}</p>
							<div className={'media-box'}>
								<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
									<FacebookOutlinedIcon />
								</a>
								<a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
									<TelegramIcon />
								</a>
								<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
									<InstagramIcon />
								</a>
								<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
									<TwitterIcon />
								</a>
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>{t('keep yourself up to date')}</strong>
							<div>
								<input type="text" placeholder={t('Your Email')} />
								<span>{t('Subscribe')}</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong className="company">{t('Company')}</strong>

								<Link href="/" className="span">
									{t('Home')}
								</Link>

								<Link href="/property" className="span">
									{t('Hotels & Villas')}
								</Link>
								<Link href="/community" className="span">
									{t('News')}
								</Link>
								<Link href="/mypage" className="span">
									{t('My Page')}
								</Link>
							</div>
							<div>
								<strong>{t('Quick Links')}</strong>
								<Link href="/account/join" className="span">
									{t('Login/Signup')}
								</Link>
								<Link href="/property?input" className="span">
									{t('Find Your Luxery place')}
								</Link>
								<Link href="/cs?tab=faq" className="span">
									{t('Privacy Policy')}
								</Link>
								<Link href="/agent/detail" className="span">
									{t('Contact Support')}
								</Link>
							</div>
							<div>
								<strong>{t('Discover')}</strong>
								<Link href="/community" className="span">
									{t('Thailand')}
								</Link>
								<Link href="/community" className="span">
									{t('Malasia')}
								</Link>
								<Link href="/community" className="span">
									{t('Bali')}
								</Link>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>
						{t('© Parador - All rights reserved. Parador')} {moment().year()}
					</span>
					<span>{t('Privacy · Terms · Sitemap')}</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
