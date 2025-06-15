'use client';

import { Box, Button, IconButton, Stack, Typography } from '@mui/material';

import { CartItem } from '../../types/cart';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
	cartItems: CartItem[];
	onRemove: (id: number) => void;
	onQuantityChange: (id: number, quantity: number) => void;
}

const CartList = ({ cartItems, onRemove, onQuantityChange }: Props) => {
	if (cartItems.length === 0) {
		return <Typography>No items in your cart.</Typography>;
	}

	return (
		<Stack spacing={2}>
			{cartItems.map((item) => (
				<Box
					key={item.id}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						border: '1px solid #ccc',
						borderRadius: '8px',
						padding: '16px',
					}}
				>
					<Stack direction="row" spacing={2} alignItems="center">
						<img src={item.image} alt={item.name} width={80} height={80} />
						<Box>
							<Typography variant="h6">{item.name}</Typography>
							<Typography>
								${item.price} x {item.quantity}
							</Typography>
							<Typography>Total: ${item.price * item.quantity}</Typography>
						</Box>
					</Stack>
					<Stack direction="row" spacing={1} alignItems="center">
						<Button onClick={() => onQuantityChange(item.id, item.quantity - 1)}>-</Button>
						<Typography>{item.quantity}</Typography>
						<Button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</Button>
						<IconButton onClick={() => onRemove(item.id)}>
							<DeleteIcon />
						</IconButton>
					</Stack>
				</Box>
			))}
		</Stack>
	);
};

export default CartList;
