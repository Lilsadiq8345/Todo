// src/components/DashboardHeader.jsx

import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/carbonetrix-logo.png";
import { AiOutlineSearch } from "react-icons/ai";

const DashboardHeader = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    // 🔽 Available Filter Options
    const filterOptions = [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" }
    ];

    return (
        <header className="w-full bg-white/70 backdrop-blur-md shadow-md fixed top-0 left-0 z-20">
            <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
                {/* Logo */}
                <Link to="/">
                    <img
                        src={logo}
                        alt="Carbonetrix Logo"
                        className="w-36 hover:scale-105 transition-transform"
                    />
                </Link>

                {/* 🔎 Search and Filter */}
                <div className="flex items-center space-x-4">
                    {/* 🔎 Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border rounded-full py-2 px-4 pr-10 focus:outline-none focus:border-blue-500"
                        />
                        <AiOutlineSearch className="absolute right-3 top-3 text-gray-500" />
                    </div>

                    {/* 🔽 Filter Dropdown */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded-full py-2 px-4 focus:outline-none focus:border-blue-500"
                    >
                        {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </nav>
        </header>
    );
};

export default DashboardHeader;
