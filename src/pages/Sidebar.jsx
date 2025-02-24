// src/components/Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineLogout } from "react-icons/ai";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);  // Get logout function
    const token = useAuthStore((state) => state.token);    // Get token state
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to handle sidebar visibility

    // Correct Logout Function
    const handleLogout = () => {
        logout();  // Clear Zustand and Local Storage
        navigate("/login", { replace: true });
        window.location.reload();  // Force reload to reset state
    };

    // Redirect to login if token is null
    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    return (
        <aside className={`fixed h-screen bg-indigo-900 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
            {/* Sidebar Header */}
            <div className="p-4 text-2xl mt-4 font-bold flex justify-between items-center">
                <span className={isSidebarOpen ? "block" : "hidden"}>Todo App</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-white focus:outline-none text-xl"
                    aria-label="Toggle Sidebar"
                >
                    {isSidebarOpen ? "☰" : "✖"}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="mt-4">
                <ul>
                    <li>
                        <Link
                            to="/dashboard"
                            className="flex items-center p-4 hover:bg-indigo-700 transition-colors"
                        >
                            <AiOutlineDashboard className="text-xl" />
                            <span className={isSidebarOpen ? "ml-2 block" : "hidden"}>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/tasks"
                            className="flex items-center p-4 hover:bg-indigo-700 transition-colors"
                        >
                            <AiOutlineDashboard className="text-xl" />
                            <span className={isSidebarOpen ? "ml-2 block" : "hidden"}>Tasks Management</span>
                        </Link>
                    </li>

                    <li>
                        <button
                            onClick={handleLogout}  // Correct Logout Function
                            className="w-full flex items-center p-4 hover:bg-red-700 transition-colors"
                        >
                            <AiOutlineLogout className="text-xl" />
                            <span className={isSidebarOpen ? "ml-2 block" : "hidden"}>Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
