import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/* ------------------------------------------------------------------
 🟢 Verify Access Token (Basic Auth Protection)
------------------------------------------------------------------ */
export const verifyToken = async (req, res, next) => {
    try {
        // Expecting "Authorization: Bearer <token>"
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Access token missing" });

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find admin in database
        const adminUser = await Admin.findById(decoded._id);
        if (!adminUser)
            return res.status(401).json({ message: "Invalid or unauthorized token" });

        req.admin = adminUser; // Attach user to request
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

/* ------------------------------------------------------------------
 👑 Verify SuperAdmin Role (for approval & verification routes)
------------------------------------------------------------------ */
export const verifySuperAdmin = async (req, res, next) => {
    try {
        // First verify token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Access token missing" });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const adminUser = await Admin.findById(decoded._id);

        if (!adminUser)
            return res.status(401).json({ message: "Invalid admin credentials" });

        // Check for superadmin role
        if (adminUser.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied: SuperAdmins only" });
        }

        req.admin = adminUser;
        next();
    } catch (error) {
        console.error("SuperAdmin Verification Error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
