import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import axios from "axios";

export default function Dashboard({
    auth,
    navigationCards = [],
    packageCarts = [],
    services = [],
    flashPayment = null, // Injected securely via DashboardController session flash
}) {
    // UI Theme state controls
    const [isDarkMode, setIsDarkMode] = useState(false);

    // State to manage the open package pop-up window overlay
    const [selectedCart, setSelectedCart] = useState(null);

    // Video Player Interaction Tracking Parameters
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [activeVideoId, setActiveVideoId] = useState("dQw4w9WgXcQ");
    const videoRef = useRef(null);

    // ==================== CHECKOUT MATRIX STATE ====================
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    // ==================== POST-PAYMENT SUCCESS STATE ====================
    const [paymentSuccessData, setPaymentSuccessData] = useState(null);

    // Securely catches flash indicators passed down from server session memory
    useEffect(() => {
        if (flashPayment && flashPayment.order_id) {
            setPaymentSuccessData({
                order_id: flashPayment.order_id,
                package_name:
                    flashPayment.items || "Selected Architecture Package",
                amount: flashPayment.amount || "0.00",
            });
        }
    }, [flashPayment]);

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

    // Helper utility to parse YouTube watch links safely
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

    // Helper function to calculate final discounted price cleanly
    const getDiscountedPrice = (price, discountPercentage) => {
        const basePrice = Number(price);
        const discount = Number(discountPercentage || 0);
        const finalCalculatedPrice = basePrice - basePrice * (discount / 100);
        return Math.round(finalCalculatedPrice * 100) / 100;
    };

    // Calculate total layout checkout configuration values dynamically
    const calculateTotal = () => {
        if (!selectedPackage) return 0;

        let total = getDiscountedPrice(
            selectedPackage.price,
            selectedPackage.discount_percentage,
        );

        services.forEach((srv) => {
            if (selectedServices.includes(srv.id)) {
                total += Number(srv.price);
            }
        });
        return total;
    };

    // Single production-ready PayHere Sandbox submission hook
    const handlePaymentConfirm = () => {
        const basePlanPrice = getDiscountedPrice(
            selectedPackage.price,
            selectedPackage.discount_percentage,
        );

        axios
            .post("/checkout/initialize", {
                package_id: selectedPackage.id,
                package_name: selectedPackage.package_name,
                base_price: basePlanPrice,
                addon_ids: selectedServices,
            })
            .then((response) => {
                const data = response.data;

                // Generate an automatic form element to submit parameters securely to PayHere
                const form = document.createElement("form");
                form.setAttribute("method", "post");
                form.setAttribute(
                    "action",
                    data.sandbox
                        ? "https://sandbox.payhere.lk/pay/checkout"
                        : "https://www.payhere.lk/pay/checkout",
                );

                // Bind backend parameters into structured input payloads
                Object.keys(data).forEach((key) => {
                    if (key !== "sandbox") {
                        const hiddenField = document.createElement("input");
                        hiddenField.setAttribute("type", "hidden");
                        hiddenField.setAttribute("name", key);
                        hiddenField.setAttribute("value", data[key]);
                        form.appendChild(hiddenField);
                    }
                });

                document.body.appendChild(form);
                setIsCheckoutModalOpen(false);

                // Redirect browser directly to the PayHere Portal
                form.submit();
            })
            .catch((error) => {
                console.error("Payment initialization gateway error: ", error);
                alert(
                    "Failed to establish checkout secure loop stream connection.",
                );
            });
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

                {/* ==========================================================
                    SUCCESSFUL TRANSACTION RECEIPT BANNER NOTIFICATION 
                ========================================================== */}
                {paymentSuccessData && (
                    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 animate-fadeIn">
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-start gap-4 text-center md:text-left">
                                <div className="p-3 bg-emerald-500 text-white rounded-full mx-auto md:mx-0 shadow-sm">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-emerald-900 dark:text-emerald-400 text-base">
                                        Payment Verification Successful!
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                        Order ID:{" "}
                                        <span className="font-bold tracking-tight text-slate-900 dark:text-white">
                                            {paymentSuccessData.order_id}
                                        </span>{" "}
                                        • Your system operational nodes are
                                        compiling now.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-auto shrink-0 flex gap-3">
                                {/* PROP-BOUND TOTAL SECURED TO RETRIEVE ACCURATE TRANSACTIONS */}
                                <a
                                    href={`/checkout/receipt/download?order_id=${paymentSuccessData.order_id}&package_name=${encodeURIComponent(paymentSuccessData.package_name)}&total_amount=${paymentSuccessData.amount}`}
                                    className="w-full md:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    <span>Download PDF Receipt</span>
                                </a>

                                <button
                                    onClick={() => setPaymentSuccessData(null)}
                                    className="px-3 py-3 border border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs rounded-xl font-bold"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                                ? "bg-slate-900 border-slate-800"
                                                : "bg-white border-slate-200"
                                        }`}
                                    >
                                        <div className="p-6 space-y-2">
                                            <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                                                {cart.cart_name}
                                            </h3>
                                            <p
                                                className={`text-xs leading-relaxed text-slate-600 dark:text-slate-400`}
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
                                                style={{ color: "#ffffff" }}
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
                DYNAMIC WORKSPACE DETAIL pop-up MODAL
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
                        {/* Modal Header */}
                        <div className="p-4 border-b flex items-center justify-between dark:border-slate-800 shrink-0 relative z-30">
                            <span className="text-xs font-black uppercase tracking-wider text-orange-500">
                                {selectedCart.cart_name} Node System
                            </span>
                            <button
                                onClick={() => setSelectedCart(null)}
                                className="text-xs font-black px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white/20 dark:bg-slate-900/60 text-slate-900 dark:text-white hover:brightness-110"
                            >
                                Close Workspace ✕
                            </button>
                        </div>

                        {/* Modal Content Space */}
                        <div className="p-6 md:p-8 overflow-y-auto space-y-12 flex-1 relative">
                            {/* HOVER HOVER AUTOPLAY OVERVIEW WALKTHROUGH PREVIEW BOX */}
                            <div
                                className="w-full relative z-20"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div
                                    onClick={() => {
                                        if (selectedCart.youtube_link) {
                                            setActiveVideoId(
                                                extractVideoId(
                                                    selectedCart.youtube_link,
                                                ),
                                            );
                                            setIsVideoModalOpen(true);
                                        } else {
                                            alert(
                                                "No walkthrough tutorial video configured for this node category stack.",
                                            );
                                        }
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
                                                Click to load full layout viewer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TEXT HEADINGS */}
                            <div className="text-center space-y-2 relative z-10">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {selectedCart.cart_name}
                                </h3>
                                <p className="max-w-xl mx-auto text-xs text-slate-600 dark:text-slate-400">
                                    {selectedCart.description}
                                </p>
                            </div>

                            {/* NESTED PACKAGES PRICING MATRIX GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch relative z-10">
                                {selectedCart.packages &&
                                selectedCart.packages.length === 0 ? (
                                    <div className="col-span-full text-center py-12 opacity-60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        No structural architecture modules
                                        configured under this segment node yet.
                                    </div>
                                ) : (
                                    selectedCart.packages &&
                                    selectedCart.packages.map((pkg) => {
                                        const hasDiscount =
                                            Number(pkg.discount_percentage) > 0;
                                        const finalPrice = getDiscountedPrice(
                                            pkg.price,
                                            pkg.discount_percentage,
                                        );

                                        return (
                                            <div
                                                key={pkg.id}
                                                className={`rounded-2xl border p-6 flex flex-col justify-between relative group transform transition-all duration-500 ease-in-out hover:-translate-y-1.5 hover:shadow-xl ${
                                                    isDarkMode
                                                        ? "bg-slate-900/80 border-slate-800 text-white hover:border-orange-500/40"
                                                        : "bg-white/90 border-slate-200/80 text-slate-900 hover:border-orange-500/30"
                                                }`}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="text-base font-extrabold tracking-tight group-hover:text-orange-500 text-slate-900 dark:text-white transition-colors duration-300">
                                                            {pkg.package_name}
                                                        </h4>
                                                        <span
                                                            className={`text-[10px] font-black px-2 py-0.5 rounded ${isDarkMode ? "bg-slate-800 text-orange-400" : "bg-slate-200/60 text-orange-600"}`}
                                                        >
                                                            ⭐{" "}
                                                            {parseFloat(
                                                                pkg.rating ||
                                                                    5.0,
                                                            ).toFixed(1)}
                                                        </span>
                                                    </div>

                                                    <div className="mb-4">
                                                        {hasDiscount ? (
                                                            <div className="space-y-0.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-2xl font-black tracking-tight text-orange-500">
                                                                        LKR{" "}
                                                                        {finalPrice.toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                            },
                                                                        )}
                                                                    </span>
                                                                    <span className="text-xs line-through opacity-50 font-bold text-slate-500">
                                                                        LKR{" "}
                                                                        {Number(
                                                                            pkg.price,
                                                                        ).toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                            },
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {pkg.discount_description && (
                                                                    <span className="text-[10px] text-red-500 font-extrabold block uppercase tracking-wide">
                                                                        🔥{" "}
                                                                        {
                                                                            pkg.discount_description
                                                                        }{" "}
                                                                        (-
                                                                        {Number(
                                                                            pkg.discount_percentage,
                                                                        )}
                                                                        %)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-2xl font-black tracking-tight text-orange-500">
                                                                LKR{" "}
                                                                {Number(
                                                                    pkg.price,
                                                                ).toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    },
                                                                )}
                                                            </span>
                                                        )}
                                                        <span className="text-slate-400 text-[10px] block mt-0.5">
                                                            / month
                                                        </span>
                                                    </div>

                                                    <hr
                                                        className={`my-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
                                                    />

                                                    <div className="mb-4">
                                                        <h5 className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1">
                                                            Suitable For
                                                        </h5>
                                                        <span
                                                            className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${isDarkMode ? "bg-orange-950/40 text-orange-400" : "bg-orange-50 text-orange-700"}`}
                                                        >
                                                            {
                                                                pkg.suitable_business
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="mb-4 text-xs font-medium space-y-1">
                                                        <h5 className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1.5">
                                                            Core Feature Sets
                                                        </h5>
                                                        <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                                                            {pkg.core_features}
                                                        </p>
                                                    </div>

                                                    <div className="text-xs font-medium space-y-1">
                                                        <h5 className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1">
                                                            Core Benefits
                                                        </h5>
                                                        <div
                                                            className={`p-3 rounded-xl border text-[11px] leading-relaxed ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100/70 border-slate-200/60 text-slate-600"}`}
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
                                                        className="w-full text-center py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 hover:bg-orange-500 dark:bg-orange-600"
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
                2. BILLING CHECKOUT CONFIGURATION MODAL
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
                                    Customize deployment premium features before
                                    checking out.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="p-1.5 rounded-lg border text-slate-400"
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
                                        {getDiscountedPrice(
                                            selectedPackage.price,
                                            selectedPackage.discount_percentage,
                                        ).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* PREMIUM INVENTORY ADDON CHECKS */}
                            <div>
                                <h4 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-3">
                                    Available Premium Add-ons
                                </h4>
                                {services.length === 0 ? (
                                    <p className="text-xs text-slate-400 font-medium py-2">
                                        No modular extensions deployed under
                                        catalog node layers.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {services.map((service) => {
                                            const isChecked =
                                                selectedServices.includes(
                                                    service.id,
                                                );
                                            return (
                                                <label
                                                    key={service.id}
                                                    className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${isChecked ? "border-orange-500/50 bg-orange-500/[0.02]" : "dark:border-slate-800 bg-transparent"}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            handleServiceToggle(
                                                                service.id,
                                                            )
                                                        }
                                                        className="mt-1 w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">
                                                                {service.name}
                                                            </span>
                                                            <span className="text-xs font-extrabold text-orange-500">
                                                                +LKR{" "}
                                                                {Number(
                                                                    service.price,
                                                                ).toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    },
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 mt-1">
                                                            {
                                                                service.description
                                                            }
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
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
                                    LKR{" "}
                                    {calculateTotal().toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setIsCheckoutModalOpen(false)
                                    }
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold border text-slate-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePaymentConfirm}
                                    className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                                >
                                    Confirm Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================================
                3. THEATER PLAYER CONTROL MODAL
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
                                className="p-1.5 rounded-lg border text-slate-400"
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
