import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Complain({ auth, myComplaints = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    const [showHistory, setShowHistory] = useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        subject: "",
        category: "System Error",
        priority: "medium",
        description: "",
        attachments: [],
    });

    // FIXED: Trims, normalizes, and automatically drops 'resolved' tickets from the badge count instantly!
    const activeNotificationCount = myComplaints.filter(
        (ticket) =>
            ticket.status &&
            ticket.status.trim().toLowerCase() !== "resolved" &&
            ticket.status.trim().toLowerCase() !== "closed",
    ).length;

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setData("attachments", [...data.attachments, ...selectedFiles]);
    };

    const removeFileFromQueue = (indexToRemove) => {
        setData(
            "attachments",
            data.attachments.filter((_, idx) => idx !== indexToRemove),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/complaints", {
            onSuccess: () => reset(),
        });
    };

    const handleUserDeleteComplaint = (ticketId) => {
        if (
            confirm(
                "Are you sure you want to permanently delete this complaint ticket and all its attached records?",
            )
        ) {
            router.delete(`/complaints/user-remove/${ticketId}`);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()?.trim()) {
            case "resolved":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "in-progress":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default:
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
    };

    return (
        <div
            className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Grievance Ticketing Workspace" />

            <div>
                <Header
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    auth={auth}
                />

                <div className="max-w-4xl mx-auto p-4 md:p-8 mt-4 relative">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setShowHistory(true)}
                            className="relative px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Ticket History</span>
                            {activeNotificationCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                                    {activeNotificationCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div
                        className={`border rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800/80 shadow-xl/50" : "bg-white border-slate-200"}`}
                    >
                        <div className="border-b pb-4 mb-6 border-slate-200 dark:border-slate-800">
                            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                                Submit Support Ticket or Grievance
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Report POS hardware issues, billing inquiries, stock discrepancies, or request technical assistance.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 text-xs font-medium"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-300">
                                        Ticket Subject Topic
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Provide brief summary of the issue..."
                                        value={data.subject}
                                        onChange={(e) =>
                                            setData("subject", e.target.value)
                                        }
                                        className="w-full px-3 py-2.5 border rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                    {errors.subject && (
                                        <span className="text-red-500 font-bold block mt-1">
                                            {errors.subject}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-300">
                                        Category Sector
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                        className="w-full px-3 py-2.5 border rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                                    >
                                        <option value="POS Billing & Printing">
                                            POS Billing & Printing
                                        </option>
                                        <option value="Barcode & Scanner Hardware">
                                            Barcode & Scanner Hardware
                                        </option>
                                        <option value="Stock & Warehouse Discrepancy">
                                            Stock & Warehouse Discrepancy
                                        </option>
                                        <option value="Customer Credit & Ledger">
                                            Customer Credit & Ledger
                                        </option>
                                        <option value="Billing & Subscription Plan">
                                            Billing & Subscription Plan
                                        </option>
                                        <option value="System Error & Bug">
                                            System Error & Bug
                                        </option>
                                        <option value="General Inquiry">
                                            General Inquiry
                                        </option>
                                    </select>
                                    {errors.category && (
                                        <span className="text-red-500 font-bold block mt-1">
                                            {errors.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-300">
                                    Issue Priority
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["low", "medium", "high"].map((prio) => (
                                        <button
                                            key={prio}
                                            type="button"
                                            onClick={() =>
                                                setData("priority", prio)
                                            }
                                            className={`py-2.5 border rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all ${data.priority === prio ? "bg-orange-500 text-white border-orange-500 shadow-sm" : isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            {prio}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-300">
                                    Comprehensive Issue Breakdown Description
                                </label>
                                <textarea
                                    rows="5"
                                    placeholder="Provide detailed error codes, trace exceptions, or background event steps context..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full px-3 py-2.5 border rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                ></textarea>
                                {errors.description && (
                                    <span className="text-red-500 font-bold block mt-1">
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                            <div className="p-4 border border-dashed rounded-xl border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                                <label className="block mb-2 font-bold text-slate-700 dark:text-slate-300">
                                    Upload Multiple System Documentation
                                    Documents (Images, PDF, ZIP)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-orange-500 file:text-white file:cursor-pointer hover:file:bg-orange-600"
                                />

                                {data.attachments.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
                                            Staged Documents Queue (
                                            {data.attachments.length}):
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {data.attachments.map(
                                                (file, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]"
                                                    >
                                                        <span className="truncate max-w-[220px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                            </svg>
                                                            <span className="truncate">{file.name}</span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFileFromQueue(
                                                                    idx,
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors"
                                                            title="Remove file"
                                                        >
                                                            <svg
                                                                className="w-3.5 h-3.5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={2.5}
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                                >
                                    {processing
                                        ? "Dispatching..."
                                        : "Dispatch Grievance Ticket"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ==================== SLIDE HISTORY DRAWER PANELS ==================== */}
            {showHistory && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
                    <div
                        className="absolute inset-0"
                        onClick={() => setShowHistory(false)}
                    />

                    <div
                        className={`w-full max-w-2xl h-full shadow-2xl relative z-10 flex flex-col justify-between p-6 overflow-y-auto ${isDarkMode ? "bg-slate-900 text-slate-100 border-l border-slate-800" : "bg-white text-slate-900"}`}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-wider text-orange-500">
                                        Your Ticket History logs
                                    </h2>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 opacity-80">
                                        Scan administrative feedback notes and
                                        operation statuses
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                                >
                                    <span>Close</span>
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {myComplaints.length === 0 ? (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 py-8 text-center italic">
                                        No system tickets logged yet.
                                    </p>
                                ) : (
                                    myComplaints.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className={`p-4 border rounded-xl space-y-3 text-xs ${isDarkMode ? "bg-slate-950/50 border-slate-800/80" : "bg-slate-50 border-slate-100"}`}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <span className="text-[9px] font-black uppercase bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded tracking-wider">
                                                        {ticket.category}
                                                    </span>
                                                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1">
                                                        {ticket.subject}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-col items-end gap-2 shrink-0">
                                                    <span
                                                        className={`px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider rounded-md ${getStatusStyle(ticket.status)}`}
                                                    >
                                                        {ticket.status}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleUserDeleteComplaint(
                                                                ticket.id,
                                                            )
                                                        }
                                                        className="text-[10px] font-bold text-red-500 dark:text-red-400 hover:underline px-1 py-0.5 flex items-center gap-1"
                                                    >
                                                        <span>Remove Ticket</span>
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2.2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="opacity-90 leading-relaxed text-slate-700 dark:text-slate-300">
                                                {ticket.description}
                                            </p>

                                            {ticket.attachments &&
                                                ticket.attachments.length >
                                                    0 && (
                                                    <div className="pt-2 flex flex-wrap gap-2">
                                                        {ticket.attachments.map(
                                                            (file) => (
                                                                <a
                                                                    key={
                                                                        file.id
                                                                    }
                                                                    href={`/complaints/download/${file.id}`}
                                                                    className="inline-flex items-center gap-1.5 px-2 py-1 border rounded bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[10px] font-bold text-orange-500 hover:underline"
                                                                >
                                                                    <svg
                                                                        className="w-3 h-3 text-orange-500 shrink-0"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                                        />
                                                                    </svg>
                                                                    <span>
                                                                        {
                                                                            file.original_name
                                                                        }
                                                                    </span>
                                                                </a>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                            {ticket.replies &&
                                                ticket.replies.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                                                        <h4 className="text-[10px] font-black uppercase text-orange-500 tracking-wider">
                                                            Management Feedback
                                                            Notes:
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {ticket.replies.map(
                                                                (reply) => (
                                                                    <div
                                                                        key={
                                                                            reply.id
                                                                        }
                                                                        className="p-3 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/60 text-[11px] space-y-1.5"
                                                                    >
                                                                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                                                                            {
                                                                                reply.message
                                                                            }
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-3 items-center text-[10px]">
                                                                            {reply.link_url && (
                                                                                <a
                                                                                    href={
                                                                                        reply.link_url
                                                                                    }
                                                                                    target="_blank"
                                                                                    className="text-blue-500 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1"
                                                                                >
                                                                                    <svg
                                                                                        className="w-3 h-3 shrink-0"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth={2}
                                                                                    >
                                                                                        <path
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                                                                        />
                                                                                    </svg>
                                                                                    <span>System Navigation Link</span>
                                                                                </a>
                                                                            )}

                                                                            {/* FIXED: Pointed cleanly to shared routing endpoint stream to eliminate 403 downloads error */}
                                                                            {reply.file_path && (
                                                                                <a
                                                                                    href={`/complaints/reply-download/${reply.id}`}
                                                                                    className="text-orange-500 hover:underline font-bold flex items-center gap-1.5"
                                                                                >
                                                                                    <svg
                                                                                        className="w-3.5 h-3.5 shrink-0"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth={2}
                                                                                    >
                                                                                        <path
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                                                                        />
                                                                                    </svg>
                                                                                    <span>Download Admin Document:</span>
                                                                                    <span className="underline italic font-medium text-slate-600 dark:text-slate-400">
                                                                                        {
                                                                                            reply.file_name
                                                                                        }
                                                                                    </span>
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
