import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Complain({ auth, myComplaints = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        subject: "",
        category: "System Error",
        priority: "medium",
        description: "",
        attachments: [],
    });

    // 🚀 FIXED: Trims, normalizes, and automatically drops 'resolved' tickets from the badge count instantly!
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
                        className={`border rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        <div className="border-b pb-4 mb-6 dark:border-slate-800">
                            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                Submit Operational System Grievance
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Log architecture errors, premium module issues,
                                or invoicing problems into management framework
                                tracks.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 text-xs font-medium"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block mb-1.5 font-bold">
                                        Ticket Subject Topic
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Provide brief high-level summary..."
                                        value={data.subject}
                                        onChange={(e) =>
                                            setData("subject", e.target.value)
                                        }
                                        className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 border-inherit"
                                    />
                                    {errors.subject && (
                                        <span className="text-red-500 font-bold block mt-1">
                                            {errors.subject}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1.5 font-bold">
                                        Category Sector
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                        className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 border-inherit"
                                    >
                                        <option value="System Error">
                                            System Error
                                        </option>
                                        <option value="Billing Dispute">
                                            Billing Dispute
                                        </option>
                                        <option value="Module Defect">
                                            Module Defect
                                        </option>
                                        <option value="Other">
                                            Other Category
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
                                <label className="block mb-1.5 font-bold">
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
                                            className={`py-2 border rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all ${data.priority === prio ? "bg-orange-500 text-white border-orange-500 shadow-sm" : isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            {prio}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1.5 font-bold">
                                    Comprehensive Issue Breakdown Description
                                </label>
                                <textarea
                                    rows="5"
                                    placeholder="Provide detailed error codes, trace exceptions, or background event steps context..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full px-3 py-2.5 border rounded-xl dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 border-inherit"
                                ></textarea>
                                {errors.description && (
                                    <span className="text-red-500 font-bold block mt-1">
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                            <div className="p-4 border border-dashed rounded-xl border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                <label className="block mb-2 font-bold text-slate-700 dark:text-slate-300">
                                    Upload Multiple System Documentation
                                    Documents (Images, PDF, ZIP)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-orange-500 file:text-white file:cursor-pointer hover:file:bg-orange-600"
                                />

                                {data.attachments.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                            Staged Documents Queue (
                                            {data.attachments.length}):
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {data.attachments.map(
                                                (file, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 text-[11px]"
                                                    >
                                                        <span className="truncate max-w-[220px] font-medium text-slate-700 dark:text-slate-300">
                                                            📄 {file.name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFileFromQueue(
                                                                    idx,
                                                                )
                                                            }
                                                            className="text-red-500 font-black hover:text-red-700 px-1.5 text-xs"
                                                        >
                                                            ✕
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
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="absolute inset-0"
                        onClick={() => setShowHistory(false)}
                    />

                    <div
                        className={`w-full max-w-2xl h-full shadow-2xl relative z-10 flex flex-col justify-between p-6 overflow-y-auto ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-wider text-orange-500">
                                        Your Ticket History logs
                                    </h2>
                                    <p className="text-[11px] opacity-60">
                                        Scan administrative feedback notes and
                                        operation statuses
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Close ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                {myComplaints.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-8 text-center italic">
                                        No system tickets logged yet.
                                    </p>
                                ) : (
                                    myComplaints.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className={`p-4 border rounded-xl space-y-3 text-xs ${isDarkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <span className="text-[9px] font-black uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded tracking-wider">
                                                        {ticket.category}
                                                    </span>
                                                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
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
                                                        className="text-[10px] font-bold text-red-500 hover:underline px-1 py-0.5"
                                                    >
                                                        Remove Ticket ✕
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="opacity-80 leading-relaxed text-slate-700 dark:text-slate-300">
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
                                                                    📄{" "}
                                                                    {
                                                                        file.original_name
                                                                    }
                                                                </a>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                            {ticket.replies &&
                                                ticket.replies.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t dark:border-slate-800 space-y-2">
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
                                                                        className="p-3 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800/60 text-[11px] space-y-1.5"
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
                                                                                    className="text-blue-500 hover:underline font-bold"
                                                                                >
                                                                                    🔗
                                                                                    System
                                                                                    Navigation
                                                                                    Link
                                                                                </a>
                                                                            )}

                                                                            {/* 🚀 FIXED: Pointed cleanly to shared routing endpoint stream to eliminate 403 downloads error */}
                                                                            {reply.file_path && (
                                                                                <a
                                                                                    href={`/complaints/reply-download/${reply.id}`}
                                                                                    className="text-orange-500 hover:underline font-bold flex items-center gap-1"
                                                                                >
                                                                                    📥
                                                                                    Download
                                                                                    Admin
                                                                                    Document:{" "}
                                                                                    <span className="underline italic font-medium">
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
