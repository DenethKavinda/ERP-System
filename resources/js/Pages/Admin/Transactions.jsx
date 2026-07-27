import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function Transactions({ auth, payments = [] }) {
    // Persistent theme initialization syncing localStorage securely across browser modes
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return (
                localStorage.getItem("theme") === "dark" ||
                (!localStorage.getItem("theme") &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
            );
        }
        return false;
    });

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // Helper function to calculate 30 days expiry date
    const getExpirationDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        date.setDate(date.getDate() + 30);
        return date.toLocaleString("en-US", { hour12: true });
    };

    // Filter payments tracking values against ID, Name, Business Name, or Email attributes
    const filteredPayments = payments.filter((pay) => {
        const query = searchQuery.toLowerCase();
        return (
            pay.order_id?.toLowerCase().includes(query) ||
            pay.user?.name?.toLowerCase().includes(query) ||
            pay.user?.business_name?.toLowerCase().includes(query) ||
            pay.user?.email?.toLowerCase().includes(query)
        );
    });

    // Trigger Excel/CSV export containing all visible data including calculated Expire Date
    const handleExportExcel = () => {
        const headers = [
            "Transaction ID",
            "User Identity",
            "Business Name",
            "User Email",
            "Reference Items",
            "Settlement Date",
            "Expire Date",
            "Amount Paid",
        ];

        const rows = filteredPayments.map((record) => {
            const settlementDate = record.updated_at
                ? new Date(record.updated_at).toLocaleString("en-US", {
                      hour12: true,
                  })
                : "N/A";
            const expireDate = getExpirationDate(record.updated_at);
            const amount =
                `${record.currency || ""} ${Number(record.amount || 0).toFixed(2)}`.trim();

            return [
                `"${record.order_id || ""}"`,
                `"${record.user?.name || "Guest User"}"`,
                `"${record.user?.business_name || "N/A"}"`,
                `"${record.user?.email || "customer@email.com"}"`,
                `"${record.package_name || ""}"`,
                `"${settlementDate}"`,
                `"${expireDate}"`,
                `"${amount}"`,
            ];
        });

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="System Transactions Management Console" />

            {/* Admin Side Navigation Panel */}
            <Sidebar isDarkMode={isDarkMode} />

            {/* Main Interface Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Upper Interface Status Alignment Header */}
                <header
                    className={`h-16 px-6 border-b flex items-center justify-between transition-colors ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
                >
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Filter by ID, name, business, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-xs px-3 py-2 border rounded-xl w-64 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-transparent transition-colors border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        />

                        {/* 📊 EXCEL EXPORT ACTION BUTTON */}
                        <button
                            onClick={handleExportExcel}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <span>📥 Export Excel Data</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-lg border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>
                </header>

                {/* Dashboard Core Body Container */}
                <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                Global Payment Operations Ledger
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Monitor enterprise user invoice configurations,
                                audit currency logs parameters, and track
                                package expiration.
                            </p>
                        </div>
                    </div>

                    {/* Data Matrix Audit Grid Container */}
                    <div
                        className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800/80 shadow-xl/50" : "bg-white border-slate-200"}`}
                    >
                        <div className="p-4 border-b flex items-center justify-between font-bold text-xs uppercase tracking-wider border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
                            <span>System Financial Audits Log</span>
                            {searchQuery && (
                                <span className="text-[10px] text-orange-500 font-mono normal-case normal-letter-spacing font-semibold">
                                    Filtered Mode Active: (
                                    {filteredPayments.length} records matching)
                                </span>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs font-medium">
                                <thead>
                                    <tr
                                        className={`border-b border-inherit uppercase tracking-wider text-[10px] font-bold ${isDarkMode ? "bg-slate-950/40 text-slate-400" : "bg-slate-50 text-slate-500"}`}
                                    >
                                        <th className="p-4">Transaction ID</th>
                                        <th className="p-4">User Identity</th>
                                        <th className="p-4">Business Name</th>
                                        <th className="p-4">User Email</th>
                                        <th className="p-4">Reference Items</th>
                                        <th className="p-4">Settlement Date</th>
                                        <th className="p-4">Expire Date</th>
                                        <th className="p-4 text-right">
                                            Amount Paid
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {filteredPayments.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="p-12 text-center italic text-slate-400 dark:text-slate-500"
                                            >
                                                No payment records matched your
                                                parameters inside the server
                                                logs.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPayments.map((record) => (
                                            <tr
                                                key={record.id}
                                                className={
                                                    isDarkMode
                                                        ? "hover:bg-slate-950/20"
                                                        : "hover:bg-slate-50/60"
                                                }
                                            >
                                                <td className="p-4 font-mono font-bold text-orange-500 select-all">
                                                    {record.order_id}
                                                </td>
                                                <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                                                    {record.user?.name ||
                                                        "Guest User"}
                                                </td>
                                                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                                                    {record.user
                                                        ?.business_name ||
                                                        "N/A"}
                                                </td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                                                    {record.user?.email ||
                                                        "customer@email.com"}
                                                </td>
                                                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                                                    {record.package_name}
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                                    {record.updated_at
                                                        ? new Date(
                                                              record.updated_at,
                                                          ).toLocaleString(
                                                              "en-US",
                                                              { hour12: true },
                                                          )
                                                        : "N/A"}
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                                    {getExpirationDate(
                                                        record.updated_at,
                                                    )}
                                                </td>
                                                <td className="p-4 text-right font-black text-sm text-slate-900 dark:text-white">
                                                    {record.currency}{" "}
                                                    {Number(
                                                        record.amount,
                                                    ).toFixed(2)}
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
        </div>
    );
}
