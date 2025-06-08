import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateFlatModal from "./CreateFlatModal";
import EditFlatModal from "./EditFlatModal";

export default function Dashboard({ userId }) {
    const [overview, setOverview] = useState(null);
    const [userFlats, setUserFlats] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [flatsLoading, setFlatsLoading] = useState(true);
    const [flatsError, setFlatsError] = useState(null);
    const [showCreateFlatModal, setShowCreateFlatModal] = useState(false);
    const [showEditFlatModal, setShowEditFlatModal] = useState(false);
    const [flatToEdit, setFlatToEdit] = useState(null);

    const fetchUserFlats = (currentUserId) => {
        console.log("Attempting to fetch flats for userId:", currentUserId);
        if (currentUserId) {
            setFlatsLoading(true);
            setFlatsError(null);
            axios.get(`http://localhost:8082/api/flats/user/${currentUserId}`)
                .then(response => {
                    setUserFlats(response.data);
                    setFlatsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching user flats:", err);
                    setFlatsError("Failed to fetch your flats.");
                    setFlatsLoading(false);
                });
        } else {
             setUserFlats([]);
             setFlatsLoading(false);
        }
    };

    useEffect(() => {
        // TODO: replace with real API
        setOverview({
            totalFlats: 42,
            totalCitizens: 123,
            avgConsumption: 98.7,
            mix: [
                { type: "Gas",        percent: 40 },
                { type: "Heat Pump",  percent: 35 },
                { type: "Electric",   percent: 25 }
            ]
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUserFlats(userId);
    }, [userId]);

    const handleCreateFlatSuccess = () => {
        console.log("Flat created successfully, attempting to refresh flats list.");
        setShowCreateFlatModal(false);
        fetchUserFlats(userId);
    };

    const handleCreateFlatClose = () => {
        setShowCreateFlatModal(false);
    };

    const handleEditClick = (flat) => {
        setFlatToEdit(flat);
        setShowEditFlatModal(true);
    };

    const handleEditSuccess = () => {
        console.log("Flat updated successfully, attempting to refresh flats list.");
        setShowEditFlatModal(false);
        setFlatToEdit(null);
        fetchUserFlats(userId);
    };

    const handleEditClose = () => {
        setShowEditFlatModal(false);
        setFlatToEdit(null);
    };

    const handleDeleteClick = async (flatId) => {
        if (window.confirm("Are you sure you want to delete this flat?")) {
            try {
                await axios.delete(`http://localhost:8082/api/flats/${flatId}`);
                console.log(`Flat with ID ${flatId} deleted successfully.`);
                fetchUserFlats(userId);
            } catch (err) {
                console.error(`Error deleting flat with ID ${flatId}:`, err);
                alert("Failed to delete flat.");
            }
        }
    };

    if (loading) return <p className="text-gray-500">Loading dashboard overview…</p>;
    if (error)   return <p className="text-red-600">Error loading overview: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Smart-City Energy Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card title="Total Flats"         value={overview.totalFlats}/>
                <Card title="Registered Citizens" value={overview.totalCitizens}/>
                <Card title="Avg Consumption (kWh)" value={overview.avgConsumption}/>
            </div>

            <section className="mt-10">
                <h2 className="text-xl font-medium mb-2">Heating Source Mix</h2>
                <ul className="list-disc ml-6 space-y-1">
                    {overview.mix.map(m => (
                        <li key={m.type}>{m.type}: {m.percent}%</li>
                    ))}
                </ul>
            </section>

            <section className="mt-10">
                <h2 className="text-xl font-medium mb-2">Your Flats</h2>
                {flatsLoading ? (
                    <p className="text-gray-500">Loading your flats…</p>
                ) : flatsError ? (
                    <p className="text-red-600">Error loading your flats: {flatsError}</p>
                ) : userFlats.length > 0 ? (
                    <ul className="list-disc ml-6 space-y-1">
                        {userFlats.map(flat => (
                            <li key={flat.id} className="flex justify-between items-center">
                                <span>{flat.address}, {flat.city} (ID: {flat.id})</span>
                                <div>
                                    <button
                                        onClick={() => handleEditClick(flat)}
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

            {showCreateFlatModal && (
                <CreateFlatModal
                    userId={userId}
                    onSuccess={handleCreateFlatSuccess}
                    onClose={handleCreateFlatClose}
                />
            )}

            {showEditFlatModal && flatToEdit && (
                <EditFlatModal
                    flat={flatToEdit}
                    onSuccess={handleEditSuccess}
                    onClose={handleEditClose}
                />
            )}
        </div>
    );
}

function Card({title, value}) {
    return (
        <div className="rounded-2xl shadow p-5 bg-white">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
