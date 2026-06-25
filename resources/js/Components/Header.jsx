import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Header({ isDarkMode, setIsDarkMode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Retrieve the current URL from Inertia to determine active state
    const { url } = usePage();

    const navLinks = [
        { label: "Inventory Dashboard", href: "/dashboard-user" },
        { label: "Transactional Ledger", href: "/ledger" },
        { label: "Service Workspace", href: "/services" },
        { label: "Compliance Audits", href: "/complaints" },
    ];

    // 1. Synchronize theme preference on initial mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        // Check if user has a saved preference, or defaults to system preferences
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, [setIsDarkMode]);

    // 2. Update localStorage and DOM classes whenever isDarkMode changes
    useEffect(() => {
        if (isDarkMode) {
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
        } else {
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

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
                    {/* BRANDING LOGO */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg shrink-0">
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
                        <h1
                            className={`text-lg font-black tracking-tight whitespace-nowrap ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                            Enterprise Client{" "}
                            <span className="text-orange-500">Marketplace</span>
                        </h1>
                    </div>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = url === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all uppercase ${
                                        isActive
                                            ? "bg-orange-500 text-white shadow-sm"
                                            : isDarkMode
                                              ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ACTIONS BAR */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg border transition-all ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            {isDarkMode ? "☀️" : "🌙"}
                        </button>

                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide border rounded-lg transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-rose-400 hover:bg-rose-950/30" : "bg-slate-100 border-slate-200 text-rose-600 hover:bg-rose-50"}`}
                        >
                            Logout
                        </Link>
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="p-2 rounded-lg border"
                        >
                            {isMobileMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div
                    className={`md:hidden border-t px-4 pt-2 pb-4 space-y-2 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
                >
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => {
                            const isActive = url === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                        isActive
                                            ? "bg-orange-500 text-white"
                                            : isDarkMode
                                              ? "text-slate-300 hover:bg-slate-900"
                                              : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="w-full text-left px-4 py-2.5 text-rose-500 font-bold uppercase text-xs"
                        >
                            Logout
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
