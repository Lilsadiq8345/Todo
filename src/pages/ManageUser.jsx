import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import {
    FaTrash,
    FaUserEdit,
    FaPlus
} from "react-icons/fa";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "User" });
    const [editingUser, setEditingUser] = useState(null);
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    // ✅ Fetch Users on Load
    useEffect(() => {
        if (!token) {
            navigate("/admin-login");
            return;
        }
        fetchUsers();
    }, [token, navigate]);

    // ✅ Filter Users on Changes
    useEffect(() => {
        filterUsers();
    }, [search, users]);

    // ✅ Fetch Users
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://todo-0zke.onrender.com/api/users/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            setError("Error fetching users. Please try again.");
        }
        setLoading(false);
    };

    // ✅ Filter Users
    const filterUsers = () => {
        let filtered = users;

        // 🔎 Real-Time Search Filter
        if (search) {
            filtered = filtered.filter((user) =>
                user.username.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    };

    // ✅ Handle Add User
    const handleAddUser = async () => {
        try {
            const response = await axios.post(
                "https://todo-0zke.onrender.com/api/users/",
                newUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers([...users, response.data]);
            setIsModalOpen(false);
            setNewUser({ username: "", email: "", password: "", role: "User" });
            toast.success("User added successfully!");
        } catch (error) {
            setError("Error adding user. Please try again.");
            toast.error("Failed to add user.");
        }
    };

    // ✅ Handle Delete User
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`https://todo-0zke.onrender.com/api/users/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(users.filter((user) => user.id !== id));
                toast.success("User deleted successfully!");
            } catch (error) {
                setError("Error deleting user. Please try again.");
                toast.error("Failed to delete user.");
            }
        }
    };

    // ✅ Handle Edit User
    const handleEditUser = (user) => {
        setEditingUser(user);
        setNewUser({
            username: user.username,
            email: user.email,
            role: user.role,
            password: "" // Clear the password field for editing
        });
        setIsModalOpen(true);
    };

    // ✅ Handle Form Change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // ✅ Handle Edit User Submit
    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(
                `https://todo-0zke.onrender.com/api/users/${editingUser.id}/`,
                newUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(users.map((user) => (user.id === editingUser.id ? response.data : user)));
            setIsModalOpen(false);
            setEditingUser(null);
            setNewUser({ username: "", email: "", password: "", role: "User" });
            toast.success("User updated successfully!");
        } catch (error) {
            setError("Error updating user. Please try again.");
            toast.error("Failed to update user.");
        }
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <AdminHeader />
                <main className="bg-white rounded-lg shadow-md min-h-screen p-4 mt-20 md:p-8 ml-64 md:ml-64 lg:ml-64">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Manage Users</h2>
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="p-2 border rounded w-full md:w-3/4"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus className="mr-2" /> Add User
                        </button>
                    </div>

                    {loading && <p className="text-center">Loading users...</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2 border">Username</th>
                                    <th className="p-2 border">Email</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="p-2 border">{user.username}</td>
                                        <td className="p-2 border">{user.email}</td>
                                        <td className="p-2 border">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="mr-2 text-yellow-500"
                                            >
                                                <FaUserEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="mr-2 text-red-500"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
                {/* Modal for Adding/Editing User */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-md shadow-md w-11/12 md:w-1/3">
                            <h3 className="text-lg font-semibold mb-4">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={newUser.username}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            {/* Password Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border rounded"
                                    required={!editingUser}
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={editingUser ? handleEditSubmit : handleAddUser}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    {editingUser ? "Update User" : "Add User"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ToastContainer />
        </div>

    );
};

export default ManageUsers;
