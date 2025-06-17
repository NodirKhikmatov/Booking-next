import styles from '../../../scss/pc/Cart/PaymentCard.module.scss';
import { useState } from 'react';

export const PaymentModal = ({ onClose }: { onClose: () => void }) => {
	const [cardNumber, setCardNumber] = useState('');
	const [cardName, setCardName] = useState('');
	const [expiry, setExpiry] = useState('');
	const [cvv, setCvv] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = () => {
		const cardNumberRegex = /^\d{16}$/; // 16-digit card
		const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
		const cvvRegex = /^\d{3,4}$/; // 3 or 4 digit CVV

		if (!cardNumber || !cardName || !expiry || !cvv) {
			setError('Please fill in all fields');
			return;
		}
		if (!cardNumberRegex.test(cardNumber)) {
			setError('Card number must be 16 digits');
			return;
		}
		if (!expiryRegex.test(expiry)) {
			setError('Expiry must be in MM/YY format');
			return;
		}
		if (!cvvRegex.test(cvv)) {
			setError('CVV must be 3 or 4 digits');
			return;
		}

		setError('');
		alert('Payment submitted!');
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h3>Payment Details</h3>
				<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
					<input
						type="text"
						className={styles.input}
						placeholder="Card Number"
						value={cardNumber}
						onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} // allow only digits
						maxLength={16}
						inputMode="numeric"
					/>
					<input
						type="text"
						className={styles.input}
						placeholder="Cardholder Name"
						value={cardName}
						onChange={(e) => setCardName(e.target.value)}
					/>
					<input
						type="text"
						className={styles.input}
						placeholder="Expiry Date (MM/YY)"
						value={expiry}
						onChange={(e) => setExpiry(e.target.value)}
						maxLength={5}
					/>
					<input
						type="text"
						className={styles.input}
						placeholder="CVV"
						value={cvv}
						onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
						maxLength={4}
						inputMode="numeric"
					/>
					{error && <p className={styles.error}>{error}</p>}
					<button type="button" onClick={handleSubmit} className={styles.submit}>
						Pay Now
					</button>
					<button type="button" onClick={onClose} className={styles.button}>
						Close
					</button>
				</form>
			</div>
		</div>
	);
};
