import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800 text-white flex flex-col">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <main className="flex-grow flex items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent opacity-50"></div>
                <div className="relative z-10 px-4 md:px-0 max-w-4xl mx-auto animate-fadeInUp">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-cyan-300">
                        Welcome to Carbonetrix
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                        Promoting carbon intelligence. Organize your tasks efficiently and effortlessly.
                    </p>

                    <div className="flex justify-center space-x-4">
                        <Link to="/login">
                            <button className="px-8 py-3 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transform transition-transform duration-300 font-semibold">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-indigo-600 shadow-lg hover:scale-105 transform transition-transform duration-300 font-semibold">
                                Register
                            </button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
