import { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";

export default function Subscribers({ auth, subscribers = [] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editPlan, setEditPlan] = useState("");
    const [editExpiry, setEditExpiry] = useState("");

    const isDarkMode = document.documentElement.classList.contains("dark");

    const filtered = useMemo(() => {
        return subscribers.filter((s) => {
            const matchesSearch =
                !search ||
                s.customer_id?.toLowerCase().includes(search.toLowerCase()) ||
                s.business_name?.toLowerCase().includes(search.toLowerCase()) ||
                s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && s.is_active) ||
                (statusFilter === "expired" && !s.is_active);

            return matchesSearch && matchesStatus;
        });
    }, [subscribers, search, statusFilter]);

    const handleSaveEdit = (userId) => {
        router.put(
            `/admin/subscribers/${userId}`,
            {
                package_name: editPlan,
                expires_at: editExpiry,
            },
            {
                preserveScroll: true,
                onSuccess: () => setEditingId(null),
            }
        );
    };

    const stats = useMemo(() => {
        const total = subscribers.length;
        const active = subscribers.filter((s) => s.is_active).length;
        const expired = total - active;
        const free = subscribers.filter(
            (s) => s.plan_name === "ERP Free Starter"
        ).length;
        const paid = total - free;
        return { total, active, expired, free, paid };
    }, [subscribers]);

    return (
        <>
            <Head title="Customer Subscriptions" />
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
                <Sidebar auth={auth} />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1
                            className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                            Customer Subscriptions
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            View and manage all customer accounts and their
                            subscription plans
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        {[
                            {
                                label: "Total Customers",
                                value: stats.total,
                                color: "text-slate-700 dark:text-slate-200",
                                bg: "bg-white dark:bg-slate-900",
                            },
                            {
                                label: "Active",
                                value: stats.active,
                                color: "text-emerald-600",
                                bg: "bg-emerald-50 dark:bg-emerald-950/30",
                            },
                            {
                                label: "Expired",
                                value: stats.expired,
                                color: "text-red-600",
                                bg: "bg-red-50 dark:bg-red-950/30",
                            },
                            {
                                label: "Free Plan",
                                value: stats.free,
                                color: "text-blue-600",
                                bg: "bg-blue-50 dark:bg-blue-950/30",
                            },
                            {
                                label: "Paid Plans",
                                value: stats.paid,
                                color: "text-orange-600",
                                bg: "bg-orange-50 dark:bg-orange-950/30",
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className={`${stat.bg} rounded-xl border border-slate-200 dark:border-slate-800 p-4`}
                            >
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                    {stat.label}
                                </p>
                                <p
                                    className={`text-2xl font-black ${stat.color}`}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Search by Customer ID, Business Name, Name, or Email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                            }`}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`px-4 py-2.5 rounded-xl border text-sm font-bold ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-700 text-white"
                                    : "bg-white border-slate-200 text-slate-900"
                            }`}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="expired">Expired Only</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div
                        className={`rounded-2xl border overflow-hidden ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr
                                        className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "bg-slate-800/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}
                                    >
                                        <th className="text-left px-4 py-3">
                                            Customer ID
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Business / Name
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Email
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Mobile
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Plan
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Expires
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Registered
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="px-4 py-12 text-center text-slate-400"
                                            >
                                                No customers found
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((sub) => (
                                            <tr
                                                key={sub.id}
                                                className={`transition-colors ${isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}
                                            >
                                                <td className="px-4 py-3">
                                                    <span className="font-mono font-bold text-orange-600 text-xs">
                                                        {sub.customer_id ||
                                                            "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p
                                                            className={`font-bold text-xs ${isDarkMode ? "text-white" : "text-slate-900"}`}
                                                        >
                                                            {sub.business_name ||
                                                                "-"}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400">
                                                            {sub.name}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500">
                                                    {sub.email}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                                                    {sub.mobile_number || "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {editingId === sub.id ? (
                                                        <select
                                                            value={editPlan}
                                                            onChange={(e) =>
                                                                setEditPlan(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                        >
                                                            <option value="ERP Free Starter">
                                                                Free Starter
                                                            </option>
                                                            <option value="ERP Basic Essentials">
                                                                Basic
                                                                Essentials
                                                            </option>
                                                            <option value="ERP Professional Growth">
                                                                Professional
                                                                Growth
                                                            </option>
                                                            <option value="Enterprise Custom Core">
                                                                Enterprise
                                                                Custom
                                                            </option>
                                                        </select>
                                                    ) : (
                                                        <span
                                                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                sub.plan_name ===
                                                                "ERP Free Starter"
                                                                    ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                            }`}
                                                        >
                                                            {sub.plan_name ||
                                                                "No Plan"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                            sub.is_active
                                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${sub.is_active ? "bg-emerald-500" : "bg-red-500"}`}
                                                        />
                                                        {sub.is_active
                                                            ? "ACTIVE"
                                                            : "EXPIRED"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500">
                                                    {editingId === sub.id ? (
                                                        <input
                                                            type="date"
                                                            value={editExpiry}
                                                            onChange={(e) =>
                                                                setEditExpiry(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                        />
                                                    ) : sub.expires_at ? (
                                                        new Date(
                                                            sub.expires_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-400">
                                                    {new Date(
                                                        sub.created_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {editingId === sub.id ? (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleSaveEdit(
                                                                        sub.id
                                                                    )
                                                                }
                                                                className="px-2 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                                                            >
                                                                SAVE
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setEditingId(
                                                                        null
                                                                    )
                                                                }
                                                                className="px-2 py-1 text-[10px] font-bold bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 cursor-pointer"
                                                            >
                                                                CANCEL
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(
                                                                    sub.id
                                                                );
                                                                setEditPlan(
                                                                    sub.plan_name ||
                                                                        "ERP Free Starter"
                                                                );
                                                                setEditExpiry(
                                                                    sub.expires_at
                                                                        ? sub.expires_at.split(
                                                                              "T"
                                                                          )[0]
                                                                        : ""
                                                                );
                                                            }}
                                                            className="px-2.5 py-1 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 cursor-pointer"
                                                        >
                                                            EDIT
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                        Showing {filtered.length} of {subscribers.length}{" "}
                        customers
                    </p>
                </main>
            </div>
        </>
    );
}
