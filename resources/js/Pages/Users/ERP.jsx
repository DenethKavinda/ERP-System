import React, { useState, useRef } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function ERP({ packages = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return (
                localStorage.getItem("theme") === "dark" ||
                (!localStorage.getItem("theme") &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
            );
        }
        return false;
    });

    const [searchQuery, setSearchQuery] = useState("");

    // Video Player UI State Control Parameters
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [youtubeVideoId, setYoutubeVideoId] = useState("dQw4w9WgXcQ");
    const mainVideoRef = useRef(null);

    // Checkout System State
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    const additionalServices = [
        {
            id: "srv_backup",
            name: "Automated Cloud Backup Storage",
            price: 1500,
            type: "monthly",
            description: "Hourly snapshots secure database nodes redundantly.",
        },
        {
            id: "srv_support",
            name: "24/7 Dedicated Priority VIP Support",
            price: 3500,
            type: "monthly",
            description:
                "Direct engineering hotline channel communication SLA.",
        },
        {
            id: "srv_setup",
            name: "Custom On-Site Data Migration & Setup",
            price: 12000,
            type: "one-time",
            description: "Engineers port your legacy SQL archives seamlessly.",
        },
        {
            id: "srv_security",
            name: "Advanced Enterprise Firewall & Hardening",
            price: 8500,
            type: "one-time",
            description:
                "Implements strict identity access token guard layers.",
        },
    ];

    const parseMeta = (inputString) => {
        if (!inputString) return [];
        return inputString
            .split(",")
            .map((str) => str.trim())
            .filter(Boolean);
    };

    const filteredPackages = packages.filter((pkg) => {
        const query = searchQuery.toLowerCase();
        const matchesName = pkg.name?.toLowerCase().includes(query);
        const matchesSuitable = pkg.suitable_for?.toLowerCase().includes(query);
        return matchesName || matchesSuitable;
    });

    const handleBuyButtonClick = (pkg) => {
        setSelectedPackage(pkg);
        setSelectedServices([]);
        setIsCheckoutModalOpen(true);
    };

    const handleServiceToggle = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(
                selectedServices.filter((id) => id !== serviceId),
            );
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    const calculateTotal = () => {
        if (!selectedPackage) return 0;
        let total = Number(selectedPackage.price);

        additionalServices.forEach((srv) => {
            if (selectedServices.includes(srv.id)) {
                total += srv.price;
            }
        });
        return total;
    };

    const handlePaymentConfirm = () => {
        alert(
            `Order Confirmed!\n\nPackage: ${selectedPackage.name}\nTotal Cart Value: LKR ${calculateTotal().toLocaleString()}\n\n*Payment gateway redirection pipeline integration points will be connected here later.*`,
        );
        setIsCheckoutModalOpen(false);
    };

    const handleMainVideoMouseEnter = () => {
        if (mainVideoRef.current) {
            mainVideoRef.current.play().catch((err) => {
                console.log(
                    "Autoplay on hover blocked until user gesture interaction:",
                    err,
                );
            });
        }
    };

    const handleMainVideoMouseLeave = () => {
        if (mainVideoRef.current) {
            mainVideoRef.current.pause();
        }
    };

    return (
        <div
            className={`min-h-screen font-sans transition-colors duration-500 flex flex-col justify-between overflow-x-hidden ${
                isDarkMode
                    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white"
                    : "bg-gradient-to-br from-slate-100 via-white to-slate-200/70 text-slate-900"
            }`}
        >
            <div>
                <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
                    {/* HERO VIDEO BANNER */}
                    <div
                        className="w-full mb-12 relative z-20"
                        onMouseEnter={handleMainVideoMouseEnter}
                        onMouseLeave={handleMainVideoMouseLeave}
                    >
                        <div
                            onClick={() => {
                                setYoutubeVideoId("dQw4w9WgXcQ");
                                setIsVideoModalOpen(true);
                            }}
                            className={`w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-md border cursor-pointer group relative transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                                isDarkMode
                                    ? "border-slate-800 bg-slate-900/40 backdrop-blur-md"
                                    : "border-slate-200/60 bg-white/60 backdrop-blur-md"
                            }`}
                        >
                            <video
                                ref={mainVideoRef}
                                className="w-full h-full object-cover transition-opacity duration-500 opacity-80 group-hover:opacity-100"
                                loop
                                muted
                                playsInline
                                poster="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                            >
                                <source
                                    src="https://assets.mixkit.co/videos/preview/mixkit-tech-dashboard-with-charts-and-data-analysis-41614-large.mp4"
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>

                            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors duration-300 flex flex-col justify-between p-6 md:p-8" />

                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                                    System Overview Video
                                </span>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="p-5 bg-orange-500 text-white rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-600 active:scale-95 animate-pulse group-hover:animate-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-6 h-6 md:w-8 md:h-8 translate-x-0.5"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end">
                                <div>
                                    <h2 className="text-white text-xl md:text-2xl font-black tracking-tight drop-shadow-md">
                                        Explore Enterprise Architecture
                                        Solutions
                                    </h2>
                                    <p className="text-slate-200 text-xs font-semibold mt-1 hidden sm:block drop-shadow-sm">
                                        Hover to scan preview footage • Click to
                                        initialize full theater layout view
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Blurs */}
                    <div className="absolute top-48 left-1/4 w-80 h-80 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

                    <div className="text-center mb-8 relative z-10 animate-fade-in">
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

                    {/* Search & Filter Bar */}
                    <div className="max-w-md mx-auto mb-10 relative z-20">
                        <div className="relative flex items-center shadow-sm rounded-xl">
                            <input
                                type="text"
                                className={`w-full p-3.5 pl-11 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-orange-500 transition-colors ${
                                    isDarkMode
                                        ? "border-slate-800 text-white placeholder-slate-600 bg-slate-900/20"
                                        : "border-slate-200 text-slate-900 placeholder-slate-400 bg-white"
                                }`}
                                placeholder="Filter by package name or audience (e.g., Small shops)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg
                                className="w-4 h-4 absolute left-4 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* PACKAGES SECTION */}
                    {packages.length === 0 ? (
                        <div
                            className={`text-center py-12 max-w-xl mx-auto rounded-2xl border p-8 shadow-sm transition-all duration-500 ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-slate-200"}`}
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
                        <div className="space-y-8 relative z-10">
                            {filteredPackages.map((pkg) => {
                                const audienceList = parseMeta(
                                    pkg.suitable_for,
                                );
                                const featuresList = parseMeta(pkg.features);
                                const activeVideoId =
                                    pkg.youtube_id || "dQw4w9WgXcQ";

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`rounded-2xl border p-6 md:p-8 relative group transition-all duration-300 hover:shadow-xl ${
                                            isDarkMode
                                                ? "bg-slate-900/80 border-slate-800 text-white hover:border-orange-500/40"
                                                : "bg-white/90 border-slate-200/80 text-slate-900 hover:border-orange-500/30"
                                        }`}
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                            {/* LEFT SIDE: PACKAGE VIDEO / THUMBNAIL */}
                                            <div className="lg:col-span-5">
                                                <div
                                                    onClick={() => {
                                                        setYoutubeVideoId(
                                                            activeVideoId,
                                                        );
                                                        setIsVideoModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className={`w-full h-56 md:h-64 rounded-xl overflow-hidden relative cursor-pointer group/video border shadow-sm transition-all ${
                                                        isDarkMode
                                                            ? "border-slate-800 bg-slate-950"
                                                            : "border-slate-200 bg-slate-100"
                                                    }`}
                                                >
                                                    <img
                                                        src={`https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg`}
                                                        alt={`${pkg.name} video thumbnail`}
                                                        className="w-full h-full object-cover transition-transform duration-500 opacity-90 group-hover/video:opacity-100 group-hover/video:scale-105"
                                                    />

                                                    <div className="absolute inset-0 bg-slate-950/30 group-hover/video:bg-slate-950/10 transition-colors" />

                                                    <div className="absolute top-3 left-3 z-10">
                                                        <span className="bg-slate-900/80 backdrop-blur-md text-orange-400 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded">
                                                            📹 {pkg.name} Video
                                                            Guide
                                                        </span>
                                                    </div>

                                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                                        <div className="p-3.5 bg-orange-500 text-white rounded-full shadow-lg transform transition-all duration-300 group-hover/video:scale-110">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                                className="w-5 h-5 translate-x-0.5"
                                                            >
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-3 left-3 right-3 z-10">
                                                        <p className="text-white text-[10px] font-semibold drop-shadow">
                                                            Click to watch full
                                                            video
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT SIDE: PACKAGE DETAILS */}
                                            <div className="lg:col-span-7 flex flex-col justify-between h-full">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h2 className="text-2xl font-extrabold tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                                                            {pkg.name}
                                                        </h2>
                                                        <span
                                                            className={`text-xs font-black px-2.5 py-1 rounded-md ${
                                                                isDarkMode
                                                                    ? "bg-slate-800 text-orange-400"
                                                                    : "bg-slate-200/60 text-orange-600"
                                                            }`}
                                                        >
                                                            ⭐{" "}
                                                            {pkg.rating ||
                                                                "5.0"}
                                                        </span>
                                                    </div>

                                                    <div className="mb-4 flex items-baseline gap-2">
                                                        <span className="text-3xl font-black tracking-tight text-orange-500">
                                                            LKR{" "}
                                                            {Number(
                                                                pkg.price,
                                                            ).toLocaleString()}
                                                        </span>
                                                        <span className="text-slate-400 text-xs font-bold">
                                                            / month
                                                        </span>
                                                    </div>

                                                    <hr
                                                        className={`my-3 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
                                                    />

                                                    {audienceList.length >
                                                        0 && (
                                                        <div className="mb-3">
                                                            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">
                                                                Suitable For
                                                            </h4>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {audienceList.map(
                                                                    (
                                                                        target,
                                                                        idx,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                                                                                isDarkMode
                                                                                    ? "bg-orange-950/40 text-orange-400"
                                                                                    : "bg-orange-50 text-orange-700"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                target
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {featuresList.length >
                                                        0 && (
                                                        <div className="mb-3">
                                                            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">
                                                                Core Features
                                                            </h4>
                                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                                {featuresList.map(
                                                                    (
                                                                        feature,
                                                                        idx,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className={`flex items-start gap-1.5 text-xs font-medium ${
                                                                                isDarkMode
                                                                                    ? "text-slate-300"
                                                                                    : "text-slate-600"
                                                                            }`}
                                                                        >
                                                                            <span className="text-emerald-500 shrink-0">
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
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                                                    <button
                                                        onClick={() =>
                                                            handleBuyButtonClick(
                                                                pkg,
                                                            )
                                                        }
                                                        className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-sm border border-transparent transition-all hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 active:scale-[0.98]"
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* CHECKOUT MODAL WINDOW */}
            {isCheckoutModalOpen && selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div
                        className={`w-full max-w-2xl rounded-2xl overflow-hidden border shadow-2xl flex flex-col max-h-[90vh] ${
                            isDarkMode
                                ? "border-slate-800 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-900"
                        }`}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-inherit">
                            <div>
                                <h3 className="text-lg font-black tracking-tight">
                                    Configure Your Plan
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Customize your setup layout architecture
                                    metrics before confirmation.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                    isDarkMode
                                        ? "border-slate-800 hover:bg-slate-800 text-slate-400"
                                        : "border-slate-200 hover:bg-slate-100 text-slate-500"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            <div
                                className={`p-4 rounded-xl border flex justify-between items-center ${
                                    isDarkMode
                                        ? "bg-slate-950 border-slate-800"
                                        : "bg-slate-50 border-slate-100"
                                }`}
                            >
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-orange-500">
                                        Selected Core Base Plan
                                    </span>
                                    <h4 className="text-md font-extrabold tracking-tight mt-0.5">
                                        {selectedPackage.name}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-orange-500">
                                        LKR{" "}
                                        {Number(
                                            selectedPackage.price,
                                        ).toLocaleString()}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-bold block">
                                        / month
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-3">
                                    Available Premium Add-ons
                                </h4>
                                <div className="space-y-3">
                                    {additionalServices.map((service) => {
                                        const isChecked =
                                            selectedServices.includes(
                                                service.id,
                                            );
                                        return (
                                            <label
                                                key={service.id}
                                                className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all duration-300 ${
                                                    isChecked
                                                        ? isDarkMode
                                                            ? "border-orange-500/50 bg-orange-500/[0.02]"
                                                            : "border-orange-500/40 bg-orange-500/[0.01]"
                                                        : isDarkMode
                                                          ? "border-slate-800/80 bg-slate-950/40 hover:border-slate-700"
                                                          : "border-slate-200/60 bg-white hover:border-slate-300"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() =>
                                                        handleServiceToggle(
                                                            service.id,
                                                        )
                                                    }
                                                    className="mt-1 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-300"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <span className="text-xs font-black tracking-tight">
                                                            {service.name}
                                                        </span>
                                                        <div className="text-right shrink-0">
                                                            <span className="text-xs font-extrabold text-orange-500">
                                                                +LKR{" "}
                                                                {service.price.toLocaleString()}
                                                            </span>
                                                            <span
                                                                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ml-1.5 inline-block ${
                                                                    service.type ===
                                                                    "monthly"
                                                                        ? isDarkMode
                                                                            ? "bg-blue-950 text-blue-400"
                                                                            : "bg-blue-50 text-blue-700"
                                                                        : isDarkMode
                                                                          ? "bg-purple-950 text-purple-400"
                                                                          : "bg-purple-50 text-purple-700"
                                                                }`}
                                                            >
                                                                {service.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">
                                                        {service.description}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-6 border-t border-inherit flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                                isDarkMode
                                    ? "bg-slate-950/40"
                                    : "bg-slate-50/60"
                            }`}
                        >
                            <div>
                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                                    Total Estimated Cart Value
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                    <span className="text-2xl font-black text-orange-500 tracking-tight">
                                        LKR {calculateTotal().toLocaleString()}
                                    </span>
                                    <span className="text-slate-400 text-xs font-bold">
                                        Total
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setIsCheckoutModalOpen(false)
                                    }
                                    className={`px-4 py-3 rounded-xl text-xs font-black tracking-wider uppercase border transition-all ${
                                        isDarkMode
                                            ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                                            : "border-slate-200 hover:bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePaymentConfirm}
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-md transition-all active:scale-95"
                                >
                                    Confirm Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL THEATER LAYER VIDEO OVERLAY MODAL */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div
                        className={`w-full max-w-4xl rounded-2xl overflow-hidden border shadow-2xl relative ${
                            isDarkMode
                                ? "border-slate-800 bg-slate-900"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
                            <h3 className="text-sm font-black uppercase tracking-wider text-orange-500">
                                Package Overview Video
                            </h3>
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                    isDarkMode
                                        ? "border-slate-800 hover:bg-slate-800 text-slate-400"
                                        : "border-slate-200 hover:bg-slate-100 text-slate-500"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="relative w-full aspect-video bg-black">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
