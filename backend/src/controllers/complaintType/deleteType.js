import ComplaintType from "../../models/ComplaintType.js";

export const deleteType = async (req, res) => {
    try {
        const { id } = req.params;

        const removed = await ComplaintType.findByIdAndDelete(id);
        if (!removed) return res.status(404).json({ message: "Not found" });

        res.json({ message: "Complaint type deleted" });
    } catch (err) {
        console.error("deleteType error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
