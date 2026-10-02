import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerProfile from "./pages/WorkerProfile";
import CreateWorkerProfile from "./pages/CreateWorkerProfile";
import EditWorkerProfile from "./pages/EditWorkerProfile";
import WorkerSkills from "./pages/WorkerSkills";
import CreateJob from "./pages/CreateJob";
import EmployerDashboard from "./pages/EmployerDashboard";
import MyJobs from "./pages/MyJobs";
import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import EmployerApplications from "./pages/EmployerApplications";
import EmployerProfile from "./pages/EmployerProfile";
import FindWorkers from "./pages/FindWorkers";
import WorkerRequests from "./pages/WorkerRequests";
import AdminDashboard from "./pages/AdminDashboard";
import ContactUs from "./pages/ContactUs";

function ProtectedRoute({ allowedRoles, children }) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "worker") {
            return <Navigate to="/worker-dashboard" replace />;
        }

        if (user.role === "employer") {
            return <Navigate to="/employer-dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/worker-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <WorkerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/worker-profile"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <WorkerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-worker-profile"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <CreateWorkerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-worker-profile"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <EditWorkerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/worker-skills"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <WorkerSkills />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-applications"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/find-jobs"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <FindJobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/job/:id"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <EmployerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer-profile"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <EmployerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-job"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-jobs"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <MyJobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer-applications"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <EmployerApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/find-workers"
                    element={
                        <ProtectedRoute allowedRoles={["employer"]}>
                            <FindWorkers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/worker-requests"
                    element={
                        <ProtectedRoute allowedRoles={["worker"]}>
                            <WorkerRequests />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/contact" element={<ContactUs />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;