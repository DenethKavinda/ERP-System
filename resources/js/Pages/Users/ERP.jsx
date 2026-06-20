import React, { useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function ERP({ packages = [] }) {
    // Shared state configuration for tracking interface theme mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Helper function to turn comma-separated text into custom arrays
    const parseMeta = (inputString) => {
        if (!inputString) return [];
        return inputString
            .split(",")
            .map((str) => str.trim())
            .filter(Boolean);
    };

    const handleBuy = (packageId) => {
        alert(
            `Proceeding to checkout configuration for setup package ID: ${packageId}`,
        );
    };

    return (
        <div
            className={`min-h-screen font-sans transition-colors duration-500 flex flex-col justify-between overflow-x-hidden ${
                isDarkMode
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-900"
            }`}
        >
            <div>
                {/* Top Navigation Bar with active layout toggle state */}
                <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

                {/* Core Body Container */}
                <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative">
                    {/* Decorative dynamic background blur effects */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="text-center mb-16 relative z-10 animate-fade-in">
                        <h1
                            className={`text-4xl sm:text-5xl font-black tracking-tight mb-3 transition-colors duration-500 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                            Pick your Enterprise Architecture
                        </h1>
                        <p
                            className={`max-w-xl mx-auto text-sm transition-colors duration-500 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                        >
                            Select tailored configurations optimized with secure
                            execution loops engineered exclusively for growing
                            business nodes.
                        </p>
                    </div>

                    {/* Handle Empty State Gracefully */}
                    {packages.length === 0 ? (
                        <div
                            className={`text-center py-12 max-w-xl mx-auto rounded-2xl border p-8 shadow-sm transition-all duration-500 ${
                                isDarkMode
                                    ? "bg-slate-900/60 border-slate-800"
                                    : "bg-white border-slate-200"
                            }`}
                        >
                            <p
                                className={`text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                            >
                                No ERP packages found in the database system.
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                                Please add packages via your Admin Dashboard
                                sidebar to view them here.
                            </p>
                        </div>
                    ) : (
                        /* Responsive Pricing Layout Grid Mapping */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch relative z-10">
                            {packages.map((pkg) => {
                                const audienceList = parseMeta(
                                    pkg.suitable_for,
                                );
                                const featuresList = parseMeta(pkg.features);
                                const benefitsList = parseMeta(pkg.benefits);

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`rounded-2xl border p-8 flex flex-col justify-between relative group transform transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800 text-white hover:border-orange-500/40 hover:shadow-orange-500/5"
                                                : "bg-white border-slate-100 text-slate-900 hover:border-orange-500/30 hover:shadow-slate-200"
                                        }`}
                                    >
                                        {/* Subtle internal gradient accent card highlight */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div className="relative z-10">
                                            {/* Header Info */}
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-xl font-extrabold tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                                                    {pkg.name}
                                                </h2>
                                                <span
                                                    className={`text-xs font-black px-2.5 py-1 rounded-md transition-colors duration-500 ${
                                                        isDarkMode
                                                            ? "bg-slate-800 text-orange-400"
                                                            : "bg-slate-100 text-orange-600"
                                                    }`}
                                                >
                                                    ⭐ {pkg.rating || "5.0"}
                                                </span>
                                            </div>

                                            <div className="mb-6">
                                                <span className="text-3xl font-black tracking-tight text-orange-500 transition-transform duration-300 inline-block group-hover:scale-105">
                                                    LKR{" "}
                                                    {Number(
                                                        pkg.price,
                                                    ).toLocaleString()}
                                                </span>
                                                <span className="text-slate-400 text-xs font-bold block mt-0.5">
                                                    / month
                                                </span>
                                            </div>

                                            <hr
                                                className={`my-5 transition-colors duration-500 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
                                            />

                                            {/* Target Suitability */}
                                            {audienceList.length > 0 && (
                                                <div className="mb-5">
                                                    <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                                                        Suitable For
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {audienceList.map(
                                                            (target, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all duration-300 group-hover:bg-orange-500/10 ${
                                                                        isDarkMode
                                                                            ? "bg-orange-950/40 text-orange-400"
                                                                            : "bg-orange-50/60 text-orange-700"
                                                                    }`}
                                                                >
                                                                    {target}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Features Checkbox List */}
                                            {featuresList.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                                                        Core Feature Sets
                                                    </h4>
                                                    <ul className="space-y-2.5">
                                                        {featuresList.map(
                                                            (feature, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className={`flex items-start gap-2 text-xs font-medium transition-colors duration-500 ${
                                                                        isDarkMode
                                                                            ? "text-slate-300"
                                                                            : "text-slate-600"
                                                                    }`}
                                                                >
                                                                    <span className="text-emerald-500 shrink-0 transform transition-transform duration-300 group-hover:scale-110">
                                                                        ✅
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            feature
                                                                        }
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Business Benefits */}
                                            {benefitsList.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
                                                        Core Benefits
                                                    </h4>
                                                    <ul
                                                        className={`space-y-1.5 p-3 rounded-xl border transition-colors duration-500 ${
                                                            isDarkMode
                                                                ? "bg-slate-950 border-slate-800 text-slate-400"
                                                                : "bg-slate-50 border-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        {benefitsList.map(
                                                            (benefit, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="text-[11px] font-medium flex items-center gap-1.5"
                                                                >
                                                                    <span
                                                                        className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}
                                                                    ></span>
                                                                    {benefit}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button Container */}
                                        <div className="relative z-10 mt-4">
                                            <button
                                                onClick={() =>
                                                    handleBuy(pkg.id)
                                                }
                                                className="w-full text-center py-3.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-sm border border-transparent transition-all duration-300 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 active:scale-[0.98]"
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Application Footer Layout */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
