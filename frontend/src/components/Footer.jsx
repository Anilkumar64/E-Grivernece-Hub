import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5>E-Grievance Hub</h5>
                        <p className="text-muted">
                            Making grievance resolution simple and efficient.
                        </p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-light">Home</Link></li>
                            <li><Link to="/about" className="text-light">About Us</Link></li>
                            <li><Link to="/contact" className="text-light">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>Contact Info</h5>
                        <address className="text-muted">
                            <p>Email: support@egrienvancehub.com</p>
                            <p>Phone: +1 234 567 8900</p>
                        </address>
                    </div>
                </div>
                <hr className="bg-secondary" />
                <div className="text-center">
                    <p className="mb-0">
                        &copy; {new Date().getFullYear()} E-Grievance Hub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;