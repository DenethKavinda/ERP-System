import React, { useState } from "react";
import { Link } from "@inertiajs/react"; // Import Inertia Link for the POST request

export default function Header({ isDarkMode, setIsDarkMode }) {
    // Mobile navigation state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "Inventory Dashboard", href: "/dashboard-user", active: true },
        { label: "Transactional Ledger", href: "#ledger", active: false },
        { label: "Service Workspace", href: "/services", active: false },
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
                    {/* BRANDING LOGO COMPONENT */}
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

                    {/* HORIZONTAL DESKTOP NAVIGATION MENU */}
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

                    {/* ACTIONS BAR (THEME TOGGLE + LOGOUT) */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* INTERFACE THEME ACTION SWITCH COMPONENT */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg border transition-all ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Toggle Light / Dark Interface Modes"
                        >
                            {isDarkMode ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14.25 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* DESKTOP LOGOUT BUTTON */}
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide border rounded-lg transition-all ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-rose-400 hover:bg-rose-950/30 hover:border-rose-900"
                                    : "bg-slate-100 border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-3.5 h-3.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                />
                            </svg>
                            Logout
                        </Link>
                    </div>

                    {/* MOBILE HAMBURGER TOGGLE BUTTON */}
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

            {/* MOBILE INTERACTIVE ACCORDION LINK LIST PANEL */}
            {isMobileMenuOpen && (
                <div
                    className={`md:hidden border-t px-4 pt-2 pb-4 space-y-2 shadow-inner ${
                        isDarkMode
                            ? "bg-slate-950 border-slate-800"
                            : "bg-white border-slate-200"
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
                                          : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}

                        <hr
                            className={`my-2 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
                        />

                        {/* MOBILE LOGOUT LINK */}
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                                isDarkMode
                                    ? "text-rose-400 hover:bg-rose-950/20"
                                    : "text-rose-600 hover:bg-rose-50"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                />
                            </svg>
                            Logout
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
