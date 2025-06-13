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

    /* ─── modal callbacks ──────────────────────────────────────────── */
    const handleCreateFlatSuccess = () => {
        setShowCreateFlatModal(false);
        fetchUserFlats(userId);
    };

    const handleEditSuccess = () => {
        setShowEditFlatModal(false);
        setFlatToEdit(null);
        fetchUserFlats(userId);
    };

    const handleAddHeatingSuccess = () => {
        fetchFlatDetails(selectedFlatId);
        setShowAddModal(false);
    };

    /* ─── delete flat ──────────────────────────────────────────────── */
    const handleDeleteClick = async (flatId) => {
        if (!window.confirm("Are you sure you want to delete this flat?")) return;
        try {
            await axios.delete(`/api/flats/${flatId}`, { headers: { "X-User-ID": userId } });
            fetchUserFlats(userId);
        } catch (err) {
            console.error(err);
            alert("Failed to delete flat.");
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
            {/* ===== Overview cards ===== */}
            <h1 className="text-2xl font-semibold mb-6">Smart-City Energy Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card title="Total Flats"           value={overview.totalFlats} />
                <Card title="Registered Citizens"   value={overview.totalCitizens} />
                <Card title="Avg Consumption (kWh)" value={overview.avgConsumption} />
            </div>

            {/* ===== Heating mix demo ===== */}
            <section className="mt-10">
                <h2 className="text-xl font-medium mb-2">Heating Source Mix</h2>
                <ul className="list-disc ml-6 space-y-1">
                    {overview.mix.map(m => (
                        <li key={m.type}>{m.type}: {m.percent}%</li>
                    ))}
                </ul>
            </section>

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
