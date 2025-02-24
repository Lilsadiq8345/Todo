import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

const TaskModal = ({ isOpen, onClose, isEditing, editingTask, refreshTasks }) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);

    // Effect to pre-populate form fields when editing
    useEffect(() => {
        if (isEditing && editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setDueDate(editingTask.due_date || "");
            setStatus(editingTask.status || "pending");
        } else {
            setTitle("");
            setDescription("");
            setDueDate("");
            setStatus("pending");
        }
    }, [isEditing, editingTask]);

    // Close modal on escape key press
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Close modal on overlay click
    const handleOverlayClick = (event) => {
        if (event.target.id === "modal-overlay") {
            onClose();
        }
    };

    // Focus the first input field when the modal opens
    useEffect(() => {
        if (isOpen) {
            const firstInput = document.querySelector("#title");
            firstInput && firstInput.focus();
        }
    }, [isOpen]);

    const handleSave = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Task title is required.");
            return;
        }
        if (!dueDate) {
            toast.error("Due date is required.");
            return;
        }

        setLoading(true);

        try {
            const taskData = {
                title,
                description,
                due_date: dueDate,
                status,
            };

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // If editing, update the task
            if (isEditing && editingTask) {
                await axios.put(
                    `http://localhost:8000/api/tasks/${editingTask.id}/`,
                    taskData,
                    { headers }
                );
                toast.success("Task updated successfully!");
            } else {
                // If adding new, create the task
                await axios.post("http://localhost:8000/api/tasks/", taskData, { headers });
                toast.success("Task created successfully!");
            }

            // Clear form fields after successful save
            setTitle("");
            setDescription("");
            setDueDate("");
            setStatus("pending");

            onClose();
            refreshTasks();
        } finally {
            setLoading(false);
        }
    };

    // If the modal is not open, return null (do not render the modal)
    if (!isOpen) return null;

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Close Modal"
                >
                    <AiOutlineCloseCircle size={24} />
                </button>
                <h2 id="modal-title" className="text-2xl font-bold mb-4">
                    {isEditing ? "Edit Task" : "Add Task"}
                </h2>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="title">
                            Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="due-date">
                            Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="due-date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
