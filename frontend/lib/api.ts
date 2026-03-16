import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const register = (data: any) => API.post('/api/auth/register', data);
export const login = (data: any) => API.post('/api/auth/login', data);
export const getMe = () => API.get('/api/auth/me');

// Menu
export const getMenuItems = (params?: any) => API.get('/api/menu', { params });
export const getFeaturedItems = () => API.get('/api/menu/featured');
export const getPopularItems = () => API.get('/api/menu/popular');
export const addMenuItem = (data: any) => API.post('/api/menu', data);
export const updateMenuItem = (id: string, data: any) => API.put(`/api/menu/${id}`, data);
export const deleteMenuItem = (id: string) => API.delete(`/api/menu/${id}`);

// Orders
export const createOrder = (data: any) => API.post('/api/orders', data);
export const getMyOrders = () => API.get('/api/orders/my-orders');
export const getOrderById = (id: string) => API.get(`/api/orders/${id}`);
export const getAllOrders = () => API.get('/api/orders');
export const updateOrderStatus = (id: string, data: any) => API.put(`/api/orders/${id}/status`, data);

// Admin
export const getAdminStats = () => API.get('/api/admin/stats');
export const seedMenu = () => API.post('/api/admin/seed-menu');

// Users
export const getUsers = () => API.get('/api/users');
export const updateProfile = (data: any) => API.put('/api/users/profile', data);

// Notifications
export const getNotifications = () => API.get('/api/notifications');
export const markAllNotificationsRead = () => API.patch('/api/notifications/read-all');

export default API;
