// src/components/TaskModal.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import useAuthStore from "../store/authStore"; // ✅ Import Auth Store
import { toast } from "react-toastify";

const TaskModal = ({ isOpen, onClose, isEditing, editingTask, refreshTasks }) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user); // ✅ Get User from Auth Store

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleOverlayClick = (event) => {
        if (event.target.id === "modal-overlay") {
            onClose();
        }
    };

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

            console.log("Submitting Task Data:", taskData);
            console.log("User:", user);
            console.log("Token:", token);

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            if (isEditing && editingTask) {
                await axios.put(
                    `http://localhost:8000/api/tasks/${editingTask.id}/`,
                    taskData,
                    { headers }
                );
                toast.success("Task updated successfully!");
            } else {
                await axios.post("http://localhost:8000/api/tasks/", taskData, { headers });
                toast.success("Task created successfully!");
            }

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
                        <label className="block text-gray-700 mb-2" htmlFor="dueDate">
                            Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
