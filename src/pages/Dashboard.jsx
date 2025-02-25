
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
    // ... (Your existing state and functions) ...

    return (
        <>
            <DashboardHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Sidebar />

            <main className="pl-0 md:pl-64 bg-gray-100 min-h-screen mt-11 p-4 md:p-6"> {/* Adjusted padding */}
                <div className="container mx-auto">
                    {/* Welcome Banner */}
                    <section className="bg-indigo-900 text-white rounded-lg p-4 md:p-6 mb-4 md:mb-8 shadow-md"> {/* Adjusted padding and margin */}
                        <h1 className="text-2xl md:text-3xl font-bold">{getGreeting()}!</h1> {/* Responsive font size */}
                        <p className="mt-2">
                            Welcome to your dashboard. Manage your tasks efficiently and effectively.
                        </p>
                    </section>

                    {/* Summary Section */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-8"> {/* Adjusted gap and margin */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center"> {/* Adjusted padding */}
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Total Tasks</h2> {/* Responsive font size */}
                            <p className="text-2xl md:text-3xl font-bold text-indigo-600">{totalTasks}</p> {/* Responsive font size */}
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center"> {/* Adjusted padding */}
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Completed Tasks</h2> {/* Responsive font size */}
                            <p className="text-2xl md:text-3xl font-bold text-green-600">{completedTasks}</p> {/* Responsive font size */}
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center"> {/* Adjusted padding */}
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Pending Tasks</h2> {/* Responsive font size */}
                            <p className="text-2xl md:text-3xl font-bold text-yellow-600">{pendingTasks}</p> {/* Responsive font size */}
                        </div>
                    </section>

                    {/* Tasks Overview */}
                    <section className="bg-white p-4 md:p-6 rounded-lg shadow-md"> {/* Adjusted padding */}
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">Tasks Overview</h2> {/* Responsive font size and margin */}
                        {filteredTasks.length > 0 ? (
                            <ul className="space-y-2 md:space-y-4"> {/* Adjusted space */}
                                {filteredTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="border-b pb-2 flex flex-col md:flex-row justify-between items-start md:items-center" // Responsive flex direction
                                    >
                                        <div>
                                            <h3 className="text-base md:text-lg font-semibold text-indigo-800"> {/* Responsive font size */}
                                                {task.title}
                                            </h3>
                                            <p className="text-sm md:text-gray-600">{task.description}</p> {/* Responsive font size */}
                                            <span
                                                className={`text-xs md:text-sm font-semibold ${task.is_completed
                                                    ? "text-green-600"
                                                    : "text-yellow-600"
                                                    }`} // Responsive font size
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
