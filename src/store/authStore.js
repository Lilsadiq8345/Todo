import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
    token: localStorage.getItem("token") || null, // Load token from localStorage

    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user)); // Save user in localStorage
        set({ user });
    },

    setToken: (token) => {
        localStorage.setItem("token", token); // Save token in localStorage
        set({ token });
    },

    login: async (email, password) => {
        try {
            const response = await axios.post("https://todo-0zke.onrender.com/api/login/", {
                email,
                password,
            });

            const { access, user_type } = response.data;

            localStorage.setItem("token", access); // Save token
            localStorage.setItem("user", JSON.stringify(user_type)); // Save user data
            set({ token: access, user: user_type });

            return response;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null });
    }
}));

export default useAuthStore;
