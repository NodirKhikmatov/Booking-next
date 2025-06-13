import { Box, Stack } from '@mui/material';

import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from 'next/link';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import moment from 'moment';
import useDeviceDetect from '../hooks/useDeviceDetect';

const Footer = () => {
	const device = useDeviceDetect();
	const currentYear = moment().year();

	const PropertyLinks = () => (
		<div>
			<strong>Find Properties</strong>
			<Link href="/properties/villa">Villas</Link>
			<Link href="/properties/penthouse">Penthouses</Link>
			<Link href="/properties/serviced">Serviced Apartments</Link>
			<Link href="/properties/short-term">Short-term Rentals</Link>
		</div>
	);

	const QuickLinks = () => (
		<div>
			<strong>Quick Links</strong>
			<Link href="/terms">Terms of Use</Link>
			<Link href="/privacy">Privacy Policy</Link>
			<Link href="/pricing">Pricing Plans</Link>
			<Link href="/services">Our Services</Link>
			<Link href="/support">Contact Support</Link>
			<Link href="/faq">FAQs</Link>
		</div>
	);

	const DiscoverLinks = () => (
		<div>
			<strong>Discover</strong>
			<Link href="/location/seoul">Seoul</Link>
			<Link href="/location/gyeongido">Gyeongido</Link>
			<Link href="/location/busan">Busan</Link>
			<Link href="/location/jejudo">Jejudo</Link>
		</div>
	);

	const SocialIcons = () => (
		<div className={styles['media-box']}>
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
							<span>total free customer care</span>
							<p>+82 10 2461 9944</p>
						</Box>
						<a
							href="https://www.google.com/maps/place/Girin-daero,+Wansan-gu,+Jeonju-si,+Jeollabuk-do"
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: 'none', color: 'inherit' }}
						>
							<Box component={'div'} className={'footer-box'}>
								<span>JEONJU</span>
								<p>
									Girin-daero, Wansan-gu, Jeonju-si,
									<br />
									Jeonbuk State
								</p>
							</Box>
						</a>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
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
								<strong>Company</strong>
								<Link href="/properties/hotel">Hotels</Link>

								<span>Property Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Parador - All rights reserved. Parador {moment().year()}</span>
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
							<span>total free customer care</span>
							<p>+82 10 2461 9944</p>
						</Box>
						<a
							href="https://www.google.com/maps/place/Girin-daero,+Wansan-gu,+Jeonju-si,+Jeollabuk-do"
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: 'none', color: 'inherit' }}
						>
							<Box component={'div'} className={'footer-box'}>
								<span>JEONJU</span>
								<p>
									Girin-daero, Wansan-gu, Jeonju-si,
									<br />
									Jeonbuk State
								</p>
							</Box>
						</a>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
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
							<strong>keep yourself up to date</strong>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong className="company">Company</strong>

								<Link href="/" className="span">
									Home
								</Link>

								<Link href="/property" className="span">
									Hotel&Villas
								</Link>
								<Link href="/community" className="span">
									News
								</Link>
								<Link href="/mypage" className="span">
									MyPage
								</Link>
							</div>
							<div>
								<strong>Quick Links</strong>
								<Link href="/account/join" className="span">
									Login/Signup
								</Link>
								<Link href="/property?input" className="span">
									Find Your Luxery place
								</Link>
								<Link href="/cs?tab=faq" className="span">
									Privacy Policy
								</Link>
								<Link href="/agent/detail" className="span">
									Contact Support
								</Link>
							</div>
							<div>
								<strong>Discover</strong>
								<Link href="/community" className="span">
									Thailand
								</Link>
								<Link href="/community" className="span">
									Malasia
								</Link>
								<Link href="/community" className="span">
									Bali
								</Link>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Parador - All rights reserved. Parador {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
