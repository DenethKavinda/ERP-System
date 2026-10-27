import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useLanguage } from "@/Context/LanguageContext";
import { useT } from "@/hooks/useT";

export default function Header({ isDarkMode, setIsDarkMode, auth }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const t = useT();

    // Retrieve the current URL and auth props from Inertia
    const { url, props } = usePage();
    const user = auth?.user || props?.auth?.user;
    const isAdmin = user?.role === "admin";
    const isSubscriptionActive = isAdmin || Boolean(auth?.isSubscriptionActive ?? props?.auth?.isSubscriptionActive);

    const navLinks = [
        { label: t("header.dashboard"), href: "/dashboard-user" },
        { label: t("header.erpPricing"), href: "/ERP" },
        { label: t("header.successStories"), href: "/success-stories" },
    ];

    // 1. Synchronize theme preference on initial mount (defaults to light theme)
    useEffect(() => {
        const userExplicitlyChoseTheme = localStorage.getItem("user_theme_chosen");
        if (!userExplicitlyChoseTheme) {
            // Default theme is ALWAYS light
            setIsDarkMode(false);
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");
            return;
        }

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, [setIsDarkMode]);

    const toggleTheme = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        localStorage.setItem("user_theme_chosen", "true");
        localStorage.setItem("theme", next ? "dark" : "light");
        if (next) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <header
            className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 ${
                isDarkMode
                    ? "bg-slate-950/90 border-slate-800"
                    : "bg-white/90 border-slate-200"
            }`}
        >
            <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* BRANDING LOGO */}
                    <Link href="/dashboard-user" className="flex items-center gap-3 shrink-0 group">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.2}
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
                        <div className="flex flex-col">
                            <span
                                className={`text-base font-black tracking-tight leading-tight flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                            >
                                NEXUS <span className="text-orange-500">ERP</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                Portal
                            </span>
                        </div>
                    </Link>

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
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:text-amber-300"
                                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                            }`}
                        >
                            {isDarkMode ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 text-amber-400"
                                >
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2" />
                                    <path d="M12 20v2" />
                                    <path d="m4.93 4.93 1.41 1.41" />
                                    <path d="m17.66 17.66 1.41 1.41" />
                                    <path d="M2 12h2" />
                                    <path d="M20 12h2" />
                                    <path d="m6.34 17.66-1.41 1.41" />
                                    <path d="m19.07 4.93-1.41 1.41" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 text-slate-700"
                                >
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                </svg>
                            )}
                        </button>

                        {user ? (
                            <>
                                {isSubscriptionActive ? (
                                    <a
                                        href={props?.erpAppUrl || "http://localhost:5173"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm transition-all transform hover:scale-[1.02] active:scale-95"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                            />
                                        </svg>
                                        <span>{t("header.launchErp")}</span>
                                    </a>
                                ) : (
                                    <a
                                        href={`https://wa.me/94777674308?text=${encodeURIComponent("Customer ID: " + (user.customer_id || "N/A") + "\nBusiness: " + (user.business_name || user.name || "N/A") + "\n\nHello, my ERP subscription has expired. I would like to reactivate my plan via WhatsApp. Thank you.")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all cursor-pointer"
                                        title="Subscription expired. Contact WhatsApp to reactivate."
                                    >
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        <span>Expired - Reactivate</span>
                                    </a>
                                )}

                                {user.role === "admin" && (
                                    <Link
                                        href="/admin/dashboard"
                                        className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide border rounded-lg transition-all ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800 text-orange-400 hover:bg-orange-950/30"
                                                : "bg-slate-100 border-slate-200 text-orange-600 hover:bg-orange-50"
                                        }`}
                                    >
                                        {t("header.adminPanel")}
                                    </Link>
                                )}
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide border rounded-lg transition-all ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-800 text-rose-400 hover:bg-rose-950/30"
                                            : "bg-slate-100 border-slate-200 text-rose-600 hover:bg-rose-50"
                                    }`}
                                >
                                    {t("header.logout")}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide border rounded-lg transition-all ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
                                            : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                                    }`}
                                >
                                    {t("header.signIn")}
                                </Link>
                                <Link
                                    href="/register"
                                    className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm"
                                >
                                    {t("header.register")}
                                </Link>
                            </>
                        )}

                        {/* LANGUAGE SWITCHER — FAR RIGHT */}
                        <button
                            onClick={toggleLanguage}
                            aria-label="Switch language"
                            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-black uppercase tracking-wider ${
                                isDarkMode
                                    ? "bg-orange-950/40 border-orange-500/40 text-orange-400 hover:bg-orange-950/60"
                                    : "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                            {language === "en" ? "සිංහල" : "English"}
                        </button>
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            aria-label="Toggle mobile menu"
                            className={`p-2 rounded-lg border transition-colors ${
                                isDarkMode
                                    ? "border-slate-800 text-slate-300 hover:bg-slate-900"
                                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            {isMobileMenuOpen ? (
                                <svg
                                    className="w-5 h-5"
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
                                    className="w-5 h-5"
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
                        {user ? (
                            <>
                                {isSubscriptionActive ? (
                                    <a
                                        href={props?.erpAppUrl || "http://localhost:5173"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                />
                                            </svg>
                                            <span>Launch ERP</span>
                                        </span>
                                        <svg
                                            className="w-3.5 h-3.5"
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
                                    </a>
                                ) : (
                                    <a
                                        href={`https://wa.me/94777674308?text=${encodeURIComponent("Customer ID: " + (user.customer_id || "N/A") + "\nBusiness: " + (user.business_name || user.name || "N/A") + "\n\nHello, my ERP subscription has expired. I would like to reactivate my plan via WhatsApp. Thank you.")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-red-600 text-white flex items-center justify-between cursor-pointer"
                                    >
                                        <span>Expired - Reactivate</span>
                                    </a>
                                )}
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full text-left px-4 py-2.5 text-rose-500 font-bold uppercase text-xs"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <div className="pt-2 flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800">
                                <Link
                                    href="/login"
                                    className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-bold uppercase text-xs"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2.5 text-orange-500 font-bold uppercase text-xs"
                                >
                                    Register Account
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
