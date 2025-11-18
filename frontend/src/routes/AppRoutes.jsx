import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import useAuth from "../hooks/useAuth";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import LandingPage from "../pages/landing/LandingPage";


// User Pages
import Signup from "../pages/Auth/Signup";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/User/Dashboard";
import CreateGrievance from "../pages/User/CreateGrievance";
import MyGrievances from "../pages/User/MyGrievances";
import TrackGrievance from "../pages/User/TrackGrievance";

// Admin Pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminSignup from "../pages/Admin/AdminSignup";
import AdminProfile from "../pages/Admin/AdminProfile";
import ManageTypes from "../pages/Admin/ManageTypes";
import AdminGrievances from "../pages/Admin/AdminGrievances";
import AdminGrievanceDetails from "../pages/Admin/AdminGrievanceDetails";
import PendingGrievances from "../pages/Admin/PendingGrievances";

// Super Admin Pages
import SuperAdminDashboard from "../pages/SuperAdmin/SuperAdminDashboard";
import PendingAdmins from "../pages/SuperAdmin/PendingAdmins";
import ApproveAdmins from "../pages/SuperAdmin/ApproveAdmins";
import ManageDepartments from "../pages/SuperAdmin/ManageDepartments";
import SuperAdminReports from "../pages/SuperAdmin/SuperAdminReports";

// Protected Route Component
import ProtectedRoute from "../components/protected/ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* ---------------- USER ROUTES ---------------- */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute role="user">
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="create-grievance" element={<CreateGrievance />} />
                    <Route path="my-grievances" element={<MyGrievances />} />
                    <Route path="track/:id" element={<TrackGrievance />} />
                </Route>

                {/* ---------------- ADMIN ROUTES ---------------- */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="grievances" element={<AdminGrievances />} />
                    <Route path="grievances/:id" element={<AdminGrievanceDetails />} />
                    <Route path="manage-types" element={<ManageTypes />} />
                    <Route path="pending" element={<PendingGrievances />} />
                </Route>

                {/* ---------------- SUPER ADMIN ROUTES ---------------- */}
                <Route
                    path="/superadmin"
                    element={
                        <ProtectedRoute role="superadmin">
                            <SuperAdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<SuperAdminDashboard />} />
                    <Route path="pending-admins" element={<PendingAdmins />} />
                    <Route path="approve-admins" element={<ApproveAdmins />} />
                    <Route path="departments" element={<ManageDepartments />} />
                    <Route path="reports" element={<SuperAdminReports />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
