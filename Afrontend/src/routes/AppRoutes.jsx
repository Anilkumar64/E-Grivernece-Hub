<Route path="/login" element={<Login />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/signup" element={<Signup />} />
<Route path="/student/dashboard" element={<StudentDashboard />} />
<Route path="/student/file-grievance" element={<FileGrievance />} />
import MyGrievances from "../pages/Student/MyGrievances";
// ...
<Route path="/student/grievances" element={<MyGrievances />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
