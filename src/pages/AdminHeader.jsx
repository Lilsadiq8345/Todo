import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import logo from "../assets/carbonetrix-logo.png";

const AdminHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white shadow-md fixed top-0 left-0 z-20">
            <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
                {/* Left Side: Logo and Home Button */}
                <div className="flex items-center space-x-6">
                    <Link to="/admin-dashboard">
                        <img src={logo} alt="Carbonetrix Logo" className="w-36 hover:scale-105 transition-transform" />
                    </Link>

                </div>
            </nav>
        </header>
    );
};

export default AdminHeader;
