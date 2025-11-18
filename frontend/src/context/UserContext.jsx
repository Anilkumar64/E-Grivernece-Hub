import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { isAuthenticated, role } = useAuth();

    const [profile, setProfile] = useState(null);
    const [grievances, setGrievances] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user profile and grievances
    useEffect(() => {
        if (!isAuthenticated) {
            setProfile(null);
            setGrievances([]);
            setNotifications([]);
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                // User Profile
                let profRes = null;

                if (role === "user") {
                    profRes = await axiosInstance.get("/users/profile");
                } else if (role === "admin") {
                    profRes = await axiosInstance.get("/admin/me");
                } else if (role === "superadmin") {
                    profRes = await axiosInstance.get("/superadmin/me");
                }

                setProfile(profRes?.data || null);

                // Fetch grievances (only for users)
                if (role === "user") {
                    const res = await axiosInstance.get("/grievances/my");
                    setGrievances(res.data || []);
                }

                // Fetch notifications for all roles
                const notifRes = await axiosInstance.get("/notifications/");
                setNotifications(notifRes.data || []);

            } catch (err) {
                console.error("User context fetch error:", err);
            }

            setLoading(false);
        };

        fetchUserData();
    }, [isAuthenticated, role]);

    const value = {
        profile,
        grievances,
        notifications,
        loading,
        setProfile,
        setGrievances,
        setNotifications,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
