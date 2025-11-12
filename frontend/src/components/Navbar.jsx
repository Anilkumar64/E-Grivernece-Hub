import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: '#1a202c',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            E-Grievance Hub
        </div>
        <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2rem',
            margin: 0,
            padding: 0
        }}>
            <li>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
            </li>
            <li>
                <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>About</Link>
            </li>
            <li>
                <Link to="/grievances" style={{ color: '#fff', textDecoration: 'none' }}>Grievances</Link>
            </li>
            <li>
                <Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</Link>
            </li>
        </ul>
        <div>
            <Link to="/login" style={{
                background: '#3182ce',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: '500'
            }}>
                Login
            </Link>
        </div>
    </nav>
);

export default Navbar;