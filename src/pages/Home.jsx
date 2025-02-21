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
            <main className="flex-grow flex items-center justify-center text-center relative px-4 md:px-8">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent opacity-60"></div>
                <div className="relative z-10 max-w-4xl mx-auto animate-fadeInUp">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-cyan-300 leading-tight">
                        Welcome to Carbonetrix
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md text-gray-300">
                        Promoting carbon intelligence. Organize your tasks efficiently and effortlessly.
                    </p>

                    <Link to="/register">
                        <button className="px-10 py-4 bg-cyan-300 text-indigo-900 rounded-full shadow-lg hover:bg-cyan-400 hover:scale-105 transform transition-transform duration-300 font-semibold">
                            Get Started
                        </button>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
