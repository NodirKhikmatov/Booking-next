import React, { useEffect, useState } from 'react';

import { Box } from '@mui/system';
import { PaymentModal } from '../../libs/components/common/PaymentCard';
import styles from '../../scss/pc/Cart/CartList.module.scss';
import { useCartStore } from '../../libs/cart-store';
import { useRouter } from 'next/navigation';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

interface CartItem {
	id: string;
	name: string;
	price: number;
	image: string;
	quantity: number;
}

const LOCAL_STORAGE_KEY = 'my-cart';

const CartPage = () => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const { decrement } = useCartStore();
	const router = useRouter();

	const [showPaymentModal, setShowPaymentModal] = useState(false);

	// Load cart items from localStorage when component mounts
	useEffect(() => {
		const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedCart) {
			setCartItems(JSON.parse(storedCart));
		}
	}, []);

	// Remove item from cart
	const removeItem = (id: string) => {
		const filter = cartItems.filter((item) => item.id !== id);
		setCartItems(filter);
		const cvt = JSON.stringify(filter);
		const tl = filter.length;
		decrement(tl);
		localStorage.setItem(LOCAL_STORAGE_KEY, cvt);
	};
	const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

	const goToPayment = () => {
		setShowPaymentModal(true);
	};

	return (
		// @ts-ignore
		<Box className={styles.cartContainer}>
			<div className={styles.cartBox}>
				<h2>Product</h2>
				{cartItems.length === 0 && <p>Your cart is empty</p>}
				{cartItems.map((item) => (
					<div key={item.id} className={styles.cartItem}>
						<img src={item.image} alt={item.name} />
						<div className={styles.itemDetails}>
							<h4>{item.name}</h4>
							<p>Price: ${item.price}</p>
							<button onClick={() => removeItem(item.id)}>Remove</button>
						</div>
					</div>
				))}
			</div>

			<div className={styles.cartSummary}>
				<h3>Cart Totals</h3>
				<div className={styles.summaryRow}>
					<span>Subtotal</span>
					<span>${total.toFixed(2)}</span>
				</div>
				<div className={`${styles.summaryRow} ${styles.total}`}>
					<strong>Total</strong>
					<strong>${total.toFixed(2)}</strong>
				</div>
				<button onClick={goToPayment} className={styles.checkoutBtn}>
					Proceed to Checkout
				</button>
			</div>
			{showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} />}
		</Box>
	);
};

export default withLayoutBasic(CartPage);
