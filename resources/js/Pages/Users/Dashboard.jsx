import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Dashboard({
    auth,
    navigationCards = [],
    activeSubscription = null,
    erpAppUrl = "http://localhost:5173",
    flashPayment = null, // Injected securely via DashboardController session flash
    newAccountActivated = false,
    erpLoginEmail = null,
    erpProvisioned = false,
    flashPlanName = null,
}) {
    // UI Theme state controls
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    const [showHistory, setShowHistory] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(Boolean(newAccountActivated));

    // Admin accounts always have active status and full platform access
    const isAdmin = auth?.user?.role === "admin";
    const isSubActive = isAdmin || Boolean(activeSubscription?.is_active);

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
                    NEW ACCOUNT ACTIVATION CELEBRATION MODAL
                ========================================================== */}
                {showWelcomeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                        <div
                            className={`w-full max-w-md rounded-2xl border p-6 text-center shadow-2xl relative ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-white"
                                    : "bg-white border-slate-200 text-slate-900"
                            }`}
                        >
                            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100/70 dark:bg-emerald-950/60 dark:text-emerald-400 px-3 py-1 rounded-full inline-block mb-2">
                                Account Created & Plan Activated
                            </span>
                            <h3 className="text-xl font-black tracking-tight mb-2">
                                Welcome, {auth?.user?.name || "Partner"}!
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto mb-4">
                                Your{" "}
                                <strong className="text-slate-900 dark:text-white">
                                    {flashPlanName || activeSubscription?.plan_name || "ERP Free Starter"}
                                </strong>{" "}
                                plan has been activated.
                            </p>

                            {/* ERP Login Email Display */}
                            {erpLoginEmail && (
                                <div className={`rounded-xl p-4 mb-4 text-left ${
                                    isDarkMode
                                        ? "bg-slate-800 border border-slate-700"
                                        : "bg-slate-50 border border-slate-200"
                                }`}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                                        Your Nexus ERP Login Email
                                    </p>
                                    <p className="text-sm font-black font-mono text-orange-600 dark:text-orange-400">
                                        {erpLoginEmail}
                                    </p>
                                </div>
                            )}

                            {/* Credentials Email Notice */}
                            <div className={`rounded-xl p-3 mb-5 ${
                                isDarkMode
                                    ? "bg-amber-950/40 border border-amber-800/50"
                                    : "bg-amber-50 border border-amber-200"
                            }`}>
                                <div className="flex items-start gap-2 text-left">
                                    <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
                                        A secure login password has been sent to your email. Use it to access the ERP system. You can change it anytime from Settings.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href={erpAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setShowWelcomeModal(false)}
                                    className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                                >
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
                                    <span>Access ERP System</span>
                                </a>
                                <button
                                    onClick={() => setShowWelcomeModal(false)}
                                    className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                                        isDarkMode
                                            ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                                            : "border-slate-200 hover:bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    View Portal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                            <div className="w-full md:w-auto shrink-0 flex flex-wrap gap-3">
                                {/* DIRECT LAUNCH TO ERP WORKSPACE */}
                                <a
                                    href={erpAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                                >
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
                                    <span>Launch ERP Workspace</span>
                                </a>

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

                {/* HERO COVER HEADER WITH PERSONALIZED WELCOME */}
                <div
                    className="relative min-h-[38vh] flex items-center justify-center py-16 px-4 border-b border-slate-800 overflow-hidden bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/img/hero-bg.jpg')" }}
                >
                    <div className="absolute inset-0 bg-slate-950/75 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
                    <div className="relative z-10 max-w-4xl w-full text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                            Nexus ERP Customer Portal
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                            Manage your active subscription, expand capacity limits, download tax receipts, and launch your central ERP business operations.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            {auth?.user && isSubActive ? (
                                <>
                                    <a
                                        href={erpAppUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
                                    >
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
                                        <span>Launch Nexus ERP Dashboard</span>
                                    </a>
                                    {isAdmin ? (
                                        <button
                                            onClick={() => handleNavigate("/admin/erp-packages")}
                                            className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all backdrop-blur-sm flex items-center justify-center cursor-pointer"
                                        >
                                            <span>Manage Packages in Admin</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleNavigate("/ERP")}
                                            className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all backdrop-blur-sm flex items-center justify-center cursor-pointer"
                                        >
                                            <span>Upgrade / Change Plan</span>
                                        </button>
                                    )}
                                </>
                            ) : auth?.user && !isSubActive ? (
                                <>
                                    <a
                                        href={`https://wa.me/94777674308?text=${encodeURIComponent("Customer ID: " + (auth?.user?.customer_id || "N/A") + "\nBusiness: " + (auth?.user?.business_name || auth?.user?.name || "N/A") + "\n\nHello, my ERP subscription has expired. I would like to reactivate my plan via WhatsApp. Thank you.")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/25 flex items-center gap-2.5 transition-all cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        <span>Subscription Expired - Reactivate via WhatsApp</span>
                                    </a>
                                    <button
                                        onClick={() => handleNavigate("/ERP")}
                                        className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all backdrop-blur-sm flex items-center justify-center cursor-pointer"
                                    >
                                        <span>Change Plan</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleNavigate("/ERP")}
                                        className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <span>Explore ERP Plans & Pricing</span>
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
                                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleNavigate("/register")}
                                        className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all backdrop-blur-sm flex items-center justify-center cursor-pointer"
                                    >
                                        <span>Create Account</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* MAIN LAYOUT WRAPPER ENVIRONMENT */}
                <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-16">
                    {/* ================= ACTIVE SUBSCRIPTION & QUOTA METER CARD (REGISTERED USERS ONLY) ================= */}
                    {auth?.user && activeSubscription && (
                        <div
                            className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all duration-300 relative overflow-hidden ${
                                isDarkMode
                                    ? "bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-slate-800"
                                    : "bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 border-orange-100 shadow-orange-500/5"
                            }`}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                                isSubActive
                                    ? "bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500"
                                    : "bg-red-500"
                            }`} />

                            {!isSubActive && (
                                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                        <span>Your subscription has expired or is currently locked. ERP system access is suspended. Please contact us via WhatsApp to reactivate.</span>
                                    </div>
                                    <a
                                        href={`https://wa.me/94777674308?text=${encodeURIComponent("Customer ID: " + (auth?.user?.customer_id || "N/A") + "\nBusiness: " + (auth?.user?.business_name || auth?.user?.name || "N/A") + "\n\nHello, my ERP subscription has expired. I would like to reactivate my plan via WhatsApp. Thank you.")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shrink-0 shadow-xs cursor-pointer"
                                    >
                                        Reactivate on WhatsApp
                                    </a>
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-inherit">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm">
                                            {activeSubscription.plan_name}
                                        </span>
                                        {isSubActive ? (
                                            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                Active License
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                                Subscription Expired
                                            </span>
                                        )}
                                    </div>
                                    <h3
                                        className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                                    >
                                        {auth?.user?.business_name || "Enterprise Workspace"}
                                    </h3>
                                    {activeSubscription.expires_at && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            Valid until:{" "}
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {new Date(
                                                    activeSubscription.expires_at,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                    {isSubActive ? (
                                        <a
                                            href={erpAppUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
                                        >
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
                                            <span>Open ERP System</span>
                                        </a>
                                    ) : (
                                        <a
                                            href={`https://wa.me/94777674308?text=${encodeURIComponent("Customer ID: " + (auth?.user?.customer_id || "N/A") + "\nBusiness: " + (auth?.user?.business_name || auth?.user?.name || "N/A") + "\n\nHello, my ERP subscription has expired. I would like to reactivate my plan via WhatsApp. Thank you.")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-initial px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                            </svg>
                                            <span>Reactivate via WhatsApp</span>
                                        </a>
                                    )}
                                    {isAdmin ? (
                                        <button
                                            onClick={() => handleNavigate("/admin/erp-packages")}
                                            className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center cursor-pointer ${
                                                isDarkMode
                                                    ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                                            }`}
                                        >
                                            <span>Manage Packages in Admin</span>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleNavigate("/ERP")}
                                                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center cursor-pointer ${
                                                    isDarkMode
                                                        ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                                                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                                                }`}
                                            >
                                                <span>Change Plan</span>
                                            </button>
                                            <a
                                                href={`https://wa.me/94777674308?text=${encodeURIComponent("Customer ID: " + (auth?.user?.customer_id || "N/A") + "\nBusiness: " + (auth?.user?.business_name || auth?.user?.name || "N/A") + "\n\nHello, I would like to manage/cancel my ERP subscription. Thank you.")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                                    isDarkMode
                                                        ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                                                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                                                }`}
                                            >
                                                <svg className="w-3.5 h-3.5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                </svg>
                                                <span>Manage / Cancel</span>
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Live Quota Limits Grid */}
                            <div className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Allocated Resource Limits & Quotas
                                    </h4>
                                    <button
                                        onClick={() => handleNavigate("/ERP")}
                                        className="text-[11px] font-bold text-orange-500 hover:underline cursor-pointer flex items-center gap-1 group"
                                    >
                                        <span>Need higher capacity? Upgrade plan</span>
                                        <svg
                                            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Branches */}
                                    <div
                                        className={`p-4 rounded-2xl border transition-all ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-100 shadow-xs"}`}
                                    >
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                                Branches
                                            </span>
                                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009 9.35c.697 0 1.348-.239 1.875-.644a2.992 2.992 0 003.75.644c.527.405 1.178.644 1.875.644a3.001 3.001 0 003.75-.615V21"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white">
                                            {activeSubscription.usage?.branches || 1}{" "}
                                            <span className="text-xs font-bold text-slate-400">
                                                / {activeSubscription.limits?.branches}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                            Physical stores & retail outlets
                                        </p>
                                    </div>

                                    {/* Warehouses */}
                                    <div
                                        className={`p-4 rounded-2xl border transition-all ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-100 shadow-xs"}`}
                                    >
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                                Warehouses
                                            </span>
                                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white">
                                            {activeSubscription.usage?.warehouses || 1}{" "}
                                            <span className="text-xs font-bold text-slate-400">
                                                / {activeSubscription.limits?.warehouses}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                            Storage nodes & stockrooms
                                        </p>
                                    </div>

                                    {/* Users */}
                                    <div
                                        className={`p-4 rounded-2xl border transition-all ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-100 shadow-xs"}`}
                                    >
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                                User Seats
                                            </span>
                                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white">
                                            {activeSubscription.usage?.users || 1}{" "}
                                            <span className="text-xs font-bold text-slate-400">
                                                / {activeSubscription.limits?.users}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                            Cashiers, managers & admins
                                        </p>
                                    </div>

                                    {/* Monthly Bills */}
                                    <div
                                        className={`p-4 rounded-2xl border transition-all ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-100 shadow-xs"}`}
                                    >
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                                Monthly Bills
                                            </span>
                                            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-lg font-black text-slate-900 dark:text-white truncate">
                                            {activeSubscription.limits?.bills}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                            Sales invoices & POS quota
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= GUEST ONBOARDING CARD (UNREGISTERED VISITORS ONLY) ================= */}
                    {!auth?.user && (
                        <div
                            className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all duration-300 relative overflow-hidden ${
                                isDarkMode
                                    ? "bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-slate-800"
                                    : "bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 border-orange-100 shadow-orange-500/5"
                            }`}
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500" />
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="space-y-2 max-w-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                            Nexus Enterprise Ecosystem
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            30-Day Free Trial Available
                                        </span>
                                    </div>
                                    <h3
                                        className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                                    >
                                        Ready to Activate Your ERP Workspace?
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        Choose an ERP subscription plan or start with our 30-day free sandbox evaluation. Once registered, your company account will immediately unlock access to the full ERP system, high-speed POS billing, and real-time inventory.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                                    <button
                                        onClick={() => handleNavigate("/ERP")}
                                        className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                                    >
                                        <span>View Plans & Pricing</span>
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
                                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleNavigate("/register")}
                                        className={`px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                            isDarkMode
                                                ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-white"
                                                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                                        }`}
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* SHARED VISUAL FOOTER */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
