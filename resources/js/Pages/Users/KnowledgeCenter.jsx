import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function KnowledgeCenter({ documentation = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    const [showHistory, setShowHistory] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeDocument, setActiveDocument] = useState(null);

    const docCategories = Array.from(
        new Set(documentation.map((d) => d.category).filter(Boolean))
    );
    const categories = ["All", ...docCategories];

    const filteredDocs = documentation.filter((doc) => {
        const matchesCategory =
            selectedCategory === "All" || doc.category === selectedCategory;
        const matchesSearch =
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (doc.description &&
                doc.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div
            className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Knowledge Center Repository Library" />
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">
                        Nexus ERP Documentation & Knowledge Base
                    </h1>
                    <p className="text-sm text-slate-500">
                        Official deployment guides, POS hardware manuals, cashier shift controls, and statutory compliance checklists.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
                    <input
                        type="text"
                        placeholder="Search documentation, guides, keywords..."
                        className={`p-2.5 rounded-xl border w-full md:max-w-xs bg-transparent focus:outline-none focus:border-orange-500 ${isDarkMode ? "border-slate-800 text-white" : "border-slate-200"}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-2 rounded-xl border font-bold transition-all ${selectedCategory === cat ? "bg-orange-500 text-white border-orange-500" : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                                {cat === "All"
                                    ? "View All Topics"
                                    : cat.split(" & ")[0]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group ${isDarkMode ? "bg-slate-800/40 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"}`}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] uppercase font-black tracking-wider text-orange-500 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/10">
                                        {doc.type}
                                    </span>
                                </div>
                                <h3 className="font-bold text-base leading-snug group-hover:text-orange-500 transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-xs opacity-70 line-clamp-3 leading-relaxed">
                                    {doc.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                                <span className="text-[10px] font-bold opacity-50 max-w-[140px] truncate">
                                    {doc.category}
                                </span>
                                <button
                                    onClick={() => setActiveDocument(doc)}
                                    className="font-black text-orange-500 hover:text-orange-600 uppercase tracking-wider flex items-center gap-1 group"
                                >
                                    <span>Read Guide</span>
                                    <svg
                                        className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {activeDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div
                        className={`w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border border-slate-200 text-slate-900"}`}
                    >
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <div>
                                <span className="text-[9px] uppercase font-black tracking-widest text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/10">
                                    {activeDocument.type}
                                </span>
                                <h2 className="text-lg font-black tracking-tight mt-1">
                                    {activeDocument.title}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Highlight-select: Render explicit secure downloader button for document attachments */}
                                {["pdf", "text", "image"].includes(
                                    activeDocument.type,
                                ) && (
                                    <a
                                        href={`/knowledge-center/download/${activeDocument.id}`}
                                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5"
                                    >
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
                                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                            />
                                        </svg>
                                        <span>Download File</span>
                                    </a>
                                )}
                                <button
                                    onClick={() => setActiveDocument(null)}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-1"
                                >
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
                                    <span>Close</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-100 dark:bg-slate-950/40 p-4 overflow-auto">
                            {activeDocument.type === "pdf" && (
                                <iframe
                                    src={activeDocument.file_url}
                                    className="w-full h-full rounded-xl border-0"
                                    title={activeDocument.title}
                                />
                            )}

                            {activeDocument.type === "image" && (
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img
                                        src={activeDocument.file_url}
                                        alt={activeDocument.title}
                                        className="max-w-full max-h-full object-contain rounded-xl shadow-lg border dark:border-slate-800"
                                    />
                                </div>
                            )}

                            {activeDocument.type === "youtube" && (
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl border dark:border-slate-800">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${activeDocument.file_url}`}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={activeDocument.title}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeDocument.type === "link" && (
                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                                    <div className="p-4 bg-orange-500/10 text-orange-500 rounded-full">
                                        <svg
                                            className="w-8 h-8"
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
                                    </div>
                                    <h3 className="font-bold text-base">
                                        External Reference Documentation Hub
                                        Address
                                    </h3>
                                    <p className="text-xs text-slate-400 max-w-sm">
                                        This specific knowledge asset is
                                        situated outside local repository limits
                                        inside an authoritative global target
                                        dashboard framework link.
                                    </p>
                                    <a
                                        href={activeDocument.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
                                    >
                                        Access Reference Hub Link
                                    </a>
                                </div>
                            )}

                            {activeDocument.type === "text" && (
                                <div
                                    className={`w-full h-full p-6 rounded-xl border text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}
                                >
                                    <p className="font-sans text-sm italic opacity-80">
                                        {activeDocument.description ||
                                            "No further descriptive annotations provided."}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
                            <div>
                                Token Ref Slug:{" "}
                                <span className="text-orange-500 font-mono uppercase select-all">
                                    {activeDocument.slug}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Status: Verified Vault Resource</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
