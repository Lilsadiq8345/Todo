// src/pages/ProfileSettings.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const ProfileSettings = () => {
    const token = useAuthStore((state) => state.token);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    // ✅ Fetch Profile Data
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/profile/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setName(response.data.name);
            setEmail(response.data.email);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Update Profile Data
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                "http://localhost:8000/api/profile/",
                {
                    name,
                    email,
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Profile updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-indigo-800 mb-4">Profile Settings</h1>
            <form onSubmit={handleUpdateProfile} className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <div className="flex items-center border-b border-gray-300 py-2">
                    <AiOutlineUser className="text-xl text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-2 py-1 focus:outline-none"
                        required
                    />
                </div>
                <div className="flex items-center border-b border-gray-300 py-2">
                    <AiOutlineMail className="text-xl text-gray-500 mr-2" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-2 py-1 focus:outline-none"
                        required
                    />
                </div>
                <div className="flex items-center border-b border-gray-300 py-2">
                    <AiOutlineLock className="text-xl text-gray-500 mr-2" />
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-2 py-1 focus:outline-none"
                    />
                </div>
                <div className="flex items-center border-b border-gray-300 py-2">
                    <AiOutlineLock className="text-xl text-gray-500 mr-2" />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-2 py-1 focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Save Changes"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProfileSettings;
