// src/store/authStore.js
import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => {
        localStorage.setItem("token", token);  // Save token in localStorage
        set({ token });
    },

    login: async (email, password) => {
        try {
            const response = await axios.post("http://localhost:8000/api/login/", {
                email,
                password,
            });
            set({ token: response.data.access, user: response.data.user_type });
            localStorage.setItem("token", response.data.access);  // Save token
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    logout: () => {
        // Clear Zustand State and Local Storage
        localStorage.removeItem("token");
        set({ user: null, token: null });
    }
}));

export default useAuthStore;
