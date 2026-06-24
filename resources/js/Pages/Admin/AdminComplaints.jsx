// resources/js/Pages/Admin/AdminComplaints.jsx
import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

function ComplaintItem({ ticket, isDarkMode }) {
    const [showReplyBox, setShowReplyBox] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
        link_url: "",
        attachment: null,
        status: ticket.status || "open",
    });

    const handleReplySubmit = (e) => {
        e.preventDefault();
        post(`/admin/complaints/${ticket.id}/reply`, {
            onSuccess: () => {
                reset();
                setShowReplyBox(false);
            },
        });
    };

    const handleAdminDeleteComplaint = () => {
        if (
            confirm(
                "Are you absolutely sure you want to permanently delete this complaint ticket? This removes all attachments and logs globally.",
            )
        ) {
            router.delete(`/admin/complaints/${ticket.id}`);
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
            className={`p-5 rounded-xl border text-xs flex flex-col gap-4 transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-100 text-slate-900"}`}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded tracking-wider">
                            {ticket.category}
                        </span>
                        <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide border ${ticket.priority === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}
                        >
                            {ticket.priority} priority
                        </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                        {ticket.subject}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Submitted by:{" "}
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                            {ticket.user?.name}
                        </span>{" "}
                        ({ticket.user?.email})
                    </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-start shrink-0">
                    <span
                        className={`px-2.5 py-1 border text-[10px] font-black uppercase tracking-wider rounded-md ${getStatusStyle(ticket.status)}`}
                    >
                        {ticket.status}
                    </span>
                    <button
                        onClick={handleAdminDeleteComplaint}
                        className="p-1.5 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg border border-red-500/20 transition-all"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`p-4 rounded-xl border leading-relaxed text-slate-700 dark:text-slate-300 ${isDarkMode ? "bg-slate-950 border-slate-800/60" : "bg-white border-slate-200/60"}`}
            >
                {ticket.description}
            </div>

            {/* 🚀 FIXED: Displays user attachments for admins cleanly */}
            {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        User Submitted Attachments ({ticket.attachments.length}
                        ):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {ticket.attachments.map((file) => (
                            <a
                                key={file.id}
                                href={`/complaints/download/${file.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[11px] font-bold text-orange-500 hover:bg-orange-500/5 transition-all shadow-sm"
                            >
                                <span>📄 {file.original_name}</span>
                                <svg
                                    className="w-3.5 h-3.5 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {ticket.replies && ticket.replies.length > 0 && (
                <div className="space-y-2 border-t pt-4 dark:border-slate-800">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Previous Feedback History:
                    </h4>
                    <div className="space-y-2">
                        {ticket.replies.map((reply) => (
                            <div
                                key={reply.id}
                                className={`p-3 rounded-xl border text-[11px] leading-relaxed space-y-1.5 ${isDarkMode ? "bg-slate-950/60 border-slate-800/40" : "bg-white border-slate-200/50"}`}
                            >
                                <p className="text-slate-600 dark:text-slate-300">
                                    {reply.message}
                                </p>
                                <div className="flex flex-wrap gap-3 items-center text-[10px] font-bold">
                                    {reply.link_url && (
                                        <a
                                            href={reply.link_url}
                                            target="_blank"
                                            className="text-blue-500 hover:underline"
                                        >
                                            🔗 Reference Link
                                        </a>
                                    )}
                                    {reply.file_path && (
                                        <span className="text-slate-400">
                                            📥 Attachment:{" "}
                                            <span className="text-slate-600 dark:text-slate-300">
                                                {reply.file_name}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-2">
                <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white font-black text-[11px] uppercase tracking-wider rounded-xl hover:brightness-110 shadow-sm transition-all"
                >
                    {showReplyBox ? "Hide Actions Form" : "Take Action / Reply"}
                </button>
            </div>

            {showReplyBox && (
                <form
                    onSubmit={handleReplySubmit}
                    className="space-y-4 border-t pt-4 dark:border-slate-800 animate-fadeIn"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block mb-1.5 font-bold">
                                Action Message Response
                            </label>
                            <textarea
                                rows="3"
                                placeholder="State resolutions parameters..."
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded-xl dark:bg-slate-950 dark:border-slate-800 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-bold">
                                Transition State Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded-xl dark:bg-slate-950 dark:border-slate-800"
                            >
                                <option value="open">Open</option>
                                <option value="in-progress">In-Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1.5 font-bold">
                                Link (Optional)
                            </label>
                            <input
                                type="url"
                                value={data.link_url}
                                onChange={(e) =>
                                    setData("link_url", e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded-xl dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-bold">
                                Response File Document (Optional)
                            </label>
                            <input
                                type="file"
                                onChange={(e) =>
                                    setData("attachment", e.target.files[0])
                                }
                                className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:font-bold file:bg-slate-800 file:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md"
                        >
                            {processing
                                ? "Dispatching..."
                                : "Commit Action & Dispatch"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function AdminComplaints({ auth, complaints = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <div
            className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Administrative Grievance Console" />
            <Sidebar isDarkMode={isDarkMode} />
            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8 overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            Grievance Operations Dashboard
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Review user files attachments, examine error reports
                            logs, and compile solution dispatches.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="px-4 py-2 text-xs font-bold border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800"
                    >
                        {isDarkMode ? "☀️ Light Node" : "🌙 Dark Node"}
                    </button>
                </div>
                <div
                    className={`p-6 rounded-2xl border shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                >
                    <h2 className="text-base font-black tracking-tight mb-4">
                        Active User Tickets Stack Matrix ({complaints.length})
                    </h2>
                    {complaints.length === 0 ? (
                        <div className="p-16 border border-dashed rounded-xl text-center italic text-slate-400">
                            No active system grievance tickets logged.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.map((ticket) => (
                                <ComplaintItem
                                    key={ticket.id}
                                    ticket={ticket}
                                    isDarkMode={isDarkMode}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
