import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("https://todo-0zke.onrender.com/api/register/", {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setError("Registration failed. Email might already be taken.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <Header />

            {/* Main Register Form */}
            <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-blue-800">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 mx-4 md:mx-0">
                    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
                        Create an Account
                    </h2>

                    {/* Success and Error Messages */}
                    {success && (
                        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-semibold"
                        >
                            {loading ? (
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-indigo-600 hover:underline">
                            Login here
                        </a>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default Register;
