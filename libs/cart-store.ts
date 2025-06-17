import { createJSONStorage, persist } from 'zustand/middleware';

// store/cartStore.ts
import { create } from 'zustand';

interface StoreState {
	total: number;
	hasHydrated: boolean;
}

interface StoreAction {
	increment: (count: number) => void;
	decrement: (count: number) => void;
	setHydrated: (val: boolean) => void;
}

export const useCartStore = create<StoreState & StoreAction>()(
	persist(
		(set) => ({
			total: 0,
			hasHydrated: false,
			increment: (count: number) => set(() => ({ total: count })),
			decrement: (count: number) => set(() => ({ total: count })),
			setHydrated: (val: boolean) => set(() => ({ hasHydrated: val })),
		}),
		{
			name: 'cart-total',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated(true);
			},
		},
	),
);
