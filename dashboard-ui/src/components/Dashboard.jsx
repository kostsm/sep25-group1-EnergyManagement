import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    
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


    if (loading) return <p className="text-gray-500">Loading…</p>;
    if (error)   return <p className="text-red-600">Error: {error}</p>;

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
