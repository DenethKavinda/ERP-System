import React from "react";
import Sidebar from "../../Components/Sidebar"; // Adjust this relative import path to match your project layouts

export default function AdminSuccessStories({ feedbacks, isDarkMode }) {
    return (
        <div
            className={`flex min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}
        >
            {/* System Sidebar Injection Control */}
            <Sidebar isDarkMode={isDarkMode} />

            {/* Central Workarea Dashboard Matrix Panel */}
            <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">
                        Success Stories Administration
                    </h1>
                    <p
                        className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                        Review and evaluate client experience feedback
                        submissions across ERP modules.
                    </p>
                </div>

                {/* Main Data Feed Area */}
                {feedbacks.length === 0 ? (
                    <div
                        className={`p-12 text-center rounded-xl border border-dashed ${isDarkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}
                    >
                        No user feedback reports logged in database records yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {feedbacks.map((item) => (
                            <div
                                key={item.id}
                                className={`p-6 rounded-xl border shadow-sm transition-all flex flex-col md:flex-row justify-between gap-4 ${
                                    isDarkMode
                                        ? "bg-slate-900 border-slate-800"
                                        : "bg-white border-slate-200"
                                }`}
                            >
                                <div className="space-y-3 max-w-3xl">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                            {item.item_type}
                                        </span>
                                        <h3 className="font-bold text-sm tracking-wide">
                                            {item.item_name}
                                        </h3>

                                        {/* Star Score Block */}
                                        <div className="flex gap-0.5 text-amber-400 fill-amber-400">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < item.rating ? "text-amber-400 fill-amber-400" : isDarkMode ? "text-slate-800" : "text-slate-200"}`}
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <p
                                        className={`text-xs leading-relaxed italic ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                                    >
                                        "{item.feedback}"
                                    </p>
                                </div>

                                {/* User Meta Card */}
                                <div
                                    className={`md:text-right border-t md:border-t-0 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center gap-0.5 text-xs ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
                                >
                                    <span className="font-bold tracking-wide">
                                        {item.user?.name || "Unknown Identity"}
                                    </span>
                                    <span className="text-[11px] opacity-60 font-mono">
                                        {item.user?.email || "N/A"}
                                    </span>
                                    <span className="text-[10px] opacity-40 mt-2">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString(undefined, {
                                            dateStyle: "medium",
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
