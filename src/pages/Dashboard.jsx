import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchTasks();
    }, [token, navigate]);

    // ✅ Fetch Tasks
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/tasks/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Create New Task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
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
            setTitle("");
            setDescription("");
            setModalOpen(false);
            toast.success("Task created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create task.");
        }
    };

    // ✅ Edit Task
    const handleEditTask = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        setModalOpen(true);
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
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
            setEditingTask(null);
            setTitle("");
            setDescription("");
            setModalOpen(false);
            toast.success("Task updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task.");
        }
    };

    // ✅ Delete Task
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
            console.error(error);
            toast.error("Failed to delete task.");
        }
    };

    // ✅ Mark as Completed
    const handleToggleCompleted = async (task) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/tasks/${task.id}/`,
                { ...task, is_completed: !task.is_completed },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
            toast.success("Task status updated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task status.");
        }
    };

    return (
        <>
            <Header />
            <main className="bg-gray-100 min-h-screen p-4 md:p-8">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">Dashboard</h1>
                    <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded w-full md:w-1/3"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border p-2 rounded w-full md:w-1/4"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="in_progress">In Progress</option>
                        </select>
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setTitle("");
                                setDescription("");
                                setModalOpen(true);
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
                        >
                            Add Task
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-center text-blue-600">Loading tasks...</p>
                    ) : (
                        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {tasks.map((task) => (
                                <li key={task.id} className="bg-white rounded-lg shadow p-4">
                                    <h2 className="text-xl font-bold text-indigo-800">{task.title}</h2>
                                    <p className="text-gray-600">{task.description}</p>
                                    <p className="text-sm text-gray-500">Due: {task.due_date}</p>
                                    <div className="mt-4 flex space-x-2">
                                        <button onClick={() => handleEditTask(task)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                        <button onClick={() => handleToggleCompleted(task)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            {task.is_completed ? "Mark Incomplete" : "Mark Completed"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
            <Footer />
            <ToastContainer />
        </>
    );
};

export default Dashboard;
