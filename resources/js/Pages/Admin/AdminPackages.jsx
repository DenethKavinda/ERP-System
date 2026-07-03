import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function AdminPackages({ packages = [], isDarkMode = false }) {
    // Highlight-add: Track active operation targets
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
        price: "",
        suitable_for: "", // Comma-separated string
        features: "", // Comma-separated string
        benefits: "", // Comma-separated string
        rating: "5.0",
    });

    // Highlight-add: Pre-populate context values for updating state loops
    const handleEditInit = (pkg) => {
        setEditingId(pkg.id);
        setData({
            name: pkg.name,
            price: pkg.price,
            suitable_for: pkg.suitable_for || "",
            features: pkg.features || "",
            benefits: pkg.benefits || "",
            rating: pkg.rating || "5.0",
        });
    };

    // Highlight-add: Cancel current editing context loop flow
    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Highlight-select: Conditional redirection based on editing state
        if (editingId) {
            put(`/admin/erp-packages/${editingId}`, {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post("/admin/erp-packages", {
                onSuccess: () => reset(),
            });
        }
    };

    // Highlight-add: Destruction pipeline link sequence hook
    const handleDelete = (id) => {
        if (
            confirm(
                "Are you sure you want to permanently delete this ERP package configuration setup?",
            )
        ) {
            router.delete(`/admin/erp-packages/${id}`);
            if (editingId === id) handleCancelEdit();
        }
    };

    return (
        <div
            className={`flex min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
        >
            <Sidebar isDarkMode={isDarkMode} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-black tracking-tight">
                            ERP Packages Manager
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Create and modify service packages shown on the
                            client-facing store.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT SIDEBAR: Creation/Modification Form Input Card */}
                        <div
                            className={`p-6 rounded-xl border h-fit ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        >
                            {/* Highlight-select: Dynamic Heading titles based on status state */}
                            <h2 className="text-lg font-bold mb-4">
                                {editingId
                                    ? "Modify ERP Package"
                                    : "Create New ERP Package"}
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 text-xs"
                            >
                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Package Name
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g., Enterprise Starter"
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 mt-1 block">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Price (LKR)
                                    </label>
                                    <input
                                        type="number"
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        placeholder="e.g., 75000"
                                    />
                                    {errors.price && (
                                        <span className="text-red-500 mt-1 block">
                                            {errors.price}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Suitable For (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.suitable_for}
                                        onChange={(e) =>
                                            setData(
                                                "suitable_for",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Small Businesses, Startups"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Core Features (Comma Separated)
                                    </label>
                                    <textarea
                                        rows="2"
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.features}
                                        onChange={(e) =>
                                            setData("features", e.target.value)
                                        }
                                        placeholder="Inventory Control, 5 User Licenses, Cloud Storage"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Core Benefits (Comma Separated)
                                    </label>
                                    <textarea
                                        rows="2"
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.benefits}
                                        onChange={(e) =>
                                            setData("benefits", e.target.value)
                                        }
                                        placeholder="Boost ROI, Streamline Workflow Processes"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Store Rating Value
                                    </label>
                                    <select
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 dark:bg-slate-800 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.rating}
                                        onChange={(e) =>
                                            setData("rating", e.target.value)
                                        }
                                    >
                                        <option value="5.0">
                                            5.0 - Perfect Score
                                        </option>
                                        <option value="4.5">
                                            4.5 - Highly Recommended
                                        </option>
                                        <option value="4.0">
                                            4.0 - Stable Option
                                        </option>
                                    </select>
                                </div>

                                {/* Highlight-select: Action option buttons change dynamically */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`flex-1 text-white p-3 rounded-lg font-black uppercase tracking-wider transition-colors disabled:opacity-50 ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"}`}
                                    >
                                        {editingId
                                            ? "Save Changes"
                                            : "Publish Package"}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-3 border border-slate-300 dark:border-slate-600 font-bold uppercase tracking-wider rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* RIGHT SIDEBAR: Inventory Control Datatable List Workspace View */}
                        <div className="lg:col-span-2">
                            <div
                                className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                            >
                                <h2 className="text-lg font-bold mb-4">
                                    Active Catalog Configurations (
                                    {packages.length})
                                </h2>

                                {packages.length === 0 ? (
                                    <p className="text-sm text-slate-400 py-4 text-center">
                                        No structural configurations published
                                        yet.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-400">
                                                    <th className="pb-3 font-bold">
                                                        Package Variant Details
                                                    </th>
                                                    <th className="pb-3 font-bold">
                                                        Target Workspace Profile
                                                    </th>
                                                    <th className="pb-3 font-bold">
                                                        Pricing Configuration
                                                    </th>
                                                    <th className="pb-3 font-bold text-right">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {packages.map((pkg) => (
                                                    <tr
                                                        key={pkg.id}
                                                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors ${editingId === pkg.id ? "bg-blue-500/5 dark:bg-blue-500/10" : ""}`}
                                                    >
                                                        <td className="py-3 pr-4 font-semibold">
                                                            {pkg.name}
                                                        </td>
                                                        <td className="py-3 text-xs max-w-xs truncate text-slate-500 dark:text-slate-400">
                                                            {pkg.suitable_for ||
                                                                "General Use"}
                                                        </td>
                                                        <td className="py-3 font-black text-orange-500">
                                                            LKR{" "}
                                                            {Number(
                                                                pkg.price,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            {/* Highlight-add: Modifying operational tools row action anchors */}
                                                            <div className="flex justify-end items-center gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditInit(
                                                                            pkg,
                                                                        )
                                                                    }
                                                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-black uppercase tracking-wider transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <span className="text-slate-300 dark:text-slate-600">
                                                                    |
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            pkg.id,
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs font-black uppercase tracking-wider transition-colors"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
