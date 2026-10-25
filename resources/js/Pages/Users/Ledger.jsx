import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Ledger({ auth, transactions = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    const [showHistory, setShowHistory] = useState(false);

    // Calculate time left and check eligibility for renewal (<= 5 days or expired)
    const getExpirationStatus = (expiresAt) => {
        if (!expiresAt) {
            return {
                text: "Lifetime Access",
                className: "text-slate-400 font-normal italic",
                canRenew: false,
            };
        }

        const expiryDate = new Date(expiresAt);
        const now = new Date();
        const diffTime = expiryDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            return {
                text: "Expired",
                className:
                    "text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20",
                canRenew: true,
            };
        }
        if (diffDays <= 5) {
            return {
                text: `${diffDays} days left`,
                className:
                    "text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 animate-pulse",
                canRenew: true,
            };
        }
        return {
            text: `${diffDays} days left`,
            className:
                "text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20",
            canRenew: false,
        };
    };

    // Redirect to Dashboard with package name as a parameter
    const handleRenewPackage = (packageName) => {
        if (
            confirm(
                `Would you like to renew your subscription for the ${packageName} package?`,
            )
        ) {
            router.get(`/dashboard?renew=${encodeURIComponent(packageName)}`);
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Transactional Ledger Proofs" />

            <div>
                <Header
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    auth={auth}
                />

                <main className="max-w-6xl mx-auto p-4 md:p-8 mt-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-black tracking-tight">
                            Transactional Ledger
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Access audited gateway payments records, verify
                            unique order reference keys, and review cleared
                            transactions.
                        </p>
                    </div>

                    <div
                        className={`border rounded-2xl overflow-hidden shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        <div className="p-5 border-b border-inherit font-bold text-sm">
                            Payment History Logs
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs font-medium">
                                <thead>
                                    <tr
                                        className={
                                            isDarkMode
                                                ? "bg-slate-950/50 text-slate-400"
                                                : "bg-slate-50 text-slate-500"
                                        }
                                    >
                                        <th className="p-4 uppercase tracking-wider font-bold">
                                            Order Reference ID
                                        </th>
                                        <th className="p-4 uppercase tracking-wider font-bold">
                                            Item Description
                                        </th>
                                        <th className="p-4 uppercase tracking-wider font-bold">
                                            Settlement Date
                                        </th>
                                        <th className="p-4 uppercase tracking-wider font-bold">
                                            Status / Expiration
                                        </th>
                                        <th className="p-4 uppercase tracking-wider font-bold text-right">
                                            Amount Paid
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-inherit">
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-12 text-center italic text-slate-400"
                                            >
                                                No payment transaction records
                                                found for this account.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((record) => {
                                            const status = getExpirationStatus(
                                                record.expires_at,
                                            );
                                            return (
                                                <tr
                                                    key={record.id}
                                                    className={
                                                        isDarkMode
                                                            ? "hover:bg-slate-950/20"
                                                            : "hover:bg-slate-50/60"
                                                    }
                                                >
                                                    <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                        {record.order_id}
                                                    </td>
                                                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                                        {record.package_name}
                                                    </td>
                                                    <td className="p-4 text-slate-500">
                                                        {new Date(
                                                            record.updated_at,
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                hour12: true,
                                                            },
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                            <span
                                                                className={`inline-block text-[10px] uppercase tracking-wide text-center sm:text-left ${status.className}`}
                                                            >
                                                                {status.text}
                                                            </span>

                                                            {record.order_id && (
                                                                <a
                                                                    href={`/checkout/receipt/download?order_id=${record.order_id}&package_name=${encodeURIComponent(record.package_name)}&total_amount=${record.amount}`}
                                                                    className="px-2 py-0.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wide rounded-md transition-colors"
                                                                >
                                                                    Receipt PDF
                                                                </a>
                                                            )}

                                                            {status.canRenew && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleRenewPackage(
                                                                            record.package_name,
                                                                        )
                                                                    }
                                                                    className="px-2 py-0.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] uppercase tracking-wide rounded-md transition-colors shadow-xs"
                                                                >
                                                                    Renew Plan
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right font-black text-sm text-slate-900 dark:text-white">
                                                        {record.currency}{" "}
                                                        {Number(
                                                            record.amount,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
