import React, { useState } from "react";
import axios from "axios";

export default function LoginModal({ onSuccess, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post("http://localhost:5174/api/login", { email, password });
            onSuccess(email);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Log In</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                        <label>Email:<br/>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
                        </label>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label>Password:<br/>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
                        </label>
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button type="button" onClick={onClose} style={styles.buttonSecondary} disabled={loading}>Cancel</button>
                        <button type="submit" style={styles.buttonPrimary} disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        minWidth: 320,
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
    },
    input: {
        width: '100%',
        padding: 8,
        fontSize: 16,
        borderRadius: 6,
        border: '1px solid #ccc',
        marginTop: 4
    },
    buttonPrimary: {
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '8px 20px',
        fontSize: 16,
        cursor: 'pointer'
    },
    buttonSecondary: {
        background: '#eee',
        color: '#333',
        border: 'none',
        borderRadius: 6,
        padding: '8px 20px',
        fontSize: 16,
        cursor: 'pointer'
    }
}; 