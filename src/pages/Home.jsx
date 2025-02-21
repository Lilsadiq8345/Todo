import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <main className="flex-grow flex items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent opacity-60"></div>
                <div className="relative z-10 px-6 md:px-0 max-w-4xl mx-auto animate-fadeInUp">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg text-cyan-300 leading-tight">
                        Welcome to Carbonetrix
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md text-gray-300">
                        Promoting carbon intelligence. Organize your tasks efficiently and effortlessly.
                    </p>

                    <div className="flex justify-center space-x-4">
                        <Link to="/login">
                            <button className="px-8 py-3 bg-white text-indigo-700 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transform transition-transform duration-300 font-semibold">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-indigo-700 shadow-lg hover:scale-105 transform transition-transform duration-300 font-semibold">
                                Register
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Background Animation */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-indigo-500 to-purple-700 opacity-20 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-purple-700 to-indigo-500 opacity-30 rounded-full animate-pulse"></div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
