import { Head, Link } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";

export default function AdminDashboard({ auth, metrics = {}, recentSubscribers = [] }) {
    const isDarkMode = document.documentElement.classList.contains("dark");

    const statCards = [
        {
            label: "Total Customers",
            value: metrics.totalCustomers || 0,
            sub: "Registered business accounts",
            color: "text-slate-800 dark:text-white",
            border: "border-slate-200 dark:border-slate-800",
            bg: "bg-white dark:bg-slate-900",
            link: "/admin/subscribers",
        },
        {
            label: "Active Subscriptions",
            value: metrics.activeCount || 0,
            sub: "Currently in good standing",
            color: "text-emerald-600 dark:text-emerald-400",
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/5 dark:bg-emerald-950/20",
            link: "/admin/subscribers",
        },
        {
            label: "Expired / Suspended",
            value: metrics.expiredCount || 0,
            sub: "Access locked - needs renewal",
            color: "text-red-600 dark:text-red-400",
            border: "border-red-500/20",
            bg: "bg-red-500/5 dark:bg-red-950/20",
            link: "/admin/subscribers",
        },
        {
            label: "Published ERP Tiers",
            value: metrics.packagesCount || 0,
            sub: "Live packages on pricing portal",
            color: "text-orange-600 dark:text-orange-400",
            border: "border-orange-500/20",
            bg: "bg-orange-500/5 dark:bg-orange-950/20",
            link: "/admin/erp-packages",
        },
    ];

    const shortcuts = [
        {
            title: "Customer Subscriptions",
            desc: "Manage customer subscriptions, change plans, extend expiration dates, and terminate or reactivate tenant access.",
            path: "/admin/subscribers",
            badge: `${metrics.totalCustomers || 0} Accounts`,
            badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            btnText: "Manage Subscribers",
            icon: (
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            title: "ERP Packages Management",
            desc: "Edit tier monthly/annual pricing, configure hard branch/warehouse limits, user quotas, and capability matrices.",
            path: "/admin/erp-packages",
            badge: `${metrics.packagesCount || 0} Tiers`,
            badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
            btnText: "Configure Packages",
            icon: (
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            title: "Financial Ledger & Transactions",
            desc: "Inspect customer orders, verify invoice IDs, track subscription settlement dates, and export logs to Excel/CSV.",
            path: "/admin/transactions",
            badge: "Audit Ledger",
            badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            btnText: "View Transactions",
            icon: (
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: "Success Stories & Testimonials",
            desc: "Curate social proof, approve customer testimonials, review company ratings, and manage public case studies.",
            path: "/admin/success-stories",
            badge: "Social Proof",
            badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
            btnText: "Manage Stories",
            icon: (
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
        },
        {
            title: "Live Pricing Portal",
            desc: "Preview the customer-facing package pricing page with monthly/annual toggle and WhatsApp purchase routing.",
            path: "/ERP",
            badge: "Storefront",
            badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
            btnText: "Open Pricing Page",
            icon: (
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            ),
        },
        {
            title: "Customer Dashboard Preview",
            desc: "View the customer portal as an authenticated client with live quota meters and ERP system launch buttons.",
            path: "/dashboard-user",
            badge: "Customer Portal",
            badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
            btnText: "Preview Portal",
            icon: (
                <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <Head title="Super Admin Dashboard" />
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
                <Sidebar auth={auth} />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                    Super Admin Control
                                </span>
                                <span className="text-xs text-slate-400">v1.0</span>
                            </div>
                            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                Operations Command Center
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Executive metrics, client subscription management, and direct operations shortcuts
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/subscribers"
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Manage Subscribers</span>
                            </Link>
                        </div>
                    </div>

                    {/* Top KPI Metrics Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((stat, idx) => (
                            <Link
                                key={idx}
                                href={stat.link}
                                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-md ${stat.bg} ${stat.border}`}
                            >
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                                    {stat.label}
                                </div>
                                <div className={`text-3xl font-black tracking-tight ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 font-medium">
                                    {stat.sub}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Operational Shortcuts Grid */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className={`text-base font-black uppercase tracking-wider ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    Operations Shortcuts
                                </h2>
                                <p className="text-xs text-slate-400">Quick access to all essential administration panels</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {shortcuts.map((sc, idx) => (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                                            : "bg-white border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <div className={`p-3 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                                                {sc.icon}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${sc.badgeColor}`}>
                                                {sc.badge}
                                            </span>
                                        </div>
                                        <h3 className={`text-sm font-black tracking-tight mb-1.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                            {sc.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                            {sc.desc}
                                        </p>
                                    </div>

                                    <Link
                                        href={sc.path}
                                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                            isDarkMode
                                                ? "bg-slate-800 hover:bg-slate-700 text-white"
                                                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                                        }`}
                                    >
                                        <span>{sc.btnText}</span>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Customer Registrations Preview */}
                    <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    Recent Client Registrations
                                </h3>
                                <p className="text-xs text-slate-400">Latest business accounts onboarded to the platform</p>
                            </div>
                            <Link
                                href="/admin/subscribers"
                                className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <span>View All Subscribers</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "bg-slate-800/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                                        <th className="text-left px-6 py-3">Customer ID</th>
                                        <th className="text-left px-6 py-3">Business / Name</th>
                                        <th className="text-left px-6 py-3">Email</th>
                                        <th className="text-left px-6 py-3">Plan</th>
                                        <th className="text-left px-6 py-3">Status</th>
                                        <th className="text-right px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentSubscribers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-xs">
                                                No customer registrations found
                                            </td>
                                        </tr>
                                    ) : (
                                        recentSubscribers.map((sub) => (
                                            <tr key={sub.id} className={`transition-colors ${isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                                                <td className="px-6 py-3 font-mono font-bold text-orange-600 text-xs">
                                                    {sub.customer_id || "-"}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className={`font-bold text-xs ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                                        {sub.business_name || "-"}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">{sub.name}</div>
                                                </td>
                                                <td className="px-6 py-3 text-xs text-slate-500">
                                                    {sub.email}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                        {sub.plan_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        sub.is_active
                                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sub.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                                                        {sub.is_active ? "ACTIVE" : "EXPIRED"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <Link
                                                        href="/admin/subscribers"
                                                        className="px-2.5 py-1 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                                                    >
                                                        MANAGE
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
