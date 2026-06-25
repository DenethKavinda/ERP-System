import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Ledger({ auth, transactions = [] }) {
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

    const [showHistory, setShowHistory] = useState(false);

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
                                        <th className="p-4 uppercase tracking-wider font-bold text-right">
                                            Amount Paid
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-inherit">
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="p-12 text-center italic text-slate-400"
                                            >
                                                No payment transaction records
                                                found for this account.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((record) => (
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
                                                    ).toLocaleString("en-US", {
                                                        hour12: true,
                                                    })}
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

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
