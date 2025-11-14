import ComplaintType from "../../models/ComplaintType.js";

export const getTypes = async (req, res) => {
    try {
        const types = await ComplaintType.find().sort({ type: 1 });
        res.json(types);
    } catch (err) {
        console.error("getTypes error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
