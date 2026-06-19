import React from "react";
import { Link } from "@inertiajs/react";

export default function Sidebar({ isDarkMode }) {
    // Current window path to highlight active state
    const currentPath = window.location.pathname;

    const menuItems = [
        {
            name: "Main Dashboard",
            path: "/dashboard-manager",
            icon: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
                    />
                </svg>
            ),
        },
        {
            name: "ERP Packages",
            path: "#",
            icon: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            ),
        },
        {
            name: "Services",
            path: "#",
            icon: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            name: "Complaints",
            path: "#",
            icon: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            ),
        },
        {
            name: "Success Stories",
            path: "#",
            icon: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
            ),
        },
        {
            name: "Knowledge Center",
            path: "#",
            icon: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
        },
        {
            name: "Contact & Consultation",
            path: "#",
            icon: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <aside
            className={`w-64 min-h-screen hidden md:flex flex-col border-r transition-colors duration-300 shrink-0 ${
                isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-white border-slate-200 text-slate-700"
            }`}
        >
            {/* Sidebar Branding Header */}
            <div
                className={`p-6 border-b flex items-center gap-3 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
            >
                <div className="h-7 w-7 rounded bg-orange-500 flex items-center justify-center text-white font-black text-sm">
                    E
                </div>
                <div>
                    <h1
                        className={`font-black tracking-tight text-sm uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                        Admin Console
                    </h1>
                    <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">
                        Control Panel v1.0
                    </span>
                </div>
            </div>

            {/* Nav Menu Options */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, idx) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={idx}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                                isActive
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : isDarkMode
                                      ? "hover:bg-slate-800/60 hover:text-white"
                                      : "hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Sidebar Footprint Identity */}
            <div
                className={`p-4 border-t text-[10px] tracking-wide text-slate-400 font-medium text-center ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
            >
                Secure Node Connection
            </div>
        </aside>
    );
}
