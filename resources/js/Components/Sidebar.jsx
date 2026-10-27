import React from "react";
import { Link } from "@inertiajs/react";

export default function Sidebar({ isDarkMode }) {
    // Current window path to highlight active state
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
            ),
        },
        {
            name: "Customers",
            path: "/admin/subscribers",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            name: "Packages",
            path: "/admin/erp-packages",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            name: "Reviews",
            path: "/admin/success-stories",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
        },
        {
            name: "Payments",
            path: "/admin/transactions",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            {/* Real ERP Logo & Branding Header */}
            <div
                className={`p-5 border-b flex items-center gap-3 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
            >
                <div className="h-9 px-2 bg-white rounded-xl flex items-center justify-center border border-slate-200/80 shadow-xs shrink-0">
                    <img
                        src="/images/erp-logo.png"
                        alt="PosXpress"
                        className="h-6 w-auto object-contain"
                    />
                </div>
                <div>
                    <h1
                        className={`font-black tracking-tight text-sm leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                        PosXpress <span className="text-orange-500">ERP</span>
                    </h1>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                        Admin Portal
                    </span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                <div className="pb-2 pt-1 text-[10px] font-black tracking-wider text-slate-400 uppercase px-3">
                    Menu
                </div>

                {menuItems.map((item, idx) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={idx}
                            href={item.path}
                            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                    ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                                    : isDarkMode
                                      ? "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Public Pricing Page Link */}
            <div className="p-4 border-t border-inherit">
                <Link
                    href="/ERP"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        <span>View Pricing Page</span>
                    </span>
                    <span className="text-[10px] uppercase font-black text-slate-400">Live</span>
                </Link>
            </div>

            {/* Footer */}
            <div
                className={`px-4 py-3 border-t text-[10px] tracking-wide text-slate-400 font-medium text-center ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
            >
                PosXpress ERP System
            </div>
        </aside>
    );
}
