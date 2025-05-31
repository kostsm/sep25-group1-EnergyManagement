import React from "react";

export default function Header({ onLogin, onRegister, onLogout, isAuthenticated, userEmail }) {
    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 0",
            }}
        >
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                Smart-City Energy Dashboard
            </h1>

            {!isAuthenticated ? (
                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={onLogin}
                        style={{
                            padding: "0.5rem 1.25rem",
                            border: "none",
                            borderRadius: "0.5rem",
                            background: "#2563eb",
                            color: "#fff",
                            fontSize: "1rem",
                            cursor: "pointer",
                        }}
                    >
                        Log&nbsp;in
                    </button>
                    <button
                        onClick={onRegister}
                        style={{
                            padding: "0.5rem 1.25rem",
                            border: "none",
                            borderRadius: "0.5rem",
                            background: "#10b981",
                            color: "#fff",
                            fontSize: "1rem",
                            cursor: "pointer",
                        }}
                    >
                        Register
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ color: "#2563eb", fontWeight: 500 }}>{userEmail}</span>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: "0.5rem 1.25rem",
                            border: "none",
                            borderRadius: "0.5rem",
                            background: "#ef4444",
                            color: "#fff",
                            fontSize: "1rem",
                            cursor: "pointer",
                        }}
                    >
                        Log&nbsp;out
                    </button>
                </div>
            )}
        </header>
    );
}
