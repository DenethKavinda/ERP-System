import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Complain({ auth, myComplaints = [] }) {
    // Local theme fallback handler state configuration
    const [isDarkMode, setIsDarkMode] = useState(false);
    // State to toggle the history tracking slide panel view
    const [showHistory, setShowHistory] = useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        subject: "",
        category: "System Error",
        priority: "medium",
        description: "",
    });

    // Exclude 'resolved' tickets from increasing the active pending count badge
    const activeNotificationCount = myComplaints.filter(
        (ticket) => ticket.status?.toLowerCase() !== "resolved",
    ).length;

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/complaints", {
            onSuccess: () => reset(),
        });
    };

    // Helper to render dynamic custom contextual styling for status loop states
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "resolved":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "in-progress":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default: // open / pending
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
    };

    return (
        <div
            className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Submit Complaint Ticket" />

            {/* Shared Application Context Top Navbar Header Component */}
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

            {/* Main Application Inner Grid Area Panel Wrapper */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
                <div className="max-w-3xl mx-auto my-6">
                    {/* Workspace Top Description Header Layout with action panels */}
                    <div className="mb-8 flex justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">
                                Support Ticket Registry
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Encountering issues within your instance layout?
                                Lodge an official engineering request track
                                below.
                            </p>
                        </div>

                        {/* Upper Top Right Context Notification Ticket History Slide Menu Button */}
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2.5 rounded-xl border relative transition-all flex items-center gap-2 group ${
                                isDarkMode
                                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                            title="View My Submitted Complaints"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span className="text-xs font-bold tracking-wide uppercase pr-1 hidden sm:inline">
                                My Tickets
                            </span>

                            {/* Dynamic alert pulsing badge counting structural updates */}
                            {activeNotificationCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-orange-500 rounded-full text-[10px] font-black text-white flex items-center justify-center animate-pulse">
                                    {activeNotificationCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Complaint Form Layout Card Framework Block Panel */}
                        <div
                            className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        >
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 text-xs"
                            >
                                {/* Subject Title Input Field */}
                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Issue Subject Title
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700 text-white" : "border-slate-200"}`}
                                        value={data.subject}
                                        onChange={(e) =>
                                            setData("subject", e.target.value)
                                        }
                                        placeholder="e.g., Inventory sync payload connection failure"
                                    />
                                    {errors.subject && (
                                        <span className="text-red-500 mt-1 block">
                                            {errors.subject}
                                        </span>
                                    )}
                                </div>

                                {/* Dynamic Selection Matrices Grid Area Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Category Select Node */}
                                    <div>
                                        <label className="block font-bold uppercase text-slate-400 mb-1">
                                            Classification Category
                                        </label>
                                        <select
                                            className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 dark:bg-slate-800 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                            value={data.category}
                                            onChange={(e) =>
                                                setData(
                                                    "category",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="System Error">
                                                System Error / Bug
                                            </option>
                                            <option value="Billing Issue">
                                                Billing & Invoicing
                                            </option>
                                            <option value="ERP Core Package">
                                                ERP Package Configurations
                                            </option>
                                            <option value="Access Permission">
                                                Account & Authentication Access
                                            </option>
                                            <option value="Other">
                                                Other / General Inquiry
                                            </option>
                                        </select>
                                    </div>

                                    {/* Severity Priority Level Choice Block Option */}
                                    <div>
                                        <label className="block font-bold uppercase text-slate-400 mb-1">
                                            Severity Priority Level
                                        </label>
                                        <select
                                            className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 dark:bg-slate-800 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                            value={data.priority}
                                            onChange={(e) =>
                                                setData(
                                                    "priority",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="low">
                                                Low - General Question
                                            </option>
                                            <option value="medium">
                                                Medium - Operational Bug
                                            </option>
                                            <option value="high">
                                                High - Business Impairment
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* Deep Functional Context Textarea Field Element Description Node */}
                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Functional Abstract Logs / Context
                                    </label>
                                    <textarea
                                        rows="5"
                                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700 text-white" : "border-slate-200"}`}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Provide deep structural descriptions regarding parameters or actions that threw the runtime discrepancies..."
                                    />
                                    {errors.description && (
                                        <span className="text-red-500 mt-1 block">
                                            {errors.description}
                                        </span>
                                    )}
                                </div>

                                {/* Form Fire Ingestion Action Engine Trigger Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                                >
                                    Dispatch Issue Ticket to Engineering Group
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* SLIDE-OUT OVERLAY CANVAS RIGHT HAND DRAWER: Displays submitted complaint logging tracks */}
                {showHistory && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
                        {/* Outside Backdrop click closes panel view overlay layout */}
                        <div
                            className="flex-1"
                            onClick={() => setShowHistory(false)}
                        />

                        <div
                            className={`w-full max-w-md h-full p-6 shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0 ${
                                isDarkMode
                                    ? "bg-slate-950 border-l border-slate-800 text-white"
                                    : "bg-white border-l border-slate-200 text-slate-900"
                            }`}
                        >
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-wide">
                                        My Ticket Log History
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        Track current system evaluation reviews
                                        and progress states.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-black uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {/* Scrolling Loop List of Personal Historical Log Items */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                {myComplaints.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic text-center py-12">
                                        You have not submitted any complaint
                                        tickets yet.
                                    </p>
                                ) : (
                                    myComplaints.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className={`p-4 rounded-xl border text-xs flex flex-col gap-2.5 transition-all duration-200 ${
                                                isDarkMode
                                                    ? "bg-slate-900/50 border-slate-800/80"
                                                    : "bg-slate-50 border-slate-100"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-sm leading-tight text-orange-500 flex-1">
                                                    {ticket.subject}
                                                </h3>
                                                {/* Core Status Lifecycle Badge Display Component Element Container */}
                                                <span
                                                    className={`px-2 py-0.5 rounded-full border font-bold uppercase text-[9px] tracking-wider whitespace-nowrap ${getStatusStyle(ticket.status || "open")}`}
                                                >
                                                    {ticket.status || "pending"}
                                                </span>
                                            </div>
                                            <p className="opacity-70 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                                                {ticket.description}
                                            </p>

                                            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] text-slate-400">
                                                <span>
                                                    Category:{" "}
                                                    <strong className="text-slate-500 dark:text-slate-300">
                                                        {ticket.category}
                                                    </strong>
                                                </span>
                                                <span>
                                                    {new Date(
                                                        ticket.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* NESTED RESPONSE DISPLAY AREA: Mapping inbound engineering replies */}
                                            {ticket.replies &&
                                                ticket.replies.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700/80 space-y-2.5">
                                                        <h4 className="font-bold text-[9px] text-blue-500 uppercase tracking-widest flex items-center gap-1">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                            Engineering Support
                                                            Response:
                                                        </h4>
                                                        {ticket.replies.map(
                                                            (reply) => (
                                                                <div
                                                                    key={
                                                                        reply.id
                                                                    }
                                                                    className={`p-3 rounded-lg border text-[11px] leading-relaxed flex flex-col gap-2 shadow-xs ${
                                                                        isDarkMode
                                                                            ? "bg-slate-950 border-slate-800/60 text-slate-300"
                                                                            : "bg-white border-slate-200/80 text-slate-800"
                                                                    }`}
                                                                >
                                                                    {reply.message && (
                                                                        <p className="whitespace-pre-wrap">
                                                                            {
                                                                                reply.message
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    {/* Context attachments row flex panel wrappers elements */}
                                                                    <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-900/60 text-[10px]">
                                                                        {reply.link_url && (
                                                                            <a
                                                                                href={
                                                                                    reply.link_url
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-500 hover:text-blue-600 font-bold hover:underline flex items-center gap-1"
                                                                            >
                                                                                🔗
                                                                                Reference
                                                                                Web
                                                                                Link
                                                                            </a>
                                                                        )}
                                                                        {/* File download element explicitly routed through forced controller stream wrapper */}
                                                                        {reply.file_path && (
                                                                            <a
                                                                                href={`/complaints/download/${reply.id}`}
                                                                                className="text-orange-500 hover:text-orange-600 font-bold hover:underline flex items-center gap-1"
                                                                                title="Click to download secure file stream attachment directly to device storage"
                                                                            >
                                                                                📂
                                                                                Download:{" "}
                                                                                <span className="underline italic font-medium opacity-90 max-w-[140px] truncate">
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
                                                )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Embedded Shared Application Control Component Footer Node */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
