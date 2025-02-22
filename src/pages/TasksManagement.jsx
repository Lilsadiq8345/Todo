// src/pages/TasksManagement.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskModal from "./TaskModal";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import {
    AiOutlinePlus,
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlineCheck,
    AiOutlineCloseCircle,
} from "react-icons/ai";
import DashboardHeader from "./DashboardHeader";
const TasksManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    // Fetch Tasks on Load
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchTasks();
    }, [token, navigate]);

    // Filter Tasks on Changes
    useEffect(() => {
        filterTasks();
    }, [searchTerm, filterStatus, tasks]);

    // Fetch Tasks
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/tasks/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched Tasks:", response.data);
            setTasks(response.data);
            setFilteredTasks(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Filter Tasks
    const filterTasks = () => {
        let filtered = tasks;

        if (searchTerm) {
            filtered = filtered.filter(
                (task) =>
                    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== "all") {
            filtered = filtered.filter((task) =>
                filterStatus === "completed" ? task.is_completed : !task.is_completed
            );
        }

        setFilteredTasks(filtered);
    };

    // Create or Update Task
    const handleSaveTask = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                // Update Task
                const response = await axios.put(
                    `http://localhost:8000/api/tasks/${editingTask.id}/`,
                    { title, description },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data : task)));
                toast.success("Task updated successfully!");
            } else {
                // Create Task
                const response = await axios.post(
                    "http://localhost:8000/api/tasks/",
                    { title, description },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTasks([...tasks, response.data]);
                toast.success("Task created successfully!");
            }
            setTitle("");
            setDescription("");
            setEditingTask(null);
            setModalOpen(false);
        } catch (error) {
            console.error("Save Task Error:", error);
            toast.error("Failed to save task.");
        }
    };

    // Edit Task - Open Modal with Task Details
    const handleEditTask = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        setModalOpen(true);
    };

    // Delete Task
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(tasks.filter((task) => task.id !== taskId));
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Delete Task Error:", error);
            toast.error("Failed to delete task.");
        }
    };

    // Toggle Task Completion
    const handleToggleCompletion = async (task) => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/api/tasks/${task.id}/`,
                { is_completed: !task.is_completed },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
            toast.success("Task status updated!");
        } catch (error) {
            console.error("Toggle Completion Error:", error);
            toast.error("Failed to update task status.");
        }
    };

    return (
        <>

            <DashboardHeader />
            <Sidebar />
            <main className="bg-gray-100 min-h-screen p-4 mt-12 md:p-8 ml-64 md:ml-64 lg:ml-64">

                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-bold text-indigo-800">Manage Tasks</h1>
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setTitle("");
                                setDescription("");
                                setModalOpen(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            <AiOutlinePlus className="inline mr-2" />
                            Add Task
                        </button>
                        <TaskModal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            onSave={handleSaveTask}
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                            isEditing={isEditing}
                        />

                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left">Title</th>
                                    <th className="py-3 px-4 text-left">Description</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="border-b">
                                        <td className="py-2 px-4">{task.title}</td>
                                        <td className="py-2 px-4">{task.description}</td>
                                        <td className="py-2 px-4">
                                            <span className={`font-semibold ${task.is_completed ? "text-green-600" : "text-yellow-600"}`}>
                                                {task.is_completed ? "Completed" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 text-center space-x-2">
                                            <button onClick={() => handleEditTask(task)} className="text-yellow-500"><AiOutlineEdit /></button>
                                            <button onClick={() => handleDeleteTask(task.id)} className="text-red-500"><AiOutlineDelete /></button>
                                            <button onClick={() => handleToggleCompletion(task)} className="text-green-500"><AiOutlineCheck /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <ToastContainer />
            <Footer />
        </>
    );
};

export default TasksManagement;
