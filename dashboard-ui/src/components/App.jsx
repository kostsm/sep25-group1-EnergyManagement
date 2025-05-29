import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Dashboard from "./Dashboard";

export default function App() {
    /** Stub handler — replace with real auth later */
    const handleLoginClick = () => {
        console.log("Login button clicked");   // should bevisible in dev-tools console
    };

    return (
        <BrowserRouter>
            <Header onLogin={handleLoginClick} />

            <Routes>
                <Route index element={<Dashboard />} />
                {/* future routes go here */}
            </Routes>
        </BrowserRouter>
    );
}
