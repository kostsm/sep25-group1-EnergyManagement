import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Dashboard from "./Dashboard";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    /** Stub handler — replace with real auth later */
    const handleLoginClick = () => {
        setShowLogin(true);
    };
    const handleLoginSuccess = (email) => {
        setIsAuthenticated(true);
        setUserEmail(email);
        setShowLogin(false);
    };
    const handleLoginClose = () => {
        setShowLogin(false);
    };
    const handleRegisterClick = () => {
        setShowRegister(true);
    };
    const handleRegisterClose = () => {
        setShowRegister(false);
    };
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserEmail("");
    };

    return (
        <BrowserRouter>
            <Header onLogin={handleLoginClick} onRegister={handleRegisterClick} onLogout={handleLogout} isAuthenticated={isAuthenticated} userEmail={userEmail} />

            <Routes>
                <Route index element={<Dashboard />} />
                {/* future routes go here */}
            </Routes>
            {showLogin && (
                <LoginModal onSuccess={handleLoginSuccess} onClose={handleLoginClose} />
            )}
            {showRegister && (
                <RegisterModal onClose={handleRegisterClose} />
            )}
        </BrowserRouter>
    );
}
