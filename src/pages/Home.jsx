import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-blue-600 to-indigo-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent opacity-50"></div>
            <div className="relative z-10 text-center text-white px-4 md:px-0 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fadeInUp drop-shadow-lg">
                    Welcome to To-Do App
                </h1>
                <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto animate-fadeInUp drop-shadow-md">
                    Organize your tasks efficiently and effortlessly. Stay productive and on track with our intuitive task management system.
                </p>

                <div className="flex justify-center space-x-4 animate-fadeInUp">
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
        </div>
    );
};

export default Home;
