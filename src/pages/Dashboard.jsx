// src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import Footer from "./Footer";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    //Fetch Tasks on Load
    useEffect(() => {
        if (!token) navigate("/login");
        else fetchTasks();
    }, [token, navigate]);

    //Fetch Tasks
    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/tasks/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch tasks.");
        }
    };

    //Filter Tasks on Search
    useEffect(() => {
        let filtered = tasks;
        if (searchTerm) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredTasks(filtered);
    }, [searchTerm, tasks]);

    //Calculate Summary Data
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.is_completed).length;
    const pendingTasks = totalTasks - completedTasks;

    //Dynamic Greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <>
            <DashboardHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Sidebar />

            <main className="pl-64 bg-gray-100 min-h-screen mt-11 p-6">
                <div className="container mx-auto">
                    {/* Welcome Banner */}
                    <section className="bg-indigo-900 text-white rounded-lg p-6 mb-8 shadow-md">
                        <h1 className="text-3xl font-bold">{getGreeting()}!</h1>
                        <p className="mt-2">
                            Welcome to your dashboard. Manage your tasks efficiently and effectively.
                        </p>
                    </section>

                    {/* Summary Section */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-bold text-gray-800">Total Tasks</h2>
                            <p className="text-3xl font-bold text-indigo-600">{totalTasks}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-bold text-gray-800">Completed Tasks</h2>
                            <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-bold text-gray-800">Pending Tasks</h2>
                            <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
                        </div>
                    </section>

                    {/* Tasks Overview */}
                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tasks Overview</h2>
                        {filteredTasks.length > 0 ? (
                            <ul className="space-y-4">
                                {filteredTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="border-b pb-2 flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold text-indigo-800">
                                                {task.title}
                                            </h3>
                                            <p className="text-gray-600">{task.description}</p>
                                            <span
                                                className={`text-sm font-semibold ${task.is_completed
                                                    ? "text-green-600"
                                                    : "text-yellow-600"
                                                    }`}
                                            >
                                                {task.is_completed ? "Completed" : "Pending"}
                                            </span>
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
            <Footer />
        </>
    );
};

export default Dashboard;
