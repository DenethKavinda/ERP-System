import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Dashboard({
    auth,
    navigationCards = [],
    packageCarts = [],
}) {
    // UI Theme state controls
    const [isDarkMode, setIsDarkMode] = useState(false);

    // State to manage the open package pop-up window overlay
    const [selectedCart, setSelectedCart] = useState(null);

    // Video Player Interaction Tracking Parameters for internal layout view
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [activeVideoId, setActiveVideoId] = useState("dQw4w9WgXcQ");
    const videoRef = useRef(null);

    // ==================== CHECKOUT MATRIX STATE ====================
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    // Sample Available Add-on Services Data Structure
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

    // Sync state with HTML class list to enable Tailwind dark: variants globally
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // Navigation utility function for Central Operations Framework links
    const handleNavigate = (path) => {
        router.visit(path);
    };

    // Helper utility to parse YouTube watch links to fetch video embed IDs safely
    const extractVideoId = (url) => {
        if (!url) return "dQw4w9WgXcQ";
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : "dQw4w9WgXcQ";
    };

    // Triggered when initializing nested item purchase events
    const handleBuyButtonClick = (pkg) => {
        setSelectedPackage(pkg);
        setSelectedServices([]);
        setIsCheckoutModalOpen(true);
    };

    // Toggle selected add-on service checkboxes
    const handleServiceToggle = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(
                selectedServices.filter((id) => id !== serviceId),
            );
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    // Calculate total layout configuration values dynamically
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
            `Order Confirmed!\n\nPackage: ${selectedPackage.package_name}\nTotal Value: LKR ${calculateTotal().toLocaleString()}\n\n*Payment gateway redirection pipeline points will connect here.*`,
        );
        setIsCheckoutModalOpen(false);
    };

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.log(
                    "Autoplay on hover blocked until user gesture interaction:",
                    err,
                );
            });
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <div
            className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-950 text-slate-100"
                    : "bg-slate-50 text-slate-900"
            }`}
        >
            <Head title="Enterprise Command Console" />

            <div>
                {/* SEPARATED HEADER */}
                <Header
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    auth={auth}
                />

                {/* HERO COVER HEADER */}
                <div className="relative bg-slate-900 text-white min-h-[40vh] flex items-center justify-center py-16 px-4 border-b border-slate-800 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
                    <div className="relative z-10 max-w-4xl w-full text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                            Pick your Enterprise Architecture
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-medium">
                            Select tailored configurations optimized with secure
                            execution loops engineered exclusively for growing
                            business nodes.
                        </p>
                    </div>
                </div>

                {/* MAIN LAYOUT WRAPPER ENVIRONMENT */}
                <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-16">
                    {/* ================= SECTOR 1: PACKAGES CARTS OVERVIEW ================= */}
                    <div className="space-y-6">
                        <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
                            <h2
                                className={`text-lg font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                            >
                                Available Packages & Modules
                            </h2>
                        </div>

                        {!packageCarts || packageCarts.length === 0 ? (
                            <div
                                className={`border border-dashed p-12 text-center rounded-xl ${isDarkMode ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-white border-slate-300 text-slate-500"}`}
                            >
                                <p className="text-xs font-semibold">
                                    No custom modules configured yet by the
                                    administration.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {packageCarts.map((cart) => (
                                    <div
                                        key={cart.id}
                                        className={`border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800 text-slate-100"
                                                : "bg-white border-slate-200 text-slate-900"
                                        }`}
                                    >
                                        <div className="p-6 space-y-2">
                                            <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                                                {cart.cart_name}
                                            </h3>
                                            <p
                                                className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                            >
                                                {cart.description}
                                            </p>
                                        </div>

                                        <div
                                            className={`p-4 border-t px-6 flex items-center justify-end ${isDarkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}
                                        >
                                            <button
                                                onClick={() =>
                                                    setSelectedCart(cart)
                                                }
                                                className={`w-full bg-gradient-to-r ${cart.color_class || "from-blue-500 to-indigo-600"} hover:brightness-110 text-white text-xs font-bold px-5 py-2.5 rounded text-center transition-all uppercase tracking-wider shadow-sm`}
                                            >
                                                {cart.button_name}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ================= SECTOR 2: CENTRAL OPERATIONS FRAMEWORK ================= */}
                    <div className="space-y-6">
                        <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
                            <h2
                                className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                            >
                                Central Operations Framework
                            </h2>
                        </div>

                        {navigationCards.length === 0 ? (
                            <div
                                className={`border border-dashed p-16 text-center rounded-xl ${isDarkMode ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-white border-slate-300 text-slate-500"}`}
                            >
                                <p className="text-sm font-medium">
                                    No sections deployed yet onto your main
                                    framework node dashboard.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {navigationCards.map((card) => (
                                    <div
                                        key={card.id}
                                        className={`border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm group ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                                                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`h-2 w-2 rounded-full bg-gradient-to-r ${card.accent_color}`}
                                                    />
                                                    <span
                                                        className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"}`}
                                                    >
                                                        System Node
                                                    </span>
                                                </div>
                                                <h3
                                                    className={`font-bold text-xl tracking-tight mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                                                >
                                                    {card.name}
                                                </h3>
                                                <p
                                                    className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                                >
                                                    {card.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={`p-4 border-t px-6 flex items-center justify-end ${isDarkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}
                                        >
                                            <button
                                                onClick={() =>
                                                    handleNavigate(card.path)
                                                }
                                                className={`w-full md:w-auto bg-gradient-to-r ${card.accent_color} hover:brightness-110 text-white text-xs font-bold px-5 py-2.5 rounded text-center transition-all uppercase tracking-wider shadow-sm flex items-center justify-center gap-2`}
                                            >
                                                <span>{card.button_text}</span>
                                                <svg
                                                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ==========================================================
                1. DYNAMIC MODAL POP-UP (STYLIZED EXACTLY AS THE ERP PAGE WORKSPACE)
            ========================================================== */}
            {selectedCart && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                    <div
                        className={`w-full max-w-6xl max-h-[92vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl transition-all duration-300 relative ${
                            isDarkMode
                                ? "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 border-slate-800 text-white"
                                : "bg-gradient-to-br from-slate-100 via-white to-slate-200/70 border-slate-200 text-slate-900"
                        }`}
                    >
                        {/* Modal Navigation/Control Bar */}
                        <div className="p-4 border-b flex items-center justify-between dark:border-slate-800 shrink-0 relative z-30">
                            <span className="text-xs font-black uppercase tracking-wider text-orange-500">
                                {selectedCart.cart_name} Node System
                            </span>
                            <button
                                onClick={() => setSelectedCart(null)}
                                className="text-xs font-black px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white/20 dark:bg-slate-900/60 hover:brightness-110"
                            >
                                Close Workspace ✕
                            </button>
                        </div>

                        {/* Scrollable View Matching ERP Layout Page */}
                        <div className="p-6 md:p-8 overflow-y-auto space-y-12 flex-1 relative">
                            {/* VIDEO HERO BANNER LAYER SECTION */}
                            <div
                                className="w-full relative z-20"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div
                                    onClick={() => {
                                        if (
                                            selectedCart.packages &&
                                            selectedCart.packages.length > 0 &&
                                            selectedCart.packages[0]
                                                .youtube_link
                                        ) {
                                            setActiveVideoId(
                                                extractVideoId(
                                                    selectedCart.packages[0]
                                                        .youtube_link,
                                                ),
                                            );
                                        }
                                        setIsVideoModalOpen(true);
                                    }}
                                    className={`w-full h-52 md:h-80 rounded-2xl overflow-hidden shadow-md border cursor-pointer group relative transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl ${
                                        isDarkMode
                                            ? "border-slate-800 bg-slate-900/40 backdrop-blur-md"
                                            : "border-slate-200/60 bg-white/60 backdrop-blur-md"
                                    }`}
                                >
                                    <video
                                        ref={videoRef}
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
                                    </video>

                                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors duration-300" />

                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                                            System Guide Video
                                        </span>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="p-4 bg-orange-500 text-white rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-600 active:scale-95 animate-pulse group-hover:animate-none">
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

                                    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                                        <div>
                                            <h2 className="text-white text-lg md:text-xl font-black tracking-tight drop-shadow-md">
                                                Explore{" "}
                                                {selectedCart.packages &&
                                                selectedCart.packages.length > 0
                                                    ? selectedCart.packages[0]
                                                          .main_topic
                                                    : "Enterprise Solutions"}
                                            </h2>
                                            <p className="text-slate-200 text-[10px] font-semibold mt-0.5 hidden sm:block drop-shadow-sm">
                                                Hover to scan preview footage •
                                                Click to initialize full theater
                                                layout view
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Header Main Titles & Descriptions Block */}
                            <div className="text-center space-y-2 relative z-10">
                                <h3
                                    className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                                >
                                    Pick your Enterprise Architecture
                                </h3>
                                <p
                                    className={`max-w-xl mx-auto text-xs transition-colors duration-500 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                                >
                                    {selectedCart.packages &&
                                    selectedCart.packages.length > 0
                                        ? selectedCart.packages[0]
                                              .small_description
                                        : selectedCart.description}
                                </p>
                            </div>

                            {/* Dynamic Package Cards Grid Matrix */}
                            {!selectedCart.packages ||
                            selectedCart.packages.length === 0 ? (
                                <p className="text-xs text-center opacity-50 italic py-6">
                                    No specific variants have been deployed into
                                    this dynamic feed matrix yet.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch relative z-10">
                                    {selectedCart.packages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            className={`rounded-2xl border p-6 flex flex-col justify-between relative group transform transition-all duration-500 ease-in-out hover:-translate-y-1.5 hover:shadow-xl ${
                                                isDarkMode
                                                    ? "bg-slate-900/80 border-slate-800 text-white hover:border-orange-500/40 hover:shadow-orange-500/5"
                                                    : "bg-white/90 border-slate-200/80 text-slate-900 hover:border-orange-500/30 hover:shadow-slate-300/60"
                                            }`}
                                        >
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="text-base font-extrabold tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                                                        {pkg.package_name}
                                                    </h4>
                                                    <span
                                                        className={`text-[10px] font-black px-2 py-0.5 rounded transition-colors duration-500 ${isDarkMode ? "bg-slate-800 text-orange-400" : "bg-slate-200/60 text-orange-600"}`}
                                                    >
                                                        ⭐{" "}
                                                        {parseFloat(
                                                            pkg.rating || 5.0,
                                                        ).toFixed(1)}
                                                    </span>
                                                </div>

                                                <div className="mb-4">
                                                    <span className="text-2xl font-black tracking-tight text-orange-500 transition-transform duration-300 inline-block group-hover:scale-105">
                                                        LKR{" "}
                                                        {parseFloat(
                                                            pkg.price,
                                                        ).toLocaleString()}
                                                    </span>
                                                    <span className="text-slate-400 text-[10px] font-bold block mt-0.5">
                                                        / month
                                                    </span>
                                                </div>

                                                <hr
                                                    className={`my-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
                                                />

                                                {/* Target Suitability */}
                                                <div className="mb-4">
                                                    <h5 className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1">
                                                        Suitable For
                                                    </h5>
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${isDarkMode ? "bg-orange-950/40 text-orange-400" : "bg-orange-50 text-orange-700"}`}
                                                    >
                                                        {pkg.suitable_business}
                                                    </span>
                                                </div>

                                                {/* Features list */}
                                                <div className="mb-4 text-xs font-medium space-y-1">
                                                    <h5 className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1.5">
                                                        Core Feature Sets
                                                    </h5>
                                                    <p
                                                        className={`text-[11px] leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                                                    >
                                                        {pkg.core_features}
                                                    </p>
                                                </div>

                                                {/* Benefits block */}
                                                <div className="text-xs font-medium space-y-1">
                                                    <h5 className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1">
                                                        Core Benefits
                                                    </h5>
                                                    <div
                                                        className={`p-3 rounded-xl border text-[11px] leading-relaxed ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100/70 border-slate-200/60 text-slate-500"}`}
                                                    >
                                                        {pkg.benefits}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative z-10 mt-5">
                                                <button
                                                    onClick={() =>
                                                        handleBuyButtonClick(
                                                            pkg,
                                                        )
                                                    }
                                                    className="w-full text-center py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 active:scale-[0.98]"
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
                2. INTEGRATED PREMIUM BILLING SETUP CONFIRMATION MODAL
            ========================================================== */}
            {isCheckoutModalOpen && selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                    <div
                        className={`w-full max-w-2xl rounded-2xl overflow-hidden border shadow-2xl flex flex-col max-h-[90vh] ${isDarkMode ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"}`}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-inherit">
                            <div>
                                <h3 className="text-lg font-black tracking-tight">
                                    Configure Your Plan
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Customize your cloud deployment premium
                                    setup add-ons before billing confirmation.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="p-1.5 rounded-lg border dark:border-slate-800 text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            <div
                                className={`p-4 rounded-xl border flex justify-between items-center ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"}`}
                            >
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-orange-500">
                                        Selected Base Plan
                                    </span>
                                    <h4 className="text-md font-extrabold mt-0.5">
                                        {selectedPackage.package_name}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-orange-500">
                                        LKR{" "}
                                        {parseFloat(
                                            selectedPackage.price,
                                        ).toLocaleString()}
                                    </span>
                                    <span className="text-slate-400 text-[10px] block">
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
                                                className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${isChecked ? "border-orange-500/50 bg-orange-500/[0.02]" : "dark:border-slate-800 bg-transparent hover:border-slate-700"}`}
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
                                                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded ml-1.5 bg-slate-800 text-slate-300">
                                                                {service.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-1">
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
                            className={`p-6 border-t border-inherit flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isDarkMode ? "bg-slate-950/40" : "bg-slate-50"}`}
                        >
                            <div>
                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                                    Total Estimated Value
                                </span>
                                <div className="text-2xl font-black text-orange-500 tracking-tight">
                                    LKR {calculateTotal().toLocaleString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setIsCheckoutModalOpen(false)
                                    }
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePaymentConfirm}
                                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                                >
                                    Confirm Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
                3. THEATER PLAYER IFRAME LINK REDIRECTION POP-UP MODAL
            ========================================================== */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
                    <div
                        className={`w-full max-w-4xl rounded-2xl overflow-hidden border shadow-2xl relative ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
                            <h3 className="text-sm font-black uppercase tracking-wider text-orange-500">
                                Walkthrough Framework Overview Player
                            </h3>
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                className="p-1.5 rounded-lg border text-slate-400 hover:text-slate-200"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="relative w-full aspect-video bg-black">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                                title="System Walkthrough Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* SHARED VISUAL FOOTER */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
