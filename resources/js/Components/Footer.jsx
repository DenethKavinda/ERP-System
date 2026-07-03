import React from "react";
import { router } from "@inertiajs/react";

export default function Footer({ isDarkMode }) {
    const currentYear = new Date().getFullYear();

    const handleNavigate = (path) => {
        router.visit(path);
    };

    return (
        <footer
            className={`border-t transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400"
                    : "bg-white border-slate-200 text-slate-600"
            }`}
        >
            {/* Defining reusable colorful linear gradients for social icons */}
            <svg className="absolute w-0 h-0" width="0" height="0">
                <defs>
                    {/* Instagram Gradient */}
                    <linearGradient
                        id="insta-grad"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="100%" stopColor="#285AEB" />
                    </linearGradient>
                    {/* Facebook Gradient */}
                    <linearGradient
                        id="fb-grad"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#18acfe" />
                        <stop offset="100%" stopColor="#1877f2" />
                    </linearGradient>
                    {/* YouTube Gradient */}
                    <linearGradient
                        id="yt-grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#ff0000" />
                        <stop offset="100%" stopColor="#b30000" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3
                            className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                            Enterprise Node
                        </h3>
                        <p className="text-xs leading-relaxed">
                            Empowering continuous system operational agility,
                            custom enterprise architecture solutions, and
                            real-time infrastructure metrics management.
                        </p>
                    </div>

                    {/* Quick Access Portal links */}
                    <div className="space-y-3">
                        <h4
                            className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                        >
                            Core Portals
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <button
                                    onClick={() => handleNavigate("/ERP")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    ERP Packages
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigate("/services")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Services
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() =>
                                        handleNavigate("/complaints")
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Complaints Console
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Insights & Interaction links */}
                    <div className="space-y-3">
                        <h4
                            className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                        >
                            Resources
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <button
                                    onClick={() =>
                                        handleNavigate("/success-stories")
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Success Stories
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() =>
                                        handleNavigate("/knowledge-center")
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Knowledge Center
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() =>
                                        handleNavigate("/contact-consultation")
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Contact & Consultation
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / Bulletin update mockup */}
                    <div className="space-y-3">
                        <h4
                            className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                        >
                            Stay Updated
                        </h4>
                        <p className="text-xs">
                            Subscribe to framework patch summaries.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address..."
                                disabled
                                className={`text-xs px-3 py-2 rounded border w-full cursor-not-allowed focus:outline-none ${
                                    isDarkMode
                                        ? "bg-slate-950 border-slate-800 text-slate-500"
                                        : "bg-slate-50 border-slate-200 text-slate-400"
                                }`}
                            />
                            <button
                                disabled
                                className="text-[11px] font-bold bg-orange-500 text-white px-3 py-2 rounded opacity-50 cursor-not-allowed uppercase tracking-wider"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lower Boundary Bar including Copyright & Social Networks */}
                <div
                    className={`pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs ${
                        isDarkMode ? "border-slate-800" : "border-slate-100"
                    }`}
                >
                    <div>
                        &copy; {currentYear} Enterprise Command Platform. All
                        rights reserved.
                    </div>

                    {/* Social Media Anchors with Full-Color Gradients */}
                    <div className="flex items-center gap-4">
                        {/* Facebook */}
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className={`p-2 rounded-full border transition-all transform hover:scale-110 ${
                                isDarkMode
                                    ? "border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                            }`}
                            title="Facebook"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="url(#fb-grad)"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className={`p-2 rounded-full border transition-all transform hover:scale-110 ${
                                isDarkMode
                                    ? "border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                            }`}
                            title="Instagram"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="url(#insta-grad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="5"
                                    ry="5"
                                ></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line
                                    x1="17.5"
                                    y1="6.5"
                                    x2="17.56"
                                    y2="6.5"
                                ></line>
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className={`p-2 rounded-full border transition-all transform hover:scale-110 ${
                                isDarkMode
                                    ? "border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                            }`}
                            title="YouTube"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="url(#yt-grad)"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
