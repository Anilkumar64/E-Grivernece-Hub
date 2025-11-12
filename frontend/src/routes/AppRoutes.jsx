import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔹 Common Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastMessage from "../components/ToastMessage";

// 🔹 Public Pages
import LandingPage from "../pages/Landing/LandingPage";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

// 🔹 Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import RegistrationSuccess from "../pages/Auth/RegistrationSuccess";

// 🔹 Student Pages
import StudentDashboard from "../pages/Student/StudentDashboard";
import SubmitGrievance from "../pages/Student/SubmitGrievance";
import ViewStatus from "../pages/Student/ViewStatus";
import TrackGrievance from "../pages/Student/TrackGrievance";
import EditProfile from "../pages/Student/EditProfile";

// 🔹 Admin Pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ViewAllGrievances from "../pages/Admin/ViewAllGrievances";
import ManageDepartments from "../pages/Admin/ManageDepartments";
import GrievanceDetails from "../pages/Admin/GrievanceDetails";
import Reports from "../pages/Admin/Reports";

// 🔹 Notifications Pages
import UserNotifications from "../pages/Notifications/UserNotifications";
import AdminNotifications from "../pages/Notifications/AdminNotifications";

// 🔹 Protected Route
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <Router>
            <Navbar />
            <ToastMessage />

            <Routes>
                {/* ================= Public Routes ================= */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/success" element={<RegistrationSuccess />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* ================= Student Routes ================= */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/submit"
                    element={
                        <ProtectedRoute role="student">
                            <SubmitGrievance />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/view-status"
                    element={
                        <ProtectedRoute role="student">
                            <ViewStatus />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/track"
                    element={
                        <ProtectedRoute role="student">
                            <TrackGrievance />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/edit-profile"
                    element={
                        <ProtectedRoute role="student">
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />

                {/* ================= Admin Routes ================= */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/grievances"
                    element={
                        <ProtectedRoute role="admin">
                            <ViewAllGrievances />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/departments"
                    element={
                        <ProtectedRoute role="admin">
                            <ManageDepartments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/grievance/:id"
                    element={
                        <ProtectedRoute role="admin">
                            <GrievanceDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute role="admin">
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                {/* ================= Notifications ================= */}
                <Route
                    path="/notifications/user"
                    element={
                        <ProtectedRoute role="student">
                            <UserNotifications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notifications/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminNotifications />
                        </ProtectedRoute>
                    }
                />

                {/* ================= Catch-All ================= */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
        </Router>
    );
}
