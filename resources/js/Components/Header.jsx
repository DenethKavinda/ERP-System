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
                    ? "bg-slate-900/90 border-slate-800"
                    : "bg-white/90 border-slate-200"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* LEFT SEGMENT: LOGO BRAND CONTAINER */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
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
                                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">
                            Enterprise Client Marketplace
                        </h1>
                    </div>

                    {/* MIDDLE SEGMENT: DESKTOP HORIZONTAL NAVIGATION BAR */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase ${
                                    link.active
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : isDarkMode
                                          ? "text-slate-300 hover:bg-slate-800 hover:text-white"
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
                                    ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
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
                                    ? "bg-slate-800 border-slate-700 text-slate-200"
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
                            ? "bg-slate-900 border-slate-800"
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
                                        ? "bg-blue-600 text-white"
                                        : isDarkMode
                                          ? "text-slate-300 hover:bg-slate-800"
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
                            className="w-full text-center px-4 py-2.5 rounded-lg border text-xs font-black uppercase tracking-widest bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
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
