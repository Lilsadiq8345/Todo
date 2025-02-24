import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ManageUser from "./pages/ManageUser";
import ManageTasks from "./pages/ManageTasks";
import TasksManagement from "./pages/TasksManagement";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manage-user" element={<ManageUser />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/manage-tasks" element={<ManageTasks />} />
      <Route path="/tasks" element={<TasksManagement />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
    </Routes>
  );
}

export default App;
