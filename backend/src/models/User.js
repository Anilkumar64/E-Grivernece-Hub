import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["student", "staff", "admin"],
            default: "student",
        },
        studentId: {
            type: String,
            default: null,
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        },
        phone: {
            type: String,
            default: null,
        },
        avatar: {
            type: String, // optional profile photo URL
        },
        address: {
            type: String,
            default: null,
        },
        yearOfStudy: {
            type: String, // e.g., "2nd Year", "Final Year"
            default: null,
        },
        grievances: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Grievance",
            },
        ],
        resetToken: {
            type: String,
        },
        resetTokenExpire: {
            type: Date,
        },
    },
    { timestamps: true }
);

//
// 🔐 Encrypt password before saving
//
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//
// 🔑 Compare password for login
//
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
