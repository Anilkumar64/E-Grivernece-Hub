import ComplaintType from "../../models/ComplaintType.js";

export const createType = async (req, res) => {
    try {
        const { type, subTypes, department, defaultPriority } = req.body;

        if (!type || !department)
            return res.status(400).json({ message: "Type and department required" });

        const exists = await ComplaintType.findOne({ type });
        if (exists) return res.status(400).json({ message: "Type already exists" });

        const doc = await ComplaintType.create({
            type,
            subTypes,
            department,
            defaultPriority,
        });

        res.status(201).json({ message: "Complaint type created", data: doc });
    } catch (err) {
        console.error("createType error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
