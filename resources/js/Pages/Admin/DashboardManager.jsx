import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";

export default function DashboardManager({ auth, cards }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { data, setData, post, reset, errors } = useForm({
        name: "",
        path: "",
        button_text: "",
        description: "",
        accent_color: "from-blue-500 to-indigo-600",
    });

    // Change from: post(route("admin.dashboard.store"), ...)
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard-manager", {
            onSuccess: () => reset(),
        });
    };

    // Change from: router.delete(route("admin.dashboard.destroy", id))
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to remove this navigation node?")) {
            router.delete(`/dashboard-manager/${id}`);
        }
    };

    return (
        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold">
                    Admin Dashboard Content System Manager
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Node Form Panel */}
                <div
                    className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                >
                    <h3 className="font-bold text-base mb-4">
                        Add Custom Portal Card
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-bold mb-1">
                                Card System Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="e.g., ERP Packages"
                                className="w-full p-2.5 rounded border bg-transparent"
                            />
                            {errors.name && (
                                <span className="text-red-500">
                                    {errors.name}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold mb-1">
                                Router Destination Path
                            </label>
                            <input
                                type="text"
                                value={data.path}
                                onChange={(e) =>
                                    setData("path", e.target.value)
                                }
                                placeholder="e.g., /ERP"
                                className="w-full p-2.5 rounded border bg-transparent"
                            />
                            {errors.path && (
                                <span className="text-red-500">
                                    {errors.path}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold mb-1">
                                Interactive Action Button Name
                            </label>
                            <input
                                type="text"
                                value={data.button_text}
                                onChange={(e) =>
                                    setData("button_text", e.target.value)
                                }
                                placeholder="e.g., Access Portal"
                                className="w-full p-2.5 rounded border bg-transparent"
                            />
                            {errors.button_text && (
                                <span className="text-red-500">
                                    {errors.button_text}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold mb-1">
                                Functional Abstract Field Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows="3"
                                placeholder="Describe system node processes..."
                                className="w-full p-2.5 rounded border bg-transparent"
                            />
                            {errors.description && (
                                <span className="text-red-500">
                                    {errors.description}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block font-bold mb-1">
                                Visual Theme Accent Gradient Profile
                            </label>
                            <select
                                value={data.accent_color}
                                onChange={(e) =>
                                    setData("accent_color", e.target.value)
                                }
                                className="w-full p-2.5 rounded border bg-transparent dark:bg-slate-900"
                            >
                                <option value="from-blue-500 to-indigo-600">
                                    Blue-Indigo Gradient
                                </option>
                                <option value="from-orange-500 to-amber-600">
                                    Orange-Amber Gradient
                                </option>
                                <option value="from-rose-500 to-red-600">
                                    Rose-Red Gradient
                                </option>
                                <option value="from-emerald-500 to-teal-600">
                                    Emerald-Teal Gradient
                                </option>
                                <option value="from-purple-500 to-fuchsia-600">
                                    Purple-Fuchsia Gradient
                                </option>
                                <option value="from-cyan-500 to-blue-600">
                                    Cyan-Blue Gradient
                                </option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded transition-all uppercase tracking-wider"
                        >
                            Deploy Node to Dashboard
                        </button>
                    </form>
                </div>

                {/* Active Grid Control Timeline View */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-base">
                        Active Registered Operational Nodes
                    </h3>
                    {cards.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">
                            No nodes configured. Use the generation interface
                            panel to expand system layout vectors.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {cards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`p-4 border rounded-xl flex items-center justify-between gap-4 text-xs ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`h-3 w-3 rounded-full bg-gradient-to-r ${card.accent_color}`}
                                        />
                                        <div>
                                            <h4 className="font-bold text-sm">
                                                {card.name}
                                            </h4>
                                            <p className="opacity-60">
                                                {card.path} — Button: "
                                                {card.button_text}"
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-bold px-3 py-1.5 rounded transition-all"
                                    >
                                        Remove Card
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
