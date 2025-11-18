import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

// Using the only existing SVG as temporary placeholder
import HeroImg from "../../assets/hero-admin.svg";


const Feature1 = HeroImg;
const Feature2 = HeroImg;
const Feature3 = HeroImg;

import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />

            {/* ---------------- HERO SECTION ---------------- */}
            <div className="hero-section">
                <div className="hero-left">
                    <h1>
                        A Smarter Way to <span className="highlight">Submit & Track</span>{" "}
                        Grievances
                    </h1>
                    <p>
                        ITM University’s official digital grievance portal. Submit your issues,
                        track your status, and get updates in real-time.
                    </p>

                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={() => navigate("/login")}>
                            Submit Grievance
                        </button>

                        <button className="btn-secondary" onClick={() => navigate("/track")}>
                            Track Grievance
                        </button>
                    </div>
                </div>

                <div className="hero-right">
                    <img src={HeroImg} alt="hero" />
                </div>
            </div>

            {/* ---------------- FEATURES SECTION ---------------- */}
            <div className="features-section">
                <h2>Why Choose E-Grievance Portal?</h2>

                <div className="feature-grid">
                    <div className="feature-card">
                        <img src={Feature1} alt="submit" />
                        <h3>Easy Submission</h3>
                        <p>Submit grievances in minutes with a clean and simple form.</p>
                    </div>

                    <div className="feature-card">
                        <img src={Feature2} alt="track" />
                        <h3>Real-Time Tracking</h3>
                        <p>Track grievance status with unique tracking ID and timeline.</p>
                    </div>

                    <div className="feature-card">
                        <img src={Feature3} alt="resolve" />
                        <h3>Fast Resolution</h3>
                        <p>Automatically routed to the right department for quick action.</p>
                    </div>
                </div>
            </div>

            {/* ---------------- HOW IT WORKS SECTION ---------------- */}
            <div className="how-section">
                <h2>How It Works</h2>

                <div className="how-grid">
                    <div className="how-card">
                        <span>1️⃣</span>
                        <h3>Submit Your Grievance</h3>
                        <p>Fill the form and attach supporting documents if needed.</p>
                    </div>

                    <div className="how-card">
                        <span>2️⃣</span>
                        <h3>Admin Reviews</h3>
                        <p>Assigned department admin will review and respond.</p>
                    </div>

                    <div className="how-card">
                        <span>3️⃣</span>
                        <h3>Track Until Resolution</h3>
                        <p>Know exactly where your grievance has reached.</p>
                    </div>
                </div>
            </div>

            {/* ---------------- ABOUT ---------------- */}
            <div className="about-section">
                <h2>About the Portal</h2>
                <p>
                    This platform is designed to ensure transparency, efficiency, and quick
                    resolution of student and faculty grievances. Managed by ITM University’s
                    administration for a smoother communication workflow.
                </p>
            </div>

            {/* ---------------- CONTACT ---------------- */}
            <div className="contact-section">
                <h2>Contact Us</h2>
                <p>Have questions? Reach out to us anytime.</p>

                <div className="contact-box">
                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Email Address" />
                    <textarea placeholder="Message"></textarea>
                    <button className="btn-primary">Send Message</button>
                </div>
            </div>

            <Footer />
        </>
    );
}
