import React, { useState, useEffect } from "react";
import "./VerifyOtp.css";
import api from "../../api/axiosInstance";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const [seconds, setSeconds] = useState(60);

    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const navigate = useNavigate();

    // Countdown timer for Resend OTP
    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [seconds]);

    // Handle OTP Submit
    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/users/verify-otp", { email, otp });

            toast.success("OTP Verified Successfully!");
            navigate("/login");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid OTP");
        }
    };

    // Resend OTP
    const handleResend = async () => {
        try {
            await api.post("/users/resend-otp", { email });
            toast.success("OTP Resent Successfully!");
            setSeconds(60);
        } catch (error) {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-box">
                <h2>Email Verification</h2>
                <p>OTP has been sent to: <strong>{email}</strong></p>

                <form onSubmit={handleVerify}>
                    <div className="otp-input-group">
                        <label>Enter OTP</label>
                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-verify">
                        Verify OTP
                    </button>
                </form>

                <div className="resend-box">
                    {seconds > 0 ? (
                        <p>Resend OTP in: <b>{seconds}</b> sec</p>
                    ) : (
                        <button className="resend-btn" onClick={handleResend}>
                            Resend OTP
                        </button>
                    )}
                </div>

                <p className="back-login" onClick={() => navigate("/login")}>
                    Back to Login
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;
