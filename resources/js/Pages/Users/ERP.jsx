import React, { useState, useEffect } from "react";
import axios from "axios";
import { Head } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useT } from "@/hooks/useT";
import { useLanguage } from "@/Context/LanguageContext";

export default function ERP({ auth, packages = [] }) {
    // Default theme is light
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("user_theme_chosen")) {
                return false;
            }
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    // Billing Cycle Switcher: "monthly" | "annual" (Save 17% / 2 Months Free)
    const [billingCycle, setBillingCycle] = useState("monthly");

    const t = useT();

    // Checkout & Payment State
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Auto-open checkout modal if redirected back with ?checkout=
    useEffect(() => {
        if (typeof window !== "undefined" && packages && packages.length > 0) {
            const params = new URLSearchParams(window.location.search);
            const checkoutParam = params.get("checkout");
            const cycleParam = params.get("cycle");
            if (cycleParam && (cycleParam === "monthly" || cycleParam === "annual")) {
                setBillingCycle(cycleParam);
            }
            if (checkoutParam) {
                const found = packages.find(
                    (p) =>
                        p.name.toLowerCase().includes(checkoutParam.toLowerCase()) ||
                        String(p.id) === checkoutParam
                );
                if (found) {
                    setSelectedPackage(found);
                    setIsCheckoutModalOpen(true);
                }
            }
        }
    }, [packages]);

    // Dynamically Inject PayHere SDK Script
    useEffect(() => {
        const scriptId = "payhere-sdk";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://www.payhere.lk/lib/payhere.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // Professional Services removed — no fake add-ons
    const additionalServices = [];

    const parseMeta = (inputString) => {
        if (!inputString) return [];
        const delimiter = inputString.includes("|") ? "|" : ",";
        return inputString
            .split(delimiter)
            .map((str) => str.trim())
            .filter(Boolean);
    };

    // Calculate dynamic price based on Monthly vs Annual billing
    const getPackagePrice = (pkg, cycle = billingCycle) => {
        const base = Number(pkg.price);
        if (base === 0) return 0;
        if (cycle === "annual") {
            // Annual prepay: 10 months list price (2 months free / ~17% savings)
            return base * 10;
        }
        return base;
    };

    const getOriginalAnnualPrice = (pkg) => {
        return Number(pkg.price) * 12;
    };

    const getAnnualSavings = (pkg) => {
        return Number(pkg.price) * 2;
    };

    // Hard Limits metadata helper for structured card rendering
    const getPackageLimits = (pkg) => {
        if (!pkg) return [];

        const pkgName = typeof pkg === "string" ? pkg : (pkg.name || "");
        const code = (pkg.code || "").toLowerCase();

        // 1. Identify standard plans by code or name first to ensure accurate limits
        if (code === "free" || pkgName.includes("Free")) {
            return [
                { label: "1 Branch", icon: "store" },
                { label: "1 Warehouse", icon: "warehouse" },
                { label: "2 Users", icon: "users" },
                { label: "100 Items & Bills", icon: "box" },
            ];
        }
        if (code === "basic" || pkgName.includes("Basic")) {
            return [
                { label: "1 Branch", icon: "store" },
                { label: "2 Warehouses", icon: "warehouse" },
                { label: "5 Users", icon: "users" },
                { label: "Unlimited Bills", icon: "box" },
            ];
        }
        if (code === "pro" || pkgName.includes("Professional")) {
            return [
                { label: "5 Branches", icon: "store" },
                { label: "10 Warehouses", icon: "warehouse" },
                { label: "20 Users (RBAC)", icon: "users" },
                { label: "Unlimited Bills", icon: "box" },
            ];
        }
        if (code === "enterprise" || pkgName.includes("Enterprise") || pkgName.includes("Custom")) {
            return [
                { label: "Unlimited Branches", icon: "store" },
                { label: "Unlimited Stores", icon: "warehouse" },
                { label: "50+ Users", icon: "users" },
                { label: "Unlimited Bills", icon: "box" },
            ];
        }

        // 2. Custom packages with distinct database limits
        if (pkg.max_branches !== undefined && pkg.max_branches !== null) {
            const formatLimit = (val, singular, plural, unlimitedLabel = "Unlimited") => {
                if (val === -1) return `${unlimitedLabel} ${plural}`;
                return `${val} ${val === 1 ? singular : plural}`;
            };
            return [
                { label: formatLimit(pkg.max_branches, "Branch", "Branches"), icon: "store" },
                { label: formatLimit(pkg.max_warehouses, "Warehouse", "Warehouses"), icon: "warehouse" },
                { label: pkg.max_users === -1 ? "Unlimited Users" : `${pkg.max_users} Users`, icon: "users" },
                { label: pkg.max_monthly_bills === -1 ? "Unlimited Bills" : `${pkg.max_monthly_bills} Bills`, icon: "box" },
            ];
        }

        return [
            { label: "1 Branch", icon: "store" },
            { label: "1 Warehouse", icon: "warehouse" },
            { label: "2 Users", icon: "users" },
            { label: "Unlimited Bills", icon: "box" },
        ];
    };

    const WHATSAPP_NUMBER = "94777674308"; // 077 767 4308 in international format

    const handleBuyButtonClick = (pkg) => {
        // Admin manages packages directly in the admin panel
        if (auth?.user?.role === "admin") {
            window.location.href = "/admin/erp-packages";
            return;
        }

        // Require sign in / sign up before any purchase action
        if (!auth?.user) {
            window.location.href = `/register?plan=${encodeURIComponent(pkg.name)}`;
            return;
        }

        const pkgPrice = Number(pkg.price) || 0;

        if (pkgPrice === 0) {
            // Free plan -- open checkout modal for self-service registration
            setSelectedPackage(pkg);
            setSelectedServices([]);
            setIsCheckoutModalOpen(true);
            return;
        }

        // Paid plans -- open WhatsApp with pre-filled inquiry message
        const customerId = auth?.user?.customer_id || "N/A";
        const businessName = auth?.user?.business_name || auth?.user?.name || "N/A";
        const priceFormatted = `LKR ${pkgPrice.toLocaleString()}`;
        const cycle = billingCycle === "annual" ? "Annual" : "Monthly";
        const periodUnit = billingCycle === "annual" ? "/year" : "/month";
        const message = `Customer ID: ${customerId}\nBusiness: ${businessName}\n\nHello, I am interested in purchasing the *${pkg.name}* package (${priceFormatted}${periodUnit}, ${cycle} billing). I would like to discuss the details and proceed with the purchase. Thank you.`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
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
        let total = getPackagePrice(selectedPackage, billingCycle);

        additionalServices.forEach((srv) => {
            if (selectedServices.includes(srv.id)) {
                total += srv.price;
            }
        });
        return total;
    };

    // PayHere Gateway Checkout Handler
    const handlePaymentConfirm = async () => {
        if (!selectedPackage) return;

        // If user is not logged in, redirect to Create Account page with selected plan parameters
        if (!auth?.user) {
            let planSlug = "free";
            const lowerName = selectedPackage.name.toLowerCase();
            if (lowerName.includes("basic")) planSlug = "basic";
            else if (lowerName.includes("professional") || lowerName.includes("pro")) planSlug = "pro";
            else if (lowerName.includes("enterprise") || lowerName.includes("custom")) planSlug = "enterprise";

            const params = new URLSearchParams({
                plan: planSlug,
                package_id: selectedPackage.id,
                package_name: selectedPackage.name,
                cycle: billingCycle,
            });
            if (selectedServices.length > 0) {
                params.set("addons", selectedServices.join(","));
            }
            window.location.href = `/register?${params.toString()}`;
            return;
        }

        setIsProcessingPayment(true);

        try {
            const currentPlanPrice = getPackagePrice(selectedPackage, billingCycle);
            const cycleSuffix = Number(selectedPackage.price) === 0 ? "30-Day Trial" : billingCycle === "annual" ? "Annual Prepay" : "Monthly";

            // Call Laravel CheckoutController@initialize endpoint
            const response = await axios.post("/checkout/initialize", {
                package_id: selectedPackage.id,
                package_name: `${selectedPackage.name} (${cycleSuffix})`,
                base_price: currentPlanPrice,
                billing_cycle: billingCycle,
                addon_ids: selectedServices,
            });

            const paymentData = response.data;

            // Instant activation for 0 LKR Free Plan (no gateway popup needed)
            if (paymentData.is_free) {
                setIsCheckoutModalOpen(false);
                window.location.href = `/dashboard-user`;
                return;
            }

            if (typeof window.payhere === "undefined") {
                alert("PayHere SDK is loading. Please try again in a few seconds.");
                setIsProcessingPayment(false);
                return;
            }

            // Bind PayHere Callbacks
            window.payhere.onCompleted = function (orderId) {
                alert("Payment Completed! Order ID: " + orderId);
                setIsCheckoutModalOpen(false);
                window.location.href = `/checkout/receipt/download?order_id=${orderId}`;
            };

            window.payhere.onDismissed = function () {
                console.log("Payment dismissed by user.");
            };

            window.payhere.onError = function (error) {
                alert("Payment Error: " + error);
            };

            // Launch PayHere Popup
            window.payhere.startPayment(paymentData);
        } catch (error) {
            console.error("Payment initialization failed:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to initialize payment gateway session.",
            );
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // 3. Master Side-by-Side Feature Matrix Data
    const featureMatrix = [
        {
            category: "Core Architecture & Capacity Limits",
            id: "limits",
            features: [
                { name: "Monthly Subscription", free: "Free (30 Days)", basic: "LKR 45,000", pro: "LKR 95,000", ent: "LKR 195,000" },
                { name: "Annual Prepay (2 Mos Free)", free: "—", basic: "LKR 450,000/yr", pro: "LKR 950,000/yr", ent: "LKR 1,950,000/yr" },
                { name: "Physical Branches", free: "1", basic: "1", pro: "Up to 5", ent: "Unlimited" },
                { name: "Warehouses / Stores", free: "1", basic: "Up to 2", pro: "Up to 10", ent: "Unlimited" },
                { name: "User Seats Included", free: "2", basic: "5", pro: "20", ent: "50 Included (Expandable)" },
                { name: "Product & Invoice Capacity", free: "100 Items & Bills", basic: "Unlimited", pro: "Unlimited", ent: "Unlimited" },
            ],
        },
        {
            category: "Point of Sale & Invoicing",
            id: "pos",
            features: [
                { name: "High-Speed POS Billing & Barcodes", free: true, basic: true, pro: true, ent: true },
                { name: "Real-Time Stock Level Visibility", free: true, basic: true, pro: true, ent: true },
                { name: "Faster Billing with Multi-Price Batches", free: false, basic: true, pro: true, ent: true },
                { name: "Thermal 80mm & A4 Invoices", free: true, basic: true, pro: true, ent: true },
                { name: "Split Payments (Cash, Card, Cheque)", free: "Cash & Card", basic: true, pro: true, ent: true },
                { name: "Cashier Shift Control & Float Count", free: false, basic: true, pro: true, ent: true },
                { name: "Customer Credit & Balances", free: "Basic", basic: true, pro: "Advanced", ent: "Advanced" },
                { name: "Customer Return Bills & Credit Notes", free: "Basic", basic: true, pro: true, ent: true },
            ],
        },
        {
            category: "Dual-Location & Multi-Branch Inventory",
            id: "inventory",
            features: [
                { name: "Showroom vs. Back Storeroom Stock", free: false, basic: true, pro: true, ent: true },
                { name: "Purchases, GRN & Supplier Tracking", free: "Basic", basic: true, pro: true, ent: true },
                { name: "Stock Bin Card (Movement Audit Ledger)", free: false, basic: "Single Store", pro: "Multi-Store", ent: "Enterprise" },
                { name: "Stock Adjustments (Damage/Shrinkage)", free: false, basic: true, pro: true, ent: true },
                { name: "Inter-Branch Stock Transfers & Dispatch", free: false, basic: false, pro: true, ent: true },
                { name: "Centralized Price & Markup Control", free: false, basic: false, pro: true, ent: true },
            ],
        },
        {
            category: "Real-Time Approvals & Governance",
            id: "approvals",
            features: [
                { name: "Discount Override Manager Requests", free: false, basic: false, pro: true, ent: true },
                { name: "Credit Limit Override Requests", free: false, basic: false, pro: true, ent: true },
                { name: "Cash Drawer Float Mid-Shift Requests", free: false, basic: false, pro: true, ent: true },
                { name: "Granular Per-Module CRUD RBAC", free: false, basic: false, pro: true, ent: true },
                { name: "Purchase Order Approval Workflow", free: false, basic: false, pro: true, ent: true },
            ],
        },
        {
            category: "Financials, Ledgers & Profit Tracking",
            id: "financials",
            features: [
                { name: "Daily Sales & Gross Profit Reports", free: "Sales Summary", basic: "Full Profit", pro: true, ent: true },
                { name: "Financial Summary & Profit Tracking", free: false, basic: false, pro: true, ent: true },
                { name: "Expense & Bank Account Management", free: false, basic: false, pro: true, ent: true },
                { name: "Company Asset & Equipment Tracking", free: false, basic: false, pro: true, ent: true },
                { name: "Multi-Branch Net Profit & Loss Reports", free: false, basic: false, pro: true, ent: true },
            ],
        },
        {
            category: "Infrastructure, Dedicated Architecture & SLAs",
            id: "enterprise",
            features: [
                { name: "Dedicated Physically Isolated Database", free: false, basic: false, pro: false, ent: "Dedicated DB" },
                { name: "Platform Security Audit Logging", free: false, basic: false, pro: "Basic", ent: "Full Audit Trail" },
                { name: "Granular Custom Roles & Permission Control", free: false, basic: false, pro: true, ent: true },
                { name: "Unlimited Branch & Warehouse Scaling", free: false, basic: false, pro: false, ent: true },
                { name: "Service Master & Custom Invoicing", free: false, basic: false, pro: false, ent: true },
                { name: "Support Channel & SLA Guarantee", free: "Community", basic: "Email (Next Day)", pro: "Phone & WhatsApp", ent: "24/7 Priority SLA" },
            ],
        },
    ];

    // Helper to render matrix cell values
    const renderMatrixValue = (val, isFreeTier = false) => {
        if (val === true) {
            return (
                <div className="flex justify-center items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${isFreeTier ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"}`}>
                        <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            );
        }
        if (val === false || val === "—") {
            return (
                <div className="flex justify-center items-center">
                    <span className="text-slate-400 font-bold text-base select-none">—</span>
                </div>
            );
        }
        return (
            <div className="flex justify-center items-center text-center">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                    val.includes("Unlimited") || val.includes("Dedicated") || val.includes("24/7")
                        ? isDarkMode ? "bg-orange-950/60 text-orange-400 border border-orange-500/30" : "bg-orange-100 text-orange-900 border border-orange-200"
                        : isDarkMode ? "bg-slate-800 text-white border border-slate-700" : "bg-slate-100 text-slate-900 border border-slate-200"
                }`}>
                    {val}
                </span>
            </div>
        );
    };

    return (
        <div
            className={`min-h-screen font-sans transition-colors duration-500 flex flex-col justify-between overflow-x-hidden ${
                isDarkMode
                    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white"
                    : "bg-gradient-to-br from-slate-100 via-white to-slate-200/70 text-slate-900"
            }`}
        >
            <Head title="Nexus ERP" />
            <div>
                <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

                <main className="max-w-[1720px] mx-auto py-12 px-4 sm:px-6 lg:px-10 relative">

                    {/* HERO HEADER */}
                    <div className="text-center mb-10 relative z-10 animate-fade-in">
                        <h1
                            className={`text-4xl sm:text-5xl font-black tracking-tight mb-3 transition-colors duration-500 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                            {t("erp.heroTitle")}
                        </h1>
                        <p
                            className={`max-w-2xl mx-auto text-base sm:text-lg transition-colors duration-500 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                        >
                            {t("erp.heroSubtitle")}
                        </p>
                    </div>

                    {/* BILLING FREQUENCY SWITCHER */}
                    <div className="flex flex-col items-center justify-center mb-12 relative z-20">
                        <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200"
                        }`}>
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all ${
                                    billingCycle === "monthly"
                                        ? "bg-orange-600 text-white shadow-sm"
                                        : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                {t("erp.monthlyBilling")}
                            </button>
                            <button
                                onClick={() => setBillingCycle("annual")}
                                className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 ${
                                    billingCycle === "annual"
                                        ? "bg-orange-600 text-white shadow-sm"
                                        : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <span>{t("erp.annualBilling")}</span>
                                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-normal normal-case shadow-sm">
                                    {t("erp.annualSaveBadge")}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* 4 PRICING CARDS */}
                    {packages.length === 0 ? (
                        <div
                            className={`text-center py-12 max-w-xl mx-auto rounded-2xl border p-8 shadow-sm transition-all duration-500 ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-slate-200"}`}
                        >
                            <p className={`text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                No ERP packages found in the database system.
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                                Please add packages via your Admin Dashboard sidebar to view them here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 items-stretch relative z-10 mb-20">
                            {packages.map((pkg) => {
                                const isFree = Number(pkg.price) === 0;
                                const isProfessional = (pkg.code === "pro") || (pkg.name && pkg.name.includes("Professional"));
                                const isPopular = isProfessional || (pkg.is_popular !== undefined && pkg.is_popular !== null
                                    ? Boolean(pkg.is_popular)
                                    : false);
                                const audienceList = parseMeta(pkg.suitable_for);
                                const featuresList = parseMeta(pkg.features).filter((f) => {
                                    const lower = f.toLowerCase();
                                    return (
                                        !lower.includes("physical branch") &&
                                        !lower.includes("branches & warehouses") &&
                                        !lower.includes("branches & up to") &&
                                        !lower.includes("storeroom / warehouse") &&
                                        !lower.includes("user account") &&
                                        !lower.includes("user seat") &&
                                        !lower.includes("concurrent user") &&
                                        !lower.includes("products & 150 invoices") &&
                                        !lower.includes("products & invoices")
                                    );
                                });
                                const limitsList = getPackageLimits(pkg);
                                const currentPrice = getPackagePrice(pkg, billingCycle);
                                const originalAnnualPrice = getOriginalAnnualPrice(pkg);
                                const annualSavings = getAnnualSavings(pkg);

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`rounded-2xl border p-6 sm:p-7 relative group transition-all duration-300 hover:shadow-2xl flex flex-col justify-between ${
                                            isPopular
                                                ? isDarkMode
                                                    ? "bg-slate-900/90 border-orange-500 shadow-xl shadow-orange-950/40 text-white ring-2 ring-orange-500"
                                                    : "bg-white border-orange-500 shadow-2xl shadow-orange-500/20 text-slate-900 ring-2 ring-orange-500"
                                                : isDarkMode
                                                    ? "bg-slate-900/80 border-slate-800 text-white hover:border-orange-500/40"
                                                    : "bg-white/90 border-slate-200/80 text-slate-900 hover:border-orange-500/30"
                                        }`}
                                    >
                                        {/* FLAGSHIP / POPULAR BADGE */}
                                        {(isPopular || pkg.badge_text) && (
                                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg shadow-orange-500/30 z-20 whitespace-nowrap">
                                                {isProfessional ? "BEST SELLING" : (pkg.badge_text || t("erp.mostPopularFlagship"))}
                                            </div>
                                        )}

                                        <div>
                                            {/* TITLE & RATING */}
                                            <div className="flex justify-between items-start mb-3 gap-2 min-h-[3.5rem]">
                                                <div>
                                                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                                                        {pkg.name}
                                                    </h2>
                                                    {isFree && (
                                                        <span className="text-[11px] font-bold text-emerald-500 block mt-0.5">
                                                            {pkg.trial_days > 0 ? `${pkg.trial_days}-Day Risk-Free Sandbox` : t("erp.riskFreeSandbox")}
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-md shrink-0 leading-none ${
                                                        isDarkMode
                                                            ? "bg-slate-800 text-amber-400"
                                                            : "bg-amber-50 text-amber-700 border border-amber-200/60"
                                                    }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="w-3.5 h-3.5 text-amber-400 shrink-0 -translate-y-px"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="leading-none">{pkg.rating || "5.0"}</span>
                                                </span>
                                            </div>

                                            {/* DYNAMIC PRICE DISPLAY */}
                                            <div className="mb-4">
                                                {isFree ? (
                                                    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                                                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-500">
                                                            {t("erp.free")}
                                                        </span>
                                                        <span className="text-slate-400 text-xs font-bold">
                                                            {t("erp.per30Days")}
                                                        </span>
                                                    </div>
                                                ) : billingCycle === "monthly" ? (
                                                    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                                                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-orange-500">
                                                            LKR {Number(pkg.price).toLocaleString()}
                                                        </span>
                                                        <span className="text-slate-400 text-xs font-bold">
                                                            {t("erp.perMonth")}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                                                            <span className="text-3xl sm:text-4xl font-black tracking-tight text-orange-500">
                                                                LKR {currentPrice.toLocaleString()}
                                                            </span>
                                                            <span className="text-slate-400 text-xs font-bold">
                                                                {t("erp.perYear")}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[11px] text-slate-400 line-through">
                                                                LKR {originalAnnualPrice.toLocaleString()}
                                                            </span>
                                                            <span className={`text-[10px] font-black bg-emerald-500/10 px-1.5 py-0.5 rounded ${
                                                                isDarkMode ? "text-emerald-400" : "text-emerald-600"
                                                            }`}>
                                                                {t("erp.saveLkr")}{annualSavings.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <hr className={`my-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`} />

                                            {/* SUITABLE FOR TARGETS */}
                                            {audienceList.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className={`text-[10px] uppercase font-black tracking-wider mb-1.5 ${
                                                        isDarkMode ? "text-slate-400" : "text-slate-600"
                                                    }`}>
                                                        {t("erp.bestSuitedFor")}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {audienceList.map((target, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                                                                    isDarkMode
                                                                        ? "bg-orange-950/40 text-orange-400"
                                                                        : "bg-orange-50 text-orange-700"
                                                                }`}
                                                            >
                                                                {target}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* HARD LIMITS & CAPACITY PILLS */}
                                            <div className="mb-4">
                                                <h4 className={`text-[10px] uppercase font-black tracking-wider mb-2 ${
                                                    isDarkMode ? "text-slate-400" : "text-slate-600"
                                                }`}>
                                                    {t("erp.hardPlanLimits")}
                                                </h4>
                                                <div className={`grid grid-cols-2 gap-x-2 gap-y-1.5 p-2.5 rounded-xl border text-[11px] font-bold transition-colors ${
                                                    isDarkMode
                                                        ? "bg-slate-950/70 border-slate-800 text-slate-100"
                                                        : "bg-slate-100 border-slate-200 text-slate-900"
                                                }`}>
                                                    {limitsList.map((limit, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center gap-1.5 font-bold ${
                                                                isDarkMode ? "text-slate-100" : "text-slate-900"
                                                            }`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isFree ? "bg-emerald-500" : "bg-orange-500"}`} />
                                                            <span className="leading-tight">{limit.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CORE FEATURES LIST */}
                                            {featuresList.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className={`text-[10px] uppercase font-black tracking-wider mb-2 ${
                                                        isDarkMode ? "text-slate-400" : "text-slate-600"
                                                    }`}>
                                                        {t("erp.includedCapabilities")}
                                                    </h4>

                                                    {/* Plan inheritance notice */}
                                                    {pkg.inherited_from ? (
                                                        <div className={`flex items-center gap-2 mb-3 px-2.5 py-2 rounded-lg border text-[11px] font-bold ${
                                                            isDarkMode
                                                                ? "bg-orange-950/30 border-orange-800/50 text-orange-400"
                                                                : "bg-orange-50 border-orange-200 text-orange-700"
                                                        }`}>
                                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>
                                                                {t("erp.everythingIn")} {pkg.inherited_from} +
                                                            </span>
                                                        </div>
                                                    ) : !isFree && (
                                                        <div className={`flex items-center gap-2 mb-3 px-2.5 py-2 rounded-lg border text-[11px] font-bold ${
                                                            isDarkMode
                                                                ? "bg-orange-950/30 border-orange-800/50 text-orange-400"
                                                                : "bg-orange-50 border-orange-200 text-orange-700"
                                                        }`}>
                                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>
                                                                {t("erp.everythingIn")}{" "}
                                                                {pkg.name.includes("Basic")
                                                                    ? t("erp.freeTier")
                                                                    : pkg.name.includes("Professional")
                                                                        ? t("erp.basicTier")
                                                                        : pkg.name.includes("Enterprise")
                                                                            ? t("erp.professionalTier")
                                                                            : t("erp.previousPlan")}{" "}
                                                                +
                                                            </span>
                                                        </div>
                                                    )}

                                                    <ul className="space-y-2.5">
                                                        {featuresList.map((feature, idx) => (
                                                            <li
                                                                key={idx}
                                                                className={`flex items-center gap-2.5 text-xs font-semibold ${
                                                                    isDarkMode ? "text-slate-200" : "text-slate-800"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                                                        isFree
                                                                            ? "bg-emerald-500/15 text-emerald-500"
                                                                            : "bg-orange-500/15 text-orange-500"
                                                                    }`}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                        className={`w-3 h-3 stroke-[1.5] ${
                                                                            isFree ? "text-emerald-500" : "text-orange-500"
                                                                        }`}
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* ACTION BUTTON */}
                                        <div className={`mt-6 pt-4 border-t ${isDarkMode ? "border-slate-800/80" : "border-slate-100"}`}>
                                            <button
                                                onClick={() => handleBuyButtonClick(pkg)}
                                                className={`w-full py-3 px-6 rounded-xl text-xs font-black tracking-wider uppercase shadow-sm border transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                                                    auth?.user?.role === "admin"
                                                        ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-700"
                                                        : isFree
                                                          ? "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
                                                          : "bg-[#25D366] hover:bg-[#20BD5A] text-white border-transparent"
                                                }`}
                                            >
                                                {auth?.user?.role === "admin" ? (
                                                    <span>Manage Package in Admin</span>
                                                ) : isFree ? (
                                                    t("erp.startFreeTrial")
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                        </svg>
                                                        {t("erp.contactWhatsApp")}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* SECTION 3: MASTER SIDE-BY-SIDE FEATURE MATRIX */}
                    <div className="mt-16 mb-20 relative z-10">
                        <div className="text-center mb-10">
                            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 border transition-colors bg-orange-500/10 ${
                                isDarkMode ? "text-orange-400" : "text-orange-600"
                            } border-orange-500/20`}>
                                <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                    {t("erp.fullBreakdown")}
                                </span>
                            </div>
                            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                {t("erp.featureMatrixTitle")}
                            </h2>
                            <p className={`text-sm max-w-xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                {t("erp.featureMatrixSubtitle")}
                            </p>
                        </div>

                        {/* TABLE CONTAINER */}
                        <div className={`overflow-x-auto rounded-2xl border shadow-xl transition-colors ${
                            isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                        }`}>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={`border-b ${isDarkMode ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50"}`}>
                                        <th className={`py-5 px-6 text-xs font-black uppercase tracking-wider w-1/3 min-w-[260px] ${
                                            isDarkMode ? "text-white" : "text-slate-900"
                                        }`}>
                                            {t("erp.featureCapability")}
                                        </th>
                                        <th className={`py-5 px-4 text-center text-xs font-black uppercase tracking-wider min-w-[150px] ${
                                            isDarkMode ? "text-emerald-400" : "text-emerald-600"
                                        }`}>
                                            {t("erp.freeStarter")}
                                            <span className={`block text-[10px] font-bold normal-case ${
                                                isDarkMode ? "text-slate-400" : "text-slate-500"
                                            }`}>{t("erp.thirtyDayTrial")}</span>
                                        </th>
                                        <th className={`py-5 px-4 text-center text-xs font-black uppercase tracking-wider min-w-[160px] ${
                                            isDarkMode ? "text-orange-400" : "text-orange-600"
                                        }`}>
                                            {t("erp.basicEssentials")}
                                            <span className={`block text-[10px] font-bold normal-case ${
                                                isDarkMode ? "text-slate-400" : "text-slate-500"
                                            }`}>{t("erp.singleShop")}</span>
                                        </th>
                                        <th className={`py-5 px-4 text-center text-xs font-black uppercase tracking-wider bg-orange-500/5 min-w-[170px] ${
                                            isDarkMode ? "text-orange-400" : "text-orange-600"
                                        }`}>
                                            {t("erp.professionalGrowth")}
                                            <span className={`block text-[10px] font-bold normal-case ${
                                                isDarkMode ? "text-orange-400" : "text-orange-600"
                                            }`}>{t("erp.flagshipMultiBranch")}</span>
                                        </th>
                                        <th className={`py-5 px-4 text-center text-xs font-black uppercase tracking-wider min-w-[160px] ${
                                            isDarkMode ? "text-orange-400" : "text-orange-600"
                                        }`}>
                                            {t("erp.enterpriseCore")}
                                            <span className={`block text-[10px] font-bold normal-case ${
                                                isDarkMode ? "text-slate-400" : "text-slate-500"
                                            }`}>{t("erp.dedicatedCloud")}</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {featureMatrix.map((section, sIdx) => (
                                        <React.Fragment key={section.id || sIdx}>
                                            {/* CATEGORY DIVIDER */}
                                            <tr className={isDarkMode ? "bg-slate-950/90" : "bg-slate-100"}>
                                                <td colSpan={5} className={`py-3 px-6 text-xs font-black uppercase tracking-wider ${
                                                    isDarkMode ? "text-orange-400" : "text-orange-600"
                                                }`}>
                                                    {section.category}
                                                </td>
                                            </tr>

                                            {/* ROWS IN CATEGORY */}
                                            {section.features.map((feat, fIdx) => (
                                                <tr
                                                    key={fIdx}
                                                    className={`border-b transition-colors hover:bg-orange-500/[0.03] ${
                                                        isDarkMode ? "border-slate-800/60" : "border-slate-100"
                                                    }`}
                                                >
                                                    <td className={`py-3.5 px-6 text-xs sm:text-sm font-bold ${
                                                        isDarkMode ? "text-white" : "text-slate-950"
                                                    }`}>
                                                        {feat.name}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {renderMatrixValue(feat.free, true)}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {renderMatrixValue(feat.basic, false)}
                                                    </td>
                                                    <td className="py-3.5 px-4 bg-orange-500/[0.02]">
                                                        {renderMatrixValue(feat.pro, false)}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {renderMatrixValue(feat.ent, false)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>

            {/* CHECKOUT MODAL WINDOW WITH PAYHERE GATEWAY */}
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
                                    Configure Your Plan Subscription
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Review billing cycle, optional implementation services, and confirm activation.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                    isDarkMode
                                        ? "border-slate-800 hover:bg-slate-800 text-slate-400"
                                        : "border-slate-200 hover:bg-slate-100 text-slate-500"
                                }`}
                                title="Close modal"
                            >
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            {/* BASE PLAN SUMMARY */}
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
                                    <span className="text-xs text-slate-400 block mt-0.5">
                                        {Number(selectedPackage.price) === 0
                                            ? "30-Day Risk-Free Sandbox Evaluation"
                                            : billingCycle === "annual"
                                                ? "Annual Prepay (Includes 2 Months Free)"
                                                : "Standard Monthly Subscription"}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`text-lg font-black ${
                                            Number(selectedPackage.price) === 0
                                                ? "text-emerald-500"
                                                : "text-orange-500"
                                        }`}
                                    >
                                        {Number(selectedPackage.price) === 0
                                            ? "Free"
                                            : `LKR ${getPackagePrice(selectedPackage, billingCycle).toLocaleString()}`}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-bold block">
                                        {Number(selectedPackage.price) === 0
                                            ? "/ 30 days"
                                            : billingCycle === "annual"
                                                ? "/ year"
                                                : "/ month"}
                                    </span>
                                </div>
                            </div>

                            {/* ADD-ON SERVICES SELECTION (ONLY IF CONFIGURED) */}
                            {additionalServices.length > 0 && (
                                <div>
                                    <h4 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-3">
                                        Optional Professional Add-Ons
                                    </h4>
                                    <div className="space-y-3">
                                        {additionalServices.map((service) => {
                                            const isChecked = selectedServices.includes(service.id);
                                            return (
                                                <label
                                                    key={service.id}
                                                    className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all duration-300 ${
                                                        isChecked
                                                            ? isDarkMode
                                                                ? "border-orange-500/50 bg-orange-500/[0.03]"
                                                                : "border-orange-500/40 bg-orange-500/[0.02]"
                                                            : isDarkMode
                                                                ? "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                                                                : "border-slate-100 bg-white hover:border-slate-200"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleServiceToggle(service.id)}
                                                        className="mt-1 rounded text-orange-500 focus:ring-orange-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className={`text-xs font-bold ${
                                                                isDarkMode ? "text-white" : "text-slate-900"
                                                            }`}>
                                                                {service.name}
                                                            </span>
                                                            <span className="text-xs font-black text-orange-500">
                                                                + LKR {service.price.toLocaleString()}
                                                                <span className="text-[10px] text-slate-400 font-normal ml-1">
                                                                    ({service.type})
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <p className={`text-[11px] ${
                                                            isDarkMode ? "text-slate-400" : "text-slate-500"
                                                        }`}>
                                                            {service.description}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FOOTER TOTAL & CONFIRMATION */}
                        <div
                            className={`p-6 border-t border-inherit flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                                isDarkMode ? "bg-slate-950/40" : "bg-slate-50/60"
                            }`}
                        >
                            <div>
                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                                    Total Estimated Cart Value
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                    <span
                                        className={`text-2xl font-black tracking-tight ${
                                            calculateTotal() === 0 ? "text-emerald-500" : "text-orange-500"
                                        }`}
                                    >
                                        {calculateTotal() === 0
                                            ? "30-Day Free Plan (LKR 0)"
                                            : `LKR ${calculateTotal().toLocaleString()}`}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsCheckoutModalOpen(false)}
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
                                    disabled={isProcessingPayment}
                                    className={`px-6 py-3 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                                        calculateTotal() === 0
                                            ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20"
                                            : "bg-orange-500 hover:bg-orange-600"
                                    }`}
                                >
                                    {isProcessingPayment
                                        ? "Activating..."
                                        : !auth?.user
                                            ? calculateTotal() === 0
                                                ? "Create Account & Activate Free Plan"
                                                : "Create Account & Continue"
                                            : calculateTotal() === 0
                                                ? "Activate 30-Day Free Plan"
                                                : "Pay Now with PayHere"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
