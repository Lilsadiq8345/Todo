import { Link } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineLogout } from "react-icons/ai";
import useAuthStore from "../store/authStore";

const Sidebar = () => {
    const clearToken = useAuthStore((state) => state.clearToken);

    return (
        <aside className="w-64 bg-indigo-900 text-white h-screen mt-4 fixed">
            <div className="p-4 text-2xl font-bold">Todo App</div>
            <nav>
                <ul>
                    <li>
                        <Link to="/dashboard" className="block p-4 hover:bg-gray-600">
                            <AiOutlineDashboard className="inline-block mr-2" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/tasks" className="block p-4 hover:bg-gray-600">
                            <AiOutlineDashboard className="inline-block mr-2" />
                            Tasks Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile-settings" className="block p-4 hover:bg-gray-600">
                            <AiOutlineDashboard className="inline-block mr-2" />
                            Profile Settings
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                clearToken();
                                window.location.href = "/login";
                            }}
                            className="w-full text-left p-4 hover:bg-gray-600"
                        >
                            <AiOutlineLogout className="inline-block mr-2" />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
