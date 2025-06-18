import React, { useState } from "react";
import axios from "axios";

export default function CreateFlatModal({ userId, onSuccess, onClose }) {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Send POST request to create a new flat
            await axios.post("http://localhost:8080/api/flats", {
                address,
                city,
                userId // Include the userId to associate the flat
            });
            onSuccess(); // Call success callback (closes modal, re-fetches flats)
        } catch (err) {
            console.error("Error creating flat:", err);
            setError(err.response?.data?.error || "Failed to create flat.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Add New Flat</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                        <label>Address:<br/>
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)} required style={styles.input} />
                        </label>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label>City:<br/>
                            <input type="text" value={city} onChange={e => setCity(e.target.value)} required style={styles.input} />
                        </label>
                    </div>

                    {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button type="button" onClick={onClose} style={styles.buttonSecondary} disabled={loading}>Cancel</button>
                        <button type="submit" style={styles.buttonPrimary} disabled={loading}>{loading ? "Adding..." : "Add Flat"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Basic styles - ideally these would be in a shared CSS file or utility classes
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
        background: '#10b981',
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