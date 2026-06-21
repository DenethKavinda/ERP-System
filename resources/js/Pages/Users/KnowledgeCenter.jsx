import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function KnowledgeCenter({ documentation = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeDocument, setActiveDocument] = useState(null);

    // Dynamic Live Core Repository engine acting as fallback layer if backend data is empty
    const displayDocs =
        documentation.length > 0
            ? documentation
            : [
                  {
                      id: 1,
                      slug: "technical-whitepaper-2026",
                      title: "Decentralized Node Scaling & Latency Whitepaper",
                      category: "Technical Documentation & Whitepapers",
                      type: "pdf",
                      description:
                          "Deep-dive structural analysis exploring high-concurrency architecture loops, distributed memory logs, and caching layer boundaries.",
                      file_url:
                          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                  },
                  {
                      id: 2,
                      slug: "strategic-api-setup-steps",
                      title: "Multi-Tenant Webhook & Gateway Core Integration",
                      category: "Strategic API Setup",
                      type: "api_steps",
                      description:
                          "Point-by-point implementation manual for initializing gateway nodes, authenticating cross-origin handshakes, and syncing webhooks.",
                      steps: [
                          {
                              stage: "Step 01",
                              title: "Endpoint Instantiation",
                              task: "Generate private system node credentials inside the admin configuration workspace console.",
                          },
                          {
                              stage: "Step 02",
                              title: "Handshake Verification",
                              task: "Configure your integration layer headers to pass the dynamic Bearer Token structure on every outbound query.",
                          },
                          {
                              stage: "Step 03",
                              title: "Webhook Synchronization",
                              task: "Register a secure target URL parameters string to process real-time status change transactions.",
                          },
                          {
                              stage: "Step 04",
                              title: "Isolated Sandbox Validation",
                              task: "Execute initial mock connection streams to confirm operational network throughput values.",
                          },
                      ],
                  },
                  {
                      id: 3,
                      slug: "enterprise-architecture-blueprint",
                      title: "Cloud Infrastructure Cluster & Topology Blueprint",
                      category: "Architecture Blueprints",
                      type: "pdf",
                      description:
                          "Enterprise system design layout illustrating cluster topology networks, high-availability proxies, and secure relational database rings.",
                      file_url:
                          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                  },
              ];

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const categories = [
        "All",
        ...new Set(displayDocs.map((doc) => doc.category)),
    ];

    const filteredDocs = displayDocs.filter((doc) => {
        const matchesCategory =
            selectedCategory === "All" || doc.category === selectedCategory;
        const matchesSearch =
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen font-sans flex flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
            <div>
                <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

                {/* Main Hero Control Room */}
                <div className="border-b border-slate-200 bg-white dark:border-slate-900 dark:bg-slate-900/40">
                    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                                System Node
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                Knowledge Center
                            </h1>
                            <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                                Access technical documentation whitepapers,
                                strategic API setup instructions, and immersive
                                enterprise architecture design blueprints.
                            </p>
                        </div>

                        {/* ERP SYSTEM OVERVIEW YOUTUBE VIDEO SECTION */}
                        <div className="w-full max-w-3xl border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-black aspect-video relative">
                            <iframe
                                className="w-full h-full absolute inset-0"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace this ID code segment with your true video embed URL link
                                title="What is an ERP System Ecosystem Overview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Search and Category Control Matrix */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() =>
                                            setSelectedCategory(category)
                                        }
                                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                                            selectedCategory === category
                                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="text"
                                placeholder="Search blueprints or documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:max-w-xs px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Document Display Grid Layout */}
                <main className="max-w-7xl mx-auto px-6 py-12">
                    {filteredDocs.length === 0 ? (
                        <div className="border border-dashed p-16 text-center rounded-2xl bg-white border-slate-200 text-slate-400 dark:bg-slate-900/20 dark:border-slate-800">
                            <p className="text-sm font-semibold">
                                No technical resources matched your current
                                search parameter filter.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDocs.map((doc) => (
                                <div
                                    key={doc.id || doc.slug}
                                    className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-all duration-300"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span
                                                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                                    doc.type === "pdf"
                                                        ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                                        : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                                                }`}
                                            >
                                                {doc.type === "pdf"
                                                    ? "PDF Downloadable"
                                                    : "On-Page Guide"}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 capitalize">
                                                {doc.category}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-bold text-base tracking-tight text-slate-900 dark:text-white line-clamp-1">
                                                {doc.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                                {doc.description}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setActiveDocument(doc)}
                                        className="mt-6 w-full py-2.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                                    >
                                        {doc.type === "pdf"
                                            ? "View & Download PDF"
                                            : "Open Step Instructions"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* IMMERSIVE MODAL EXPLORER FRAME LAYER */}
            {activeDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-2xl">
                        {/* USER-FRIENDLY MODULAR HEADER */}
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
                            <div className="min-w-0 pr-4">
                                <span className="text-[9px] uppercase tracking-widest font-black text-orange-500 block">
                                    Knowledge System Asset //{" "}
                                    {activeDocument.category}
                                </span>
                                <h3 className="font-extrabold text-sm tracking-tight truncate text-slate-900 dark:text-white mt-0.5">
                                    {activeDocument.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {activeDocument.type === "pdf" && (
                                    <a
                                        href={activeDocument.file_url}
                                        download
                                        className="p-2 px-3 text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all text-xs flex items-center gap-1.5 font-bold shadow-sm"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                            />
                                        </svg>
                                        Download Document
                                    </a>
                                )}
                                <button
                                    onClick={() => setActiveDocument(null)}
                                    className="p-2 bg-slate-200 text-slate-700 hover:bg-red-500 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-600 rounded-xl transition-all font-bold text-xs px-4"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* DYNAMIC DOCUMENT RUNTIME INTERFACE BODY */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/40 dark:bg-slate-950/20">
                            {/* CATEGORY VARIANT 1 & 3: PDF Document Render Frame */}
                            {activeDocument.type === "pdf" && (
                                <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-800">
                                    <iframe
                                        src={`${activeDocument.file_url}#toolbar=1`}
                                        title={activeDocument.title}
                                        className="w-full h-full border-none bg-slate-900"
                                    />
                                </div>
                            )}

                            {/* CATEGORY VARIANT 2: Point by Point Strategic API Setup Instructions */}
                            {activeDocument.type === "api_steps" && (
                                <div className="max-w-4xl mx-auto space-y-4">
                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-4">
                                        <h4 className="text-xs uppercase tracking-wider font-black text-slate-400">
                                            Integration Guidelines
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            Follow this system deployment track
                                            point by point to safely establish
                                            synchronization loops with remote
                                            servers.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {activeDocument.steps?.map(
                                            (step, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-orange-500/30 transition-colors"
                                                >
                                                    <span className="px-2.5 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black tracking-wider rounded-lg uppercase shrink-0">
                                                        {step.stage}
                                                    </span>
                                                    <div className="space-y-0.5">
                                                        <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {step.title}
                                                        </h5>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                            {step.task}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* USER-FRIENDLY MODULAR FOOTER */}
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/20 shrink-0 text-[11px] font-bold text-slate-400">
                            <div>
                                Secure System Infrastructure Reference Token:{" "}
                                <span className="text-orange-500 font-mono select-all uppercase">
                                    {activeDocument.slug}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Status: Verified Pipeline Secure</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
