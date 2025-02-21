import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),

    login: async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                email,
                password,
            });
            set({ token: response.data.access, user: response.data.user_type });
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    logout: () => {
        set({ user: null, token: null });
    }
}));

export default useAuthStore;
