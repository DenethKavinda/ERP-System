import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Dashboard({ auth, navigationCards = [] }) {
    // UI Theme state controls
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Sync state with HTML class list to enable Tailwind dark: variants globally
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // Navigation utility function
    const handleNavigate = (path) => {
        router.visit(path);
    };

    return (
        <div
            className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-950 text-slate-100"
                    : "bg-slate-50 text-slate-900"
            }`}
        >
            <Head title="Enterprise Command Console" />

            <div>
                {/* SEPARATED HEADER */}
                <Header
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    auth={auth}
                />

                {/* HIGH-LEGIBILITY HERO COVER BAR */}
                <div className="relative bg-slate-900 text-white min-h-[40vh] flex items-center justify-center py-16 px-4 border-b border-slate-800 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen scale-105"
                        style={{ backgroundImage: "url('/img/hero-bg.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                    <div className="relative z-10 max-w-4xl w-full text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                            Bring your big ideas to life.
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-medium">
                            Select an infrastructure sector from your primary
                            dashboard node to manage active operations.
                        </p>
                    </div>
                </div>

                {/* MAIN APP SHELL CONTENT LAYOUT */}
                <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 pb-16">
                    <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
                        <h2
                            className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                            Central Operations Framework
                        </h2>
                    </div>

                    {/* Navigation Dashboard Grid */}
                    {navigationCards.length === 0 ? (
                        <div
                            className={`border border-dashed p-16 text-center rounded-xl ${isDarkMode ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-white border-slate-300 text-slate-500"}`}
                        >
                            <p className="text-sm font-medium">
                                No system sections are currently deployed. Add
                                portals via the dashboard manager.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {navigationCards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm group ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                                            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                                    }`}
                                >
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full bg-gradient-to-r ${card.accent_color}`}
                                                />
                                                <span
                                                    className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${
                                                        isDarkMode
                                                            ? "bg-slate-800 text-slate-300"
                                                            : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    System Node
                                                </span>
                                            </div>
                                            <h3
                                                className={`font-bold text-xl tracking-tight mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                                            >
                                                {card.name}
                                            </h3>
                                            <p
                                                className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                            >
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-4 border-t px-6 flex items-center justify-end ${
                                            isDarkMode
                                                ? "border-slate-800 bg-slate-950/40"
                                                : "border-slate-200 bg-slate-50"
                                        }`}
                                    >
                                        <button
                                            onClick={() =>
                                                handleNavigate(card.path)
                                            }
                                            className={`w-full md:w-auto bg-gradient-to-r ${card.accent_color} hover:brightness-110 text-white text-xs font-bold px-5 py-2.5 rounded text-center transition-all uppercase tracking-wider shadow-sm flex items-center justify-center gap-2`}
                                        >
                                            {/* Supporting snake_case schema output from Laravel Model maps */}
                                            <span>{card.button_text}</span>
                                            <svg
                                                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* SHARED VISUAL FOOTER FOOTPRINT */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
