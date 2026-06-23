import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function DashboardManager({ auth, cards }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Highlight-add: Track whether we are editing an existing node
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, reset, errors } = useForm({
        name: "",
        path: "",
        button_text: "",
        description: "",
        accent_color: "from-blue-500 to-indigo-600",
    });

    // Highlight-add: Populate form for editing
    const handleEditInit = (card) => {
        setEditingId(card.id);
        setData({
            name: card.name,
            path: card.path,
            button_text: card.button_text,
            description: card.description || "",
            accent_color: card.accent_color,
        });
    };

    // Highlight-add: Clear form and exit edit mode
    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Highlight-select: Conditional routing logic based on state
        if (editingId) {
            put(`/admin/dashboard-manager/${editingId}`, {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post("/admin/dashboard-manager", {
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to remove this navigation node?")) {
            router.delete(`/admin/dashboard-manager/${id}`);
            // If deleting the item currently being edited, reset the form state
            if (editingId === id) handleCancelEdit();
        }
    };

    return (
        <div
            className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Admin Framework Manager" />
            <Sidebar isDarkMode={isDarkMode} />

            <main className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl">
                <div className="border-b pb-3 border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">
                            Admin Dashboard Content System Manager
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="text-[11px] font-bold tracking-wide uppercase border px-3 py-1 rounded bg-transparent border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                        Mode: {isDarkMode ? "Dark" : "Light"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Node Form Panel */}
                    <div
                        className={`p-6 rounded-xl border self-start ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        {/* Highlight-select: Dynamic Heading titles */}
                        <h3 className="font-bold text-base mb-4">
                            {editingId
                                ? "Modify Registered Node"
                                : "Add Custom Portal Card"}
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 text-xs"
                        >
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
                                    className={`w-full p-2.5 rounded border bg-transparent ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
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
                                    className={`w-full p-2.5 rounded border bg-transparent ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
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
                                    className={`w-full p-2.5 rounded border bg-transparent ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
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
                                    className={`w-full p-2.5 rounded border bg-transparent ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
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
                                    className={`w-full p-2.5 rounded border bg-transparent dark:bg-slate-900 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
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
                                    <option value="from-green-500 to-lime-600">
                                        Green-Lime Gradient
                                    </option>
                                    <option value="from-pink-500 to-rose-600">
                                        Pink-Rose Gradient
                                    </option>
                                    <option value="from-yellow-500 to-orange-600">
                                        Yellow-Orange Gradient
                                    </option>
                                </select>
                            </div>

                            {/* Highlight-select: Conditional Form Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className={`flex-1 font-bold py-2.5 rounded transition-all uppercase tracking-wider text-white ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"}`}
                                >
                                    {editingId
                                        ? "Save Engine Engine Updates"
                                        : "Deploy Node to Dashboard"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded transition-all uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Active Grid Control Timeline View */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-bold text-base">
                            Active Registered Operational Nodes
                        </h3>
                        {cards.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">
                                No nodes configured. Use the generation
                                interface panel to expand system layout vectors.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className={`p-4 border rounded-xl flex items-center justify-between gap-4 text-xs ${editingId === card.id ? "ring-2 ring-blue-500" : ""} ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
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
                                        <div className="flex gap-2">
                                            {/* Highlight-add: Edit Action Hook Trigger */}
                                            <button
                                                onClick={() =>
                                                    handleEditInit(card)
                                                }
                                                className="bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-500 font-bold px-3 py-1.5 rounded transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(card.id)
                                                }
                                                className="bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 font-bold px-3 py-1.5 rounded transition-all"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
