import axios from "axios";

export const BASE_URL = "http://localhost:4500/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// AUTH
export const AUTH = {
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    LOGIN: "/auth/login",
    FORGOT: "/auth/forgot-password",
    RESET: "/auth/reset-password",
    ME: "/auth/me",
};

// USERS
export const USERS = {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
};

// ADMIN
export const ADMIN = {
    REGISTER: "/admin/register",
    LOGIN: "/admin/login",
    PENDING: "/admin/pending",
    APPROVE: (id) => `/admin/approve/${id}`,
    REMOVE: (id) => `/admin/remove/${id}`,
};

// SUPER ADMIN
export const SUPERADMIN = {
    REGISTER: "/superadmin/register",
    LOGIN: "/superadmin/login",
    ADMINS: "/superadmin/admins",
    APPROVE: (id) => `/superadmin/admins/approve/${id}`,
    REMOVE: (id) => `/superadmin/admins/remove/${id}`,
};

// DEPARTMENTS
export const DEPARTMENTS = {
    BASE: "/departments",
    BY_ID: (id) => `/departments/${id}`,
};

// COMPLAINT TYPES
export const TYPES = {
    BASE: "/complaint-types",
    BY_ID: (id) => `/complaint-types/${id}`,
};

// GRIEVANCES
export const GRIEVANCES = {
    BASE: "/grievances",
    BY_ID: (id) => `/grievances/${id}`,
};

// NOTIFICATIONS
export const NOTIFICATIONS = {
    BASE: "/notifications",
    BY_ID: (id) => `/notifications/${id}`,
};

export default axiosInstance;
