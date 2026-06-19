import React, { useState } from "react";

export default function Header({ isDarkMode, setIsDarkMode }) {
    // State to toggle mobile navigation menu display state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hardcoded structural navigation routes mapping
    const navLinks = [
        {
            label: "Inventory Dashboard",
            href: "/user/dashboard",
            active: true,
        },
        { label: "Transactional Ledger", href: "#ledger", active: false },
        { label: "Service Workspace", href: "#services", active: false },
        { label: "Compliance Audits", href: "#compliance", active: false },
    ];

    return (
        <header
            className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 ${
                isDarkMode
                    ? "bg-slate-950/90 border-slate-800"
                    : "bg-white/90 border-slate-200"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* LEFT SEGMENT: NEW ORANGE TECH LOGO & BRAND CONTAINER */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="p-2 bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-lg shrink-0">
                            {/* Updated tech network/bundle icon to match Namecheap vibe */}
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
                                    pathLength="1"
                                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                                />
                                <polyline
                                    points="3.27 6.96 12 12.01 20.73 6.96"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <line
                                    x1="12"
                                    y1="22.08"
                                    x2="12"
                                    y2="12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="text-lg font-black tracking-tight whitespace-nowrap text-slate-900 dark:text-white">
                            Enterprise Client{" "}
                            <span className="text-orange-500">Marketplace</span>
                        </h1>
                    </div>

                    {/* MIDDLE SEGMENT: DESKTOP HORIZONTAL NAVIGATION BAR */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all uppercase ${
                                    link.active
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : isDarkMode
                                          ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* RIGHT SEGMENT: INTERFACE ACTIONS CONTROL BLOCK */}
                    <div className="hidden md:flex items-center gap-4 shrink-0">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`px-4 py-2 rounded-lg border text-xs font-bold shadow-sm transition-all uppercase tracking-wider ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                        </button>
                    </div>

                    {/* RESPONSIVE MOBILE MENU HAMBURGER CONTROLLER */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className={`p-2 rounded-lg border transition-all ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-slate-200"
                                    : "bg-slate-100 border-slate-200 text-slate-700"
                            }`}
                        >
                            <span className="sr-only">
                                Toggle Main Menu Navigation Matrix
                            </span>
                            {isMobileMenuOpen ? (
                                <svg
                                    className="h-5 w-5"
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
                            ) : (
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* EXPANDABLE RESPONSIVE MOBILE DROPDOWN LINKS PANEL */}
            {isMobileMenuOpen && (
                <div
                    className={`md:hidden border-t px-4 pt-2 pb-4 space-y-2 shadow-inner transition-all ${
                        isDarkMode
                            ? "bg-slate-950 border-slate-800"
                            : "bg-slate-50 border-slate-200"
                    }`}
                >
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                                    link.active
                                        ? "bg-orange-500 text-white"
                                        : isDarkMode
                                          ? "text-slate-300 hover:bg-slate-900"
                                          : "text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <div className="pt-2 border-t border-slate-200/20">
                        <button
                            onClick={() => {
                                setIsDarkMode(!isDarkMode);
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full text-center px-4 py-2.5 rounded-lg border text-xs font-black uppercase tracking-widest bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20"
                        >
                            {isDarkMode
                                ? "☀️ Set Light Theme Mode"
                                : "🌙 Set Dark Theme Mode"}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
