import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/carbonetrix-logo.png";

const Header = () => {
    return (
        <header className="w-full bg-white/70 backdrop-blur-md shadow-md fixed top-0 left-0 z-20">
            <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="Carbonetrix Logo" className="w-36 hover:scale-105 transition-transform" />
                </Link>

                {/* Navigation Links */}
                <div className="space-x-6 text-indigo-900 font-semibold">
                    <Link to="/" className="hover:text-blue-600 transition">
                        Home
                    </Link>
                    <Link to="/login" className="hover:text-blue-600 transition">
                        Login
                    </Link>
                    <Link to="/register" className="hover:text-blue-600 transition">
                        Register
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
