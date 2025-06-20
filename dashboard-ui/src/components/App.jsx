import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Dashboard from "./Dashboard";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Check localStorage for user data on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setCurrentUser(userData);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse user data from localStorage:", e);
                localStorage.removeItem('currentUser'); // Clear invalid data
            }
        }
    }, []); // Empty dependency array means this effect runs once on mount

    /** Stub handler — replace with real auth later */
    const handleLoginClick = () => {
        setShowLogin(true);
    };
    
    // Updated to accept user data object and store in localStorage
    const handleLoginSuccess = (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData); // Store the user data in state
        localStorage.setItem('currentUser', JSON.stringify(userData)); // Store in localStorage
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
    
    // Updated to clear user state and remove from localStorage
    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null); // Clear user data from state
        localStorage.removeItem('currentUser'); // Remove from localStorage
    };

    return (
        <BrowserRouter>
            <Header onLogin={handleLoginClick} onRegister={handleRegisterClick} onLogout={handleLogout} isAuthenticated={isAuthenticated} userEmail={currentUser?.email} />

            <Routes>
                <Route index element={isAuthenticated ? <Dashboard userId={currentUser?.id} /> : <div className="container mx-auto p-4"><h2>Please log in to view the dashboard.</h2></div>} />
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
