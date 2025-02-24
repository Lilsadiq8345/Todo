import { Link, useNavigate } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { FaUsers, FaTasks, FaChartBar, FaCog } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";

const AdminSidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/admin-login", { replace: true });
        window.location.reload();
    };

    useEffect(() => {
        if (!token) {
            navigate("/admin-login", { replace: true });
        }
    }, [token, navigate]);

    return (
        <aside
            className={`fixed h-screen bg-blue-900 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20 mt-8"
                }`}
        >
            {/* Sidebar Header */}
            <div className="p-4 text-xl mt-12 font-bold flex justify-between items-center">
                <span className={isSidebarOpen ? "block" : "hidden"}>Admin Panel</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-white focus:outline-none text-lg"
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
                            to="/admin-dashboard"
                            className="flex items-center p-4 hover:bg-blue-700 transition-colors"
                        >
                            <AiOutlineDashboard className="text-lg" />
                            <span className={isSidebarOpen ? "ml-2 block" : "hidden"}>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/manage-user"
                            className="flex items-center p-4 hover:bg-blue-700 transition-colors"
                        >
                            <FaUsers className="text-lg" />
                            <span className={isSidebarOpen ? "ml-2 block" : "hidden"}>Manage Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/manage-tasks"
                            className="flex items-center p-4 hover:bg-blue-700 transition-colors"
                        >
                            <FaTasks className="text-lg" />
                            <span className={isSidebarOpen ? "ml-2 block" : "hidden"}>Task Management</span>
                        </Link>
                    </li>

                    <li>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center p-4 hover:bg-red-700 transition-colors"
                        >
                            <AiOutlineLogout className="text-lg" />
                            <span className={isSidebarOpen ? "ml-2 block" : "hidden"}>Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
