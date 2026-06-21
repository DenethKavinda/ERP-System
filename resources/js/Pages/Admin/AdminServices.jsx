import React from "react";
import { useForm } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function AdminServices({ services = [], isDarkMode = false }) {
    // Standard Inertia Form hook layer configured for input state handling
    const {
        data,
        setData,
        post,
        delete: destroy,
        reset,
        processing,
        errors,
    } = useForm({
        name: "",
        category: "Cloud & Security",
        price: "",
        billing_type: "monthly",
        description: "",
    });

    // Form submission processing loop
    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("admin.services.store"), {
            onSuccess: () => reset(),
        });
    };

    // Row extraction delete handler matching system logic
    const handleDelete = (id) => {
        if (
            confirm(
                "Are you sure you want to completely remove this individual service entry from system records?",
            )
        ) {
            destroy(route("admin.services.destroy", id));
        }
    };

    return (
        <div
            className={`flex min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
        >
            {/* Integrated Standard Control Console Sidebar */}
            <Sidebar isDarkMode={isDarkMode} />

            {/* Main Application Container Space */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Workspace Top Description Header Layout */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-black tracking-tight">
                            Standalone Services Catalog Panel
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Configure individual modular micro-services
                            accessible directly by user environments.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT SIDEBAR: Creation Input Card Wrapper */}
                        <div
                            className={`lg:col-span-1 p-6 rounded-xl border h-fit ${
                                isDarkMode
                                    ? "bg-slate-800 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >
                            <h2 className="text-lg font-bold mb-4">
                                Add New Service
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Service Name input slot element */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Service Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Automated Backups Node"
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-700 text-white"
                                                : "bg-slate-50 border-slate-200"
                                        }`}
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                {/* Category Dropdown layout selector choice element */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Category Classification
                                    </label>
                                    <select
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-700 text-white"
                                                : "bg-slate-50 border-slate-200"
                                        }`}
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                    >
                                        <option value="Cloud & Security">
                                            Cloud & Security
                                        </option>
                                        <option value="Priority Support">
                                            Priority Support
                                        </option>
                                        <option value="System Migration">
                                            System Migration
                                        </option>
                                        <option value="Custom Extensions">
                                            Custom Extensions
                                        </option>
                                        <option value="Database Optimization">
                                            Database Optimization
                                        </option>
                                        <option value="Analytical Extensions">
                                            Analytical Extensions
                                        </option>
                                        <option value="Storage & Backups">
                                            Storage & Backups
                                        </option>
                                        <option value="Security & Compliance">
                                            Security & Compliance
                                        </option>
                                    </select>
                                </div>

                                {/* Split Row Element for Price Tier and Billing Loop Cycle Handling */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                            Price (LKR)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="5000"
                                            className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${
                                                isDarkMode
                                                    ? "bg-slate-900 border-slate-700 text-white"
                                                    : "bg-slate-50 border-slate-200"
                                            }`}
                                            value={data.price}
                                            onChange={(e) =>
                                                setData("price", e.target.value)
                                            }
                                        />
                                        {errors.price && (
                                            <span className="text-red-500 text-xs mt-1 block">
                                                {errors.price}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                            Billing Loop
                                        </label>
                                        <select
                                            className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${
                                                isDarkMode
                                                    ? "bg-slate-900 border-slate-700 text-white"
                                                    : "bg-slate-50 border-slate-200"
                                            }`}
                                            value={data.billing_type}
                                            onChange={(e) =>
                                                setData(
                                                    "billing_type",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="monthly">
                                                Monthly
                                            </option>
                                            <option value="one-time">
                                                One-Time
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* Functional Description Paragraph Input Field */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Functional Description
                                    </label>
                                    <textarea
                                        placeholder="Enter structural metric details regarding the micro-service architecture parameters here..."
                                        rows="3"
                                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-700 text-white"
                                                : "bg-slate-50 border-slate-200"
                                        }`}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                                >
                                    Publish New Service
                                </button>
                            </form>
                        </div>

                        {/* RIGHT SIDEBAR: Inventory Tracking Datatable Workspace List Tracker */}
                        <div className="lg:col-span-2">
                            <div
                                className={`p-6 rounded-xl border ${
                                    isDarkMode
                                        ? "bg-slate-800 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >
                                <h2 className="text-lg font-bold mb-4">
                                    Active System Services ({services.length})
                                </h2>

                                {services.length === 0 ? (
                                    <p className="text-sm text-slate-400 py-4 text-center">
                                        No standalone ecosystem services
                                        published yet.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-400">
                                                    <th className="pb-3 font-bold">
                                                        Service Particulars
                                                    </th>
                                                    <th className="pb-3 font-bold">
                                                        Category
                                                    </th>
                                                    <th className="pb-3 font-bold">
                                                        Pricing structure
                                                    </th>
                                                    <th className="pb-3 font-bold text-right">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {services.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                                                    >
                                                        <td className="py-3 pr-4">
                                                            <span className="font-semibold block">
                                                                {item.name}
                                                            </span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400 block max-w-xs truncate mt-0.5">
                                                                {
                                                                    item.description
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            {item.category}
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="font-black text-orange-500 block">
                                                                LKR{" "}
                                                                {Number(
                                                                    item.price,
                                                                ).toLocaleString()}
                                                            </span>
                                                            <span className="text-[10px] uppercase font-bold tracking-wide text-slate-400 block capitalize">
                                                                {
                                                                    item.billing_type
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs font-black uppercase tracking-wider bg-transparent border-none cursor-pointer outline-none transition-colors"
                                                            >
                                                                Delete
                                                            </button>
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
