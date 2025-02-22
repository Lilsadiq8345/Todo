// src/components/TaskModal.jsx

import React, { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const TaskModal = ({
    isOpen,
    onClose,
    onSave,
    title,
    setTitle,
    description,
    setDescription,
    isEditing,
}) => {
    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Close modal when clicking outside the modal
    const handleOverlayClick = (event) => {
        if (event.target.id === "modal-overlay") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    <AiOutlineCloseCircle size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Task" : "Add Task"}</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="title">
                            Task Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded"
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
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {isEditing ? "Update Task" : "Create Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
