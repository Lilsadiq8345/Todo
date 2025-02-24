import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { FaCheck, FaTimes, FaUsers, FaTasks, FaUserShield } from "react-icons/fa";

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate("/admin-login");
        else {
            fetchTasks();
            fetchUsers();
        }
    }, [token, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("https://todo-0zke.onrender.com/api/tasks/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch tasks.");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://todo-0zke.onrender.com/api/users/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch users.");
        }
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.is_completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.is_active).length;
    const adminUsers = users.filter(user => user.is_admin).length;

    const handleTaskAction = async (taskId, action) => {
        try {
            await axios.put(`https://todo-0zke.onrender.com/api/tasks/${taskId}/`, { status: action }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks();
            toast.success(`Task ${action} successfully!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task.");
        }
    };

    return (
        <>
            <AdminHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <AdminSidebar />
            <main className="pl-64 bg-gray-100 min-h-screen mt-11 p-6">
                <div className="container mx-auto">
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FaUsers className="text-4xl text-blue-500 mx-auto" />
                            <h2 className="text-xl font-bold">Total Users</h2>
                            <p className="text-3xl font-bold">{totalUsers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FaUserShield className="text-4xl text-green-500 mx-auto" />
                            <h2 className="text-xl font-bold">Active Users</h2>
                            <p className="text-3xl font-bold">{activeUsers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FaTasks className="text-4xl text-indigo-500 mx-auto" />
                            <h2 className="text-xl font-bold">Total Tasks</h2>
                            <p className="text-3xl font-bold">{totalTasks}</p>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Task Management</h2>
                        {tasks.length > 0 ? (
                            <ul className="space-y-4">
                                {tasks.map(task => (
                                    <li key={task.id} className="border-b pb-2 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">{task.title}</h3>
                                            <p className="text-gray-600">{task.description}</p>
                                            <span className={`text-sm font-semibold ${task.is_completed ? "text-green-600" : "text-yellow-600"}`}>{task.is_completed ? "Completed" : "Pending"}</span>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No tasks available.</p>
                        )}
                    </section>
                </div>
            </main>
            <ToastContainer />
            <AdminFooter />
        </>
    );
};

export default AdminDashboard;