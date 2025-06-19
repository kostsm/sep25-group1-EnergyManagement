import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditFlatModal({ flat, onSuccess, onClose }) {
    const [address, setAddress] = useState(flat.address);
    const [city, setCity] = useState(flat.city);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Update state if the flat prop changes (e.g., if editing a different flat)
    useEffect(() => {
        setAddress(flat.address);
        setCity(flat.city);
    }, [flat]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Send PUT request to update the flat
            await axios.put(`http://localhost:8080/api/flats/${flat.id}`, {
                id: flat.id, // Include ID in body as well
                address,
                city,
                userId: flat.userId // Ensure userId is included and not changed
            }, {
                headers: { "X-User-ID": flat.userId }
            });
            onSuccess(); // Call success callback (closes modal, re-fetches flats)
        } catch (err) {
            console.error("Error updating flat:", err);
            setError(err.response?.data?.error || "Failed to update flat.");
        } finally {
            setLoading(false);
        }
    };

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
            background: '#2563eb', // Blue color for Edit
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


    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Edit Flat</h2>
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
                        <button type="submit" style={styles.buttonPrimary} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 