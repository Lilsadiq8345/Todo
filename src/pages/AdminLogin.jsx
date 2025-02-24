import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await login(email, password);
            if (response?.status === 200) {
                navigate("/admin-dashboard");
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <AdminHeader />

            {/* Main Login Form */}
            <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 mx-4 md:mx-0">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
                        >
                            {loading ? (
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                </div>
            </main>

            {/* Footer */}
            <AdminFooter />
        </>
    );
};

export default AdminLogin;
