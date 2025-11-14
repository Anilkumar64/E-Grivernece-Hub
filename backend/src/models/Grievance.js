
import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        // 🏛 department to which the complaint belongs
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        // 📝 complaint details
        title: {
            type: String,
            required: [true, "Complaint title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Complaint description is required"],
        },

        attachments: [
            {
                type: String, // image or document URLs
            },
        ],

        // 🔄 status tracking
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            default: "Pending",
        },

        // ⚙️ priority management
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },

        // 👮‍♂️ admin handling the grievance
        adminAssigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },

        adminRemarks: {
            type: String,
            default: "",
        },

        // ⭐ feedback from user after resolution
        userFeedback: {
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String },
        },

        // 🕵️ anonymous submission option
        isAnonymous: {
            type: Boolean,
            default: false,
        },

        // 📆 resolution tracking
        resolutionDate: {
            type: Date,
            default: null,
        },

        // 🔍 unique tracking ID for complaint
        trackingId: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

//
// 🎯 Auto-generate unique tracking ID before saving
//
grievanceSchema.pre("save", function (next) {
    if (!this.trackingId) {
        this.trackingId = `GRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

export default mongoose.model("Grievance", grievanceSchema);
