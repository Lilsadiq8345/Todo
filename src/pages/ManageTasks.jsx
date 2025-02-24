import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import TaskModal from "./TaskModal"; // Assuming you have the TaskModal component

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    // Fetch Tasks on Load
    useEffect(() => {
        if (!token) {
            navigate("admin-login");
            return;
        }
        fetchTasks();
    }, [token, navigate]);

    // Filter Tasks on Changes
    useEffect(() => {
        filterTasks();
    }, [search, tasks]);

    // Fetch Tasks
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8000/api/tasks/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data);
            setFilteredTasks(response.data);
        } catch (error) {
            setError("Error fetching tasks. Please try again.");
            toast.error("Error fetching tasks. Please try again.");
        }
        setLoading(false);
    };

    // Filter Tasks
    const filterTasks = () => {
        let filtered = tasks;

        // Real-Time Search Filter
        if (search) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredTasks(filtered);
    };

    // Handle Add Task
    const handleAddTask = async (newTask) => {
        if (!newTask.title || !newTask.description || !newTask.due_date) {
            setError("All fields are required.");
            toast.error("Please fill out all fields.");
            return;
        }

        try {
            // Format newTask to only include the fields expected by your backend
            const taskData = {
                title: newTask.title,
                description: newTask.description,
                due_date: newTask.due_date,
                status: newTask.status,
            };

            const response = await axios.post(
                "http://localhost:8000/api/tasks/",
                taskData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle success
            if (response.status === 201) {
                setTasks([...tasks, response.data]);
                setIsModalOpen(false);
                toast.success("Task added successfully!");
            }
        } catch (error) {
            // Handle errors
            if (error.response) {
                setError(error.response.data.detail || "Error adding task.");
                toast.error(error.response.data.detail || "Error adding task.");
            } else if (error.request) {
                setError("Network error. Please try again.");
                toast.error("Network error. Please try again.");
            } else {
                setError("An error occurred. Please try again.");
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    // Handle Delete Task
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(tasks.filter((task) => task.id !== id));
                toast.success("Task deleted successfully!");
            } catch (error) {
                setError("Error deleting task. Please try again.");
                toast.error("Failed to delete task.");
            }
        }
    };

    // Handle Edit Task
    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <AdminHeader />
                <main className="bg-white rounded-lg shadow-md min-h-screen p-4 mt-20 md:p-8 ml-64 md:ml-64 lg:ml-64">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Manage Tasks</h2>
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="p-2 border rounded w-full md:w-3/4"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus className="mr-2" /> Add Task
                        </button>
                    </div>

                    {loading && <p className="text-center">Loading tasks...</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2 border">Title</th>
                                    <th className="p-2 border">Description</th>
                                    <th className="p-2 border">Due Date</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="border-b">
                                        <td className="p-2">{task.title}</td>
                                        <td className="p-2">{task.description}</td>
                                        <td className="p-2">{task.due_date}</td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => handleEditTask(task)}
                                                className="bg-yellow-500 text-white p-2 rounded mr-2"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="bg-red-500 text-white p-2 rounded"
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
                <AdminFooter />
            </div>

            {/* Modal for Adding/Editing Tasks */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isEditing={!!editingTask}
                editingTask={editingTask}
                refreshTasks={fetchTasks}
                handleAddTask={handleAddTask}
            />
            <ToastContainer />
        </div>

    );
};

export default ManageTasks;
