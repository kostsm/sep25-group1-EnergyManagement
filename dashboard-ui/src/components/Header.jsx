import React from "react";

export default function Header({ onLogin }) {
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
        </header>
    );
}
