// resources/js/Pages/Admin/AdminComplaints.jsx
import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

function ComplaintItem({ ticket, isDarkMode }) {
    const [showReplyBox, setShowReplyBox] = useState(false);

    // Form structure handling dynamic text, files, and updates
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
        link_url: "",
        attachment: null,
        status: ticket.status || "open",
    });

    const handleReplySubmit = (e) => {
        e.preventDefault();
        // Inertia multipart submission format for uploading attachments
        post(`/admin/complaints/${ticket.id}/reply`, {
            onSuccess: () => {
                reset();
                setShowReplyBox(false);
            },
        });
    };

    return (
        <div
            className={`p-5 rounded-xl border text-xs flex flex-col gap-4 ${isDarkMode ? "bg-slate-900 border-slate-700/60" : "bg-slate-50 border-slate-100"}`}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-base text-orange-500">
                        {ticket.subject}
                    </h3>
                    <p className="opacity-80 whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
                        {ticket.description}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1">
                        User: <strong>{ticket.user?.name}</strong> (
                        {ticket.user?.email}) • Status:{" "}
                        <span className="uppercase font-black">
                            {ticket.status || "open"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={() => setShowReplyBox(!showReplyBox)}
                        className="bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {showReplyBox ? "Hide Form" : "Reply Ticket"}
                    </button>
                    <button
                        onClick={() =>
                            router.delete(`/admin/complaints/${ticket.id}`)
                        }
                        className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {/* Displaying existing reply history under the complaint */}
            {ticket.replies && ticket.replies.length > 0 && (
                <div className="pl-4 border-l-2 border-orange-500/30 space-y-2 mt-2">
                    <p className="font-bold text-[10px] text-slate-400 uppercase">
                        Dispatched Responses:
                    </p>
                    {ticket.replies.map((reply) => (
                        <div
                            key={reply.id}
                            className={`p-2.5 rounded-lg border ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
                        >
                            {reply.message && (
                                <p className="mb-1">{reply.message}</p>
                            )}
                            <div className="flex gap-3 text-[10px]">
                                {reply.link_url && (
                                    <a
                                        href={reply.link_url}
                                        target="_blank"
                                        className="text-blue-500 font-bold hover:underline"
                                    >
                                        Reference Link
                                    </a>
                                )}
                                {reply.file_path && (
                                    <a
                                        href={reply.file_path}
                                        target="_blank"
                                        className="text-orange-500 font-bold hover:underline"
                                    >
                                        Document: {reply.file_name}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Active Response Form Box */}
            {showReplyBox && (
                <form
                    onSubmit={handleReplySubmit}
                    className={`p-4 rounded-lg border mt-2 space-y-3 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
                >
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                            Response Message
                        </label>
                        <textarea
                            rows="2"
                            className={`w-full p-2.5 border rounded-lg bg-transparent text-xs ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            placeholder="Type resolution feedback..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Reference URL Link
                            </label>
                            <input
                                type="url"
                                className={`w-full p-2 border rounded-lg bg-transparent ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
                                value={data.link_url}
                                onChange={(e) =>
                                    setData("link_url", e.target.value)
                                }
                                placeholder="https://example.com/docs"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Upload File (PDF, Images, Text, ZIP)
                            </label>
                            <input
                                type="file"
                                className="w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20"
                                onChange={(e) =>
                                    setData("attachment", e.target.files[0])
                                }
                            />
                            {errors.attachment && (
                                <span className="text-red-500 text-[10px] mt-1 block">
                                    {errors.attachment}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Set Lifecycle State:
                            </label>
                            <select
                                className={`p-1.5 border rounded-md text-xs dark:bg-slate-800 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="open">Open / Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">
                                    Resolved / Closed
                                </option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-orange-500 text-white font-black px-4 py-2 rounded-lg uppercase tracking-wider"
                        >
                            Submit Response
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function AdminComplaints({
    complaints = [],
    isDarkMode = false,
}) {
    return (
        <div
            className={`flex min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Admin Complaints Center" />
            <Sidebar isDarkMode={isDarkMode} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-black tracking-tight">
                            Ecosystem Complaints Center
                        </h1>
                        <p className="text-sm text-slate-500">
                            Dispatch answers, documents, or links directly to
                            user dashboards.
                        </p>
                    </div>

                    <div
                        className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                    >
                        <h2 className="text-lg font-bold mb-4">
                            Active User Tickets ({complaints.length})
                        </h2>
                        {complaints.length === 0 ? (
                            <p className="text-sm text-slate-400 py-8 text-center italic">
                                No system tickets logged.
                            </p>
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
                </div>
            </main>
        </div>
    );
}
