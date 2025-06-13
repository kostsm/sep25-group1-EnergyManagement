import React, { useState } from "react";
import axios from "axios";

export default function AddHeatingModal({ flatId, onSuccess, onClose }) {
    const [type,  setType]  = useState("GAS");
    const [power, setPower] = useState("");

    const submit = () => {
        axios.post("http://localhost:8083/api/heating", {
            type,
            power: Number(power),
            flatId
        })
            .then(() => onSuccess())
            .catch(err => {
                alert("Failed: " + err);
                console.error(err);
            });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg min-w-[300px]">
                <h3 className="text-lg font-medium mb-4">Add Heating Source</h3>

                <label className="block mb-2">
                    Type:
                    <select
                        className="border ml-2"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="GAS">Gas</option>
                        <option value="ELECTRIC">Electric</option>
                        <option value="HEAT_PUMP">Heat pump</option>
                        <option value="DISTRICT_HEATING">District heating</option>
                        <option value="SOLAR_THERMAL">Solar thermal</option>
                    </select>
                </label>

                <label className="block mb-4">
                    Power&nbsp;(kW):
                    <input
                        type="number"
                        step="0.1"
                        className="border ml-2 w-24"
                        value={power}
                        onChange={e => setPower(e.target.value)}
                    />
                </label>

                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
