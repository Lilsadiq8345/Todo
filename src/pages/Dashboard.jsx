import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        setError(null);
        try {
            const response = await axios.get("http://localhost:8000/api/tasks/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch tasks. Please try again.");
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
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <button
                onClick={() => {
                    setEditingTask(null);
                    setTitle("");
                    setDescription("");
                    setModalOpen(true);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded mb-6"
            >
                Add Task
            </button>

            {loading && <p className="text-blue-500">Loading tasks...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul>
                {tasks.map((task) => (
                    <li key={task.id} className="mb-4 p-4 bg-white rounded shadow">
                        <h2 className="text-xl font-semibold">{task.title}</h2>
                        <p>{task.description}</p>
                        <p className="text-sm text-gray-500">Due: {task.due_date}</p>
                        <div className="mt-4 space-x-2">
                            <button onClick={() => handleEditTask(task)} className="px-4 py-2 bg-yellow-500 text-white rounded">
                                Edit
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 bg-red-500 text-white rounded">
                                Delete
                            </button>
                            <button onClick={() => handleToggleCompleted(task)} className="px-4 py-2 bg-blue-500 text-white rounded">
                                {task.is_completed ? "Mark Incomplete" : "Mark Completed"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{editingTask ? "Edit Task" : "Add Task"}</h2>
                        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <textarea
                                placeholder="Task Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 mb-4 border rounded"
                            />
                            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">
                                {editingTask ? "Update Task" : "Create Task"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Dashboard;
