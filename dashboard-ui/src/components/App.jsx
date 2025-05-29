import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Dashboard />} />
                {/* future routes here */}
            </Routes>
        </BrowserRouter>
    );
}
