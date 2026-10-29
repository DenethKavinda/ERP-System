import { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";

export default function Subscribers({ auth, subscribers = [], packages = [], flash = {} }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState(null);
    const [editPlan, setEditPlan] = useState("ERP Professional Growth");
    const [editCycle, setEditCycle] = useState("monthly");
    const [editBankRef, setEditBankRef] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editExpiry, setEditExpiry] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const getStandardPrice = (planName, cycle) => {
        const found = packages.find(p => p.name === planName || p.code === planName);
        if (found) {
            return cycle === 'annual'
                ? (found.annual_price ? Number(found.annual_price) : Number(found.price) * 10)
                : Number(found.price);
        }
        const fallback = {
            "ERP Free Starter": { monthly: 0, annual: 0 },
            "ERP Basic Essentials": { monthly: 45000, annual: 450000 },
            "ERP Professional Growth": { monthly: 95000, annual: 950000 },
            "Enterprise Custom Core": { monthly: 195000, annual: 1950000 },
        };
        return fallback[planName]?.[cycle] ?? 0;
    };

    const openEditModal = (sub) => {
        setSelectedSub(sub);
        const rawPlan = sub.plan_name && sub.plan_name !== "No Plan" ? sub.plan_name : "ERP Professional Growth";
        // Strip billing cycle suffixes e.g. " (Monthly)" or " (Annual Prepay)"
        const cleanPlan = rawPlan.replace(/\s*\((Monthly|Yearly|Annual|Annual Prepay)\)/i, '').trim();
        
        // Match against valid packages from the database or map fuzzy
        const match = packages.find(p => p.name.toLowerCase() === cleanPlan.toLowerCase() || p.code === cleanPlan.toLowerCase());
        const plan = match ? match.name : (
            cleanPlan.toLowerCase().includes("enterprise") ? "Enterprise Custom Core" :
            cleanPlan.toLowerCase().includes("pro") ? "ERP Professional Growth" :
            cleanPlan.toLowerCase().includes("basic") ? "ERP Basic Essentials" : "ERP Free Starter"
        );

        let cycle = sub.billing_cycle || "monthly";
        if (rawPlan.toLowerCase().includes("annual") || rawPlan.toLowerCase().includes("yearly")) {
            cycle = "annual";
        }

        setEditPlan(plan);
        setEditCycle(cycle);
        setEditBankRef(sub.bank_ref || "");
        setEditAmount(sub.amount ? String(sub.amount) : String(getStandardPrice(plan, cycle)));
        
        if (sub.expires_at) {
            setEditExpiry(sub.expires_at.split("T")[0]);
        } else {
            const d = new Date();
            d.setDate(d.getDate() + (cycle === 'annual' ? 365 : 30));
            setEditExpiry(d.toISOString().split("T")[0]);
        }
        setEditModalOpen(true);
    };

    const handlePlanChange = (newPlan) => {
        setEditPlan(newPlan);
        setEditAmount(String(getStandardPrice(newPlan, editCycle)));
    };

    const handleCycleChange = (newCycle) => {
        setEditCycle(newCycle);
        setEditAmount(String(getStandardPrice(editPlan, newCycle)));
        const d = new Date();
        d.setDate(d.getDate() + (newCycle === 'annual' ? 365 : 30));
        setEditExpiry(d.toISOString().split("T")[0]);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!selectedSub) return;
        setIsSubmitting(true);
        router.put(
            `/admin/subscribers/${selectedSub.id}`,
            {
                package_name: editPlan,
                billing_cycle: editCycle,
                bank_ref: editBankRef,
                amount: editAmount ? parseFloat(editAmount) : 0,
                expires_at: editExpiry || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setEditModalOpen(false);
                    setSelectedSub(null);
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            }
        );
    };

    const handleTerminate = (userId) => {
        if (confirm("Are you sure you want to terminate this subscription? The customer will lose access immediately.")) {
            router.post(`/admin/subscribers/${userId}/terminate`, {}, { preserveScroll: true });
        }
    };

    const handleReactivate = (userId) => {
        router.post(`/admin/subscribers/${userId}/reactivate`, {}, { preserveScroll: true });
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
                            View and manage all customer accounts, bank transfer activations, and subscription plans
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center justify-between">
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm font-bold flex items-center justify-between">
                            <span>{flash.error}</span>
                        </div>
                    )}

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
                                label: "Expired / Inactive",
                                value: stats.expired,
                                color: "text-red-500",
                                bg: "bg-red-50 dark:bg-red-950/30",
                            },
                            {
                                label: "Paid Plans",
                                value: stats.paid,
                                color: "text-orange-600",
                                bg: "bg-orange-50 dark:bg-orange-950/30",
                            },
                            {
                                label: "Free Starter",
                                value: stats.free,
                                color: "text-slate-500",
                                bg: "bg-white dark:bg-slate-900",
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className={`${stat.bg} p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs`}
                            >
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
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

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by customer ID, business name, user name, or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium ${
                                    isDarkMode
                                        ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                }`}
                            />
                            <svg
                                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

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
                                            Cycle
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Expires
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Bank Ref
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
                                                colSpan={11}
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
                                                        {sub.customer_id || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p
                                                            className={`font-bold text-xs ${isDarkMode ? "text-white" : "text-slate-900"}`}
                                                        >
                                                            {sub.business_name || "-"}
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
                                                    <span
                                                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                            sub.plan_name === "ERP Free Starter"
                                                                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                        }`}
                                                    >
                                                        {sub.plan_name || "No Plan"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                            sub.billing_cycle === 'annual'
                                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                        }`}
                                                    >
                                                        {sub.billing_cycle || "monthly"}
                                                    </span>
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
                                                    {sub.expires_at ? (
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
                                                <td className="px-4 py-3 text-xs font-mono text-slate-500 max-w-[120px] truncate" title={sub.bank_ref}>
                                                    {sub.bank_ref || "-"}
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
                                                    <div className="flex gap-1 flex-wrap">
                                                        <button
                                                            onClick={() => openEditModal(sub)}
                                                            className="px-2.5 py-1 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 cursor-pointer"
                                                        >
                                                            UPDATE PLAN
                                                        </button>
                                                        {sub.is_active ? (
                                                            <button
                                                                onClick={() => handleTerminate(sub.id)}
                                                                className="px-2.5 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 cursor-pointer"
                                                            >
                                                                TERMINATE
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleReactivate(sub.id)}
                                                                className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-pointer"
                                                            >
                                                                REACTIVATE
                                                            </button>
                                                        )}
                                                    </div>
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

                    {/* Offline Bank Transfer & Plan Update Modal */}
                    {editModalOpen && selectedSub && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
                            <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight">
                                            Activate / Update Customer Plan
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Record bank deposit slip & sync subscription to ERP system
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setEditModalOpen(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1 cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
                                    {/* Customer Brief */}
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex justify-between">
                                        <div>
                                            <span className="font-bold text-slate-400 block text-[10px] uppercase">Business / Customer</span>
                                            <span className="font-bold text-sm text-slate-800 dark:text-white">{selectedSub.business_name || selectedSub.name}</span>
                                            <span className="text-slate-500 block">{selectedSub.email}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-slate-400 block text-[10px] uppercase">Customer ID</span>
                                            <span className="font-mono font-black text-orange-600">{selectedSub.customer_id || "-"}</span>
                                        </div>
                                    </div>

                                    {/* Plan Selector */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Package Tier
                                        </label>
                                        <select
                                            value={editPlan}
                                            onChange={(e) => handlePlanChange(e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
                                        >
                                            {packages && packages.length > 0 ? (
                                                packages.map((pkg) => (
                                                    <option key={pkg.id} value={pkg.name}>
                                                        {pkg.name} ({pkg.price > 0 ? `LKR ${Number(pkg.price).toLocaleString()}/mo` : 'Free'})
                                                    </option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="ERP Free Starter">ERP Free Starter (LKR 0)</option>
                                                    <option value="ERP Basic Essentials">ERP Basic Essentials (LKR 45,000/mo)</option>
                                                    <option value="ERP Professional Growth">ERP Professional Growth (LKR 95,000/mo)</option>
                                                    <option value="Enterprise Custom Core">Enterprise Custom Core (LKR 195,000/mo)</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    {/* Billing Cycle */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Billing Cycle
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleCycleChange("monthly")}
                                                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-colors ${
                                                    editCycle === "monthly"
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                                }`}
                                            >
                                                Monthly (30 Days)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCycleChange("annual")}
                                                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-colors ${
                                                    editCycle === "annual"
                                                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                                }`}
                                            >
                                                Annual Prepay (365 Days)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bank Transfer Reference & Amount */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                Bank Slip / Ref No
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. BOC-8923019 / Slip #491"
                                                value={editBankRef}
                                                onChange={(e) => setEditBankRef(e.target.value)}
                                                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                Amount Verified (LKR)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editAmount}
                                                onChange={(e) => setEditAmount(e.target.value)}
                                                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Expiry Date */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Subscription Expiration Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editExpiry}
                                            onChange={(e) => setEditExpiry(e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            ERP platform access will remain active until 23:59 on this date.
                                        </p>
                                    </div>

                                    {/* Dialog Footer Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setEditModalOpen(false)}
                                            className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-2 py-2.5 px-4 text-xs font-black rounded-xl bg-orange-600 hover:bg-orange-700 text-white cursor-pointer shadow-md disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Synchronizing to ERP..." : "Activate & Sync to ERP"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
