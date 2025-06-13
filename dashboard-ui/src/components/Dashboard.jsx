import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateFlatModal   from "./CreateFlatModal";
import EditFlatModal     from "./EditFlatModal";
import AddHeatingModal   from "./AddHeatingModal";   // NEW

export default function Dashboard({ userId }) {

    /* ─── overview cards ───────────────────────────────────────────── */
    const [overview, setOverview] = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

    /* ─── flat list state ──────────────────────────────────────────── */
    const [userFlats,      setUserFlats]      = useState([]);
    const [flatsLoading,   setFlatsLoading]   = useState(true);
    const [flatsError,     setFlatsError]     = useState(null);

    const [showCreateFlatModal, setShowCreateFlatModal] = useState(false);
    const [showEditFlatModal,   setShowEditFlatModal]   = useState(false);
    const [flatToEdit,          setFlatToEdit]          = useState(null);

    /* ─── heating details for a selected flat ─────────────────────── */
    const [selectedFlatId, setSelectedFlatId] = useState(null);
    const [flatDetails,    setFlatDetails]    = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [showAddModal,   setShowAddModal]   = useState(false);

    /* ─── statistics panel state ────────────────────────────── */
    const [stats, setStats] = useState({
        totalFlats: null,
        totalHeatingUsage: null,
        averageHeatingUsage: null,
    });
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    /* ──────────────────────────────────────────────────────────────── */
    /*  Data fetch helpers                                             */
    /* ──────────────────────────────────────────────────────────────── */

    const fetchUserFlats = (currentUserId) => {
        if (!currentUserId) { setUserFlats([]); return; }

        setFlatsLoading(true);
        setFlatsError(null);

        axios.get(`http://localhost:8082/api/flats/user/${currentUserId}`)
            .then(res => { setUserFlats(res.data);  setFlatsLoading(false); })
            .catch(err => { console.error(err);
                setFlatsError("Failed to fetch your flats.");
                setFlatsLoading(false); });
    };

    const fetchFlatDetails = (flatId) => {
        if (!flatId) { setFlatDetails(null); return; }

        setDetailsLoading(true);
        axios
            .get(`http://localhost:8082/api/flats/${flatId}/details`, {
                headers: { "X-User-ID": userId },
            })
            .then((res) => {
                setFlatDetails(res.data);
                setDetailsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setDetailsLoading(false);
            });

    };

    // Refactored statistics fetch function
    const fetchStats = async () => {
        setStatsLoading(true);
        setStatsError(null);
        try {
            const [flatsRes, totalUsageRes, avgUsageRes] = await Promise.all([
                axios.get("/api/statistics/total-flats"),
                axios.get("/api/statistics/total-heating-usage"),
                axios.get("/api/statistics/average-heating-usage"),
            ]);
            setStats({
                totalFlats: flatsRes.data.totalFlats,
                totalHeatingUsage: totalUsageRes.data.totalHeatingUsage,
                averageHeatingUsage: avgUsageRes.data.averageHeatingUsage,
            });
        } catch (err) {
            setStatsError("Failed to load statistics");
        } finally {
            setStatsLoading(false);
        }
    };

    /* ──────────────────────────────────────────────────────────────── */
    /*  initial dashboard mock                                         */
    /* ──────────────────────────────────────────────────────────────── */
    useEffect(() => {
        // TODO: replace with real statistics endpoint
        setOverview({
            totalFlats: 42,
            totalCitizens: 123,
            avgConsumption: 98.7,
            mix: [
                { type: "Gas",        percent: 40 },
                { type: "Heat Pump",  percent: 35 },
                { type: "Electric",   percent: 25 },
            ],
        });
        setLoading(false);
    }, []);

    /* ──────────────────────────────────────────────────────────────── */
    /*  load flats for current user                                    */
    /* ──────────────────────────────────────────────────────────────── */
    useEffect(() => {
        fetchUserFlats(userId);
    }, [userId]);

    /* ──────────────────────────────────────────────────────────────── */
    /*  (re)load heating details whenever a flat is chosen             */
    /* ──────────────────────────────────────────────────────────────── */
    useEffect(() => {
        fetchFlatDetails(selectedFlatId);
    }, [selectedFlatId]);

    /* ──────────────────────────────────────────────────────────────── */
    /*  load statistics for current user                                */
    /* ──────────────────────────────────────────────────────────────── */
    useEffect(() => {
        fetchStats();
    }, []);

    /* ─── modal callbacks ──────────────────────────────────────────── */
    const handleCreateFlatSuccess = () => {
        setShowCreateFlatModal(false);
        fetchUserFlats(userId);
        fetchStats(); // Update statistics after creating a flat
    };

    const handleEditSuccess = () => {
        setShowEditFlatModal(false);
        setFlatToEdit(null);
        fetchUserFlats(userId);
    };

    const handleAddHeatingSuccess = () => {
        fetchFlatDetails(selectedFlatId);
        setShowAddModal(false);
        fetchStats(); // Update statistics after adding a heating source
    };

    /* ─── delete flat ──────────────────────────────────────────────── */
    const handleDeleteClick = async (flatId) => {
        if (!window.confirm("Are you sure you want to delete this flat?")) return;
        try {
            await axios.delete(`/api/flats/${flatId}`, { headers: { "X-User-ID": userId } });
            fetchUserFlats(userId);
            fetchStats(); // Update statistics after deleting a flat
        } catch (err) {
            console.error(err);
            alert("Failed to delete flat.");
        }
    };

    // Add this function to handle heating source deletion
    const handleDeleteHeatingSource = async (heatingId) => {
        try {
            await axios.delete(`http://localhost:8083/api/heating/${heatingId}`);
            fetchFlatDetails(selectedFlatId);
            fetchStats(); // Update statistics after deleting a heating source
        } catch (err) {
            alert("Failed to delete heating source.");
            console.error(err);
        }
    };

    /* ─── render guards ────────────────────────────────────────────── */
    if (loading) return <p className="text-gray-500">Loading dashboard overview…</p>;
    if (error)   return <p className="text-red-600">Error loading overview: {error}</p>;

    /* ──────────────────────────────────────────────────────────────── */
    /*  JSX                                                            */
    /* ──────────────────────────────────────────────────────────────── */
    return (
        <div className="container mx-auto p-4">
            {/* Statistics Panel at the top */}
            <aside style={{ minWidth: 280, borderBottom: '2px solid #e5e7eb' }} className="bg-white rounded-2xl shadow p-6 h-fit mb-8">
                <h2 className="text-lg font-bold mb-4">Statistics</h2>
                {statsLoading ? (
                    <p className="text-gray-500">Loading…</p>
                ) : statsError ? (
                    <p className="text-red-600">{statsError}</p>
                ) : (
                    <ul className="space-y-2">
                        <li><span className="font-medium">Total Flats:</span> {stats.totalFlats}</li>
                        <li><span className="font-medium">Total Heating Usage:</span> {stats.totalHeatingUsage} kWh</li>
                        <li><span className="font-medium">Average Heating Usage:</span> {stats.averageHeatingUsage} kWh</li>
                    </ul>
                )}
            </aside>
            <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    {/* ===== User flats ===== */}
                    <section className="mt-10">
                        <h2 className="text-xl font-medium mb-2">Your Flats</h2>

                        {flatsLoading ? (
                            <p className="text-gray-500">Loading your flats…</p>
                        ) : flatsError ? (
                            <p className="text-red-600">{flatsError}</p>
                        ) : userFlats.length ? (
                            <ul className="list-disc ml-6 space-y-1">
                                {userFlats.map(flat => (
                                    <li key={flat.id} className="flex justify-between items-center">
                                        <button
                                            onClick={() => setSelectedFlatId(flat.id)}
                                            className="underline text-blue-600"
                                        >
                                            {flat.address}, {flat.city} (ID: {flat.id})
                                        </button>

                                        <div>
                                            <button
                                                onClick={() => { setFlatToEdit(flat); setShowEditFlatModal(true); }}
                                                className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(flat.id)}
                                                className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>You have no flats registered yet.</p>
                        )}

                        <button
                            onClick={() => setShowCreateFlatModal(true)}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add New Flat
                        </button>
                    </section>

                    {/* ===== Heating details for selected flat ===== */}
                    {selectedFlatId && (
                        <section className="mt-10">
                            <h2 className="text-xl font-medium mb-2">
                                Heating sources for flat #{selectedFlatId}
                            </h2>

                            {detailsLoading ? (
                                <p className="text-gray-500">Loading heating sources…</p>
                            ) : Array.isArray(flatDetails?.heatingSources) &&
                            flatDetails.heatingSources.length ? (
                                <>
                                    <table className="table-auto border mb-4">
                                        <thead>
                                        <tr><th>ID</th><th>Type</th><th>Power&nbsp;(kW)</th></tr>
                                        </thead>
                                        <tbody>
                                        {flatDetails.heatingSources.map(h => (
                                            <tr key={h.id}>
                                                <td className="border px-2">{h.id}</td>
                                                <td className="border px-2">{h.type}</td>
                                                <td className="border px-2">{h.power}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteHeatingSource(h.id)}
                                                        className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>

                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        Add heating source
                                    </button>
                                </>
                            ) : Array.isArray(flatDetails?.heatingSources) ? (
                                <>
                                    <p>No heating sources yet.</p>
                                    <button
                                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        Add heating source
                                    </button>
                                </>
                            ) : (
                                /* final fallback — guards against undefined/null */
                                <p className="text-red-600">
                                    Unexpected response from server &nbsp;
                                    <small>(open console for details)</small>
                                </p>
                            )}
                        </section>
                    )}
                </div>
            </div>

            {/* ─── Modals ─────────────────────────────────────────────── */}
            {showCreateFlatModal && (
                <CreateFlatModal
                    userId={userId}
                    onSuccess={handleCreateFlatSuccess}
                    onClose={() => setShowCreateFlatModal(false)}
                />
            )}

            {showEditFlatModal && flatToEdit && (
                <EditFlatModal
                    flat={flatToEdit}
                    onSuccess={handleEditSuccess}
                    onClose={() => { setShowEditFlatModal(false); setFlatToEdit(null); }}
                />
            )}

            {showAddModal && selectedFlatId && (
                <AddHeatingModal
                    flatId={selectedFlatId}
                    onSuccess={handleAddHeatingSuccess}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </div>
    );
}

/* ─── helper component for overview cards ─────────────────────── */
function Card({ title, value }) {
    return (
        <div className="rounded-2xl shadow p-5 bg-white">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
