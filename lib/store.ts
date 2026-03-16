'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

interface AppState {
    // Auth
    user: User | null;
    token: string | null;
    setUser: (user: User, token: string) => void;
    logout: () => void;

    // Cart
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    closeCart: () => void;
    cartTotal: () => number;
    cartCount: () => number;
}

const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,

            setUser: (user, token) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                }
                set({ user, token });
            },

            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
                set({ user: null, token: null });
            },

            cart: [],
            isCartOpen: false,

            addToCart: (item) => {
                const { cart } = get();
                const existing = cart.find(c => c.menuItemId === item.menuItemId);
                if (existing) {
                    set({ cart: cart.map(c => c.menuItemId === item.menuItemId ? { ...c, quantity: c.quantity + item.quantity } : c) });
                } else {
                    set({ cart: [...cart, { ...item, id: `${item.menuItemId}-${Date.now()}` }] });
                }
            },

            removeFromCart: (id) => set({ cart: get().cart.filter(c => c.id !== id) }),

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    set({ cart: get().cart.filter(c => c.id !== id) });
                } else {
                    set({ cart: get().cart.map(c => c.id === id ? { ...c, quantity } : c) });
                }
            },

            clearCart: () => set({ cart: [] }),
            toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
            closeCart: () => set({ isCartOpen: false }),
            cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
        }),
        {
            name: 'shawarma-inn-store',
            partialize: (state) => ({ cart: state.cart, user: state.user, token: state.token }),
        }
    )
);

export default useStore;
