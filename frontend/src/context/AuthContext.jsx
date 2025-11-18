import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import VerifyOtp from "../pages/Auth/VerifyOtp";

import ProtectedRoute from "../components/protected/ProtectedRoute";

// layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

// user pages...
// admin pages...
// superadmin pages...

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />

                {/* User */}
                <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                    <Route element={<UserLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-grievances" element={<MyGrievances />} />
                        <Route path="/file-grievance" element={<FileGrievance />} />
                        <Route path="/grievance/:id" element={<GrievanceDetails />} />
                    </Route>
                </Route>

                {/* Admin */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/grievances" element={<AdminGrievances />} />
                        <Route path="/admin/grievance/:id" element={<AdminGrievanceView />} />
                        <Route path="/admin/profile" element={<AdminProfile />} />
                    </Route>
                </Route>

                {/* SuperAdmin */}
                <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
                    <Route element={<SuperAdminLayout />}>
                        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                        <Route path="/superadmin/pending-admins" element={<PendingAdmins />} />
                        <Route path="/superadmin/manage-departments" element={<ManageDepartments />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
