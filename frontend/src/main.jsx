import { StrictMode } from 'react'
import React from "react";
// import AppRoutes from './routes/AppRoutes.jsx';
import { createRoot } from 'react-dom/client'
// import { ToastContainer } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AppRoutes /> */}
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>
)
