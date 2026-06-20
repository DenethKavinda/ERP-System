import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function AdminPackages({ packages = [], isDarkMode = false }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
        price: "",
        suitable_for: "", // Comma-separated string
        features: "", // Comma-separated string
        benefits: "", // Comma-separated string
        rating: "5.0",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/erp-packages", {
            onSuccess: () => reset(),
        });
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
                        <p className="text-sm text-slate-500">
                            Create and modify service packages shown on the
                            client-facing store.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Creation Form */}
                        <div
                            className={`lg:col-span-1 p-6 rounded-xl border h-fit ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        >
                            <h2 className="text-lg font-bold mb-4">
                                Add New Package
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Package Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Basic ERP"
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Price (LKR / month)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="15000"
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Suitable For (Comma separated)
                                    </label>
                                    <textarea
                                        placeholder="Small shops, Startups, Small businesses"
                                        rows="2"
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                                        value={data.suitable_for}
                                        onChange={(e) =>
                                            setData(
                                                "suitable_for",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Features (Comma separated)
                                    </label>
                                    <textarea
                                        placeholder="Customer Management, Product Management, 5 User Accounts"
                                        rows="3"
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                                        value={data.features}
                                        onChange={(e) =>
                                            setData("features", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Benefits (Comma separated)
                                    </label>
                                    <textarea
                                        placeholder="Easy to use, Affordable, Handles daily syncs"
                                        rows="2"
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                                        value={data.benefits}
                                        onChange={(e) =>
                                            setData("benefits", e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                                >
                                    Publish Dynamic Package
                                </button>
                            </form>
                        </div>

                        {/* Existing items Table Tracker */}
                        <div className="lg:col-span-2">
                            <div
                                className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                            >
                                <h2 className="text-lg font-bold mb-4">
                                    Active System Packages ({packages.length})
                                </h2>
                                {packages.length === 0 ? (
                                    <p className="text-sm text-slate-400 py-4 text-center">
                                        No packages published yet.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
                                                    <th className="pb-3 font-bold">
                                                        Package Name
                                                    </th>
                                                    <th className="pb-3 font-bold">
                                                        Target Audience
                                                    </th>
                                                    <th className="pb-3 font-bold text-right">
                                                        Pricing Tier
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {packages.map((pkg) => (
                                                    <tr
                                                        key={pkg.id}
                                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                                                    >
                                                        <td className="py-3 font-semibold">
                                                            {pkg.name}
                                                        </td>
                                                        <td className="py-3 text-xs max-w-xs truncate text-slate-500 dark:text-slate-400">
                                                            {pkg.suitable_for}
                                                        </td>
                                                        <td className="py-3 text-right font-black text-orange-500">
                                                            LKR{" "}
                                                            {Number(
                                                                pkg.price,
                                                            ).toLocaleString()}
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
