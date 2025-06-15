import React, { useEffect, useState } from 'react';

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

	// Load cart items from localStorage when component mounts
	useEffect(() => {
		const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedCart) {
			setCartItems(JSON.parse(storedCart));
		}
	}, []);


	// Remove item from cart
	const removeItem = (id: string) => {
		setCartItems((items) => items.filter((item) => item.id !== id));
	};

	// Change quantity of an item
	const updateQuantity = (id: string, quantity: number) => {
		if (quantity < 1) return;
		setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)));
	};

	return (
		<div>
			<h2>Your Cart</h2>
			{cartItems.length === 0 && <p>Your cart is empty</p>}
			{cartItems.map((item) => (
				<div key={item.id} style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
					<img src={item.image} alt={item.name} style={{ width: 80, height: 50, objectFit: 'cover' }} />
					<h4>{item.name}</h4>
					<p>Price: ${item.price}</p>
					<input
						type="number"
						min={1}
						value={item.quantity}
						onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
					/>
					<button onClick={() => removeItem(item.id)}>Remove</button>
				</div>
			))}
		</div>
	);
};

export default withLayoutBasic(CartPage);
