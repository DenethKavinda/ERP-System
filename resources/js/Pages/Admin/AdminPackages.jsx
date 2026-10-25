import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

// Tab configuration
const TABS = [
    { id: "catalog", label: "Catalog", icon: "grid" },
    { id: "general", label: "General & Pricing", icon: "tag" },
    { id: "limits", label: "Hard Limits", icon: "shield" },
    { id: "presentation", label: "Badges & Audience", icon: "star" },
    { id: "capabilities", label: "Capabilities", icon: "check" },
];

// Tab icon SVGs
const TabIcon = ({ type, className = "w-4 h-4" }) => {
    const icons = {
        grid: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        tag: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
        shield: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        star: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        check: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };
    return icons[type] || null;
};

export default function AdminPackages({ packages = [], isDarkMode = false }) {
    const [activeTab, setActiveTab] = useState("catalog");
    const [editingId, setEditingId] = useState(null);
    const [previewCycle, setPreviewCycle] = useState("monthly");
    const [previewDark, setPreviewDark] = useState(isDarkMode);
    const [showPreview, setShowPreview] = useState(true);
    const [catalogSearch, setCatalogSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [audienceInput, setAudienceInput] = useState("");
    const [audienceTags, setAudienceTags] = useState([]);
    const [featureInput, setFeatureInput] = useState("");
    const [featuresList, setFeaturesList] = useState([]);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
        code: "",
        price: "",
        suitable_for: "",
        features: "",
        benefits: "",
        rating: "5.0",
        youtube_id: "",
        max_branches: 1,
        max_warehouses: 1,
        max_users: 2,
        max_products: 100,
        max_monthly_bills: 150,
        is_popular: false,
        trial_days: 0,
        inherited_from: "",
        badge_text: "",
        status: "active",
        modules: [],
        sort_order: 0,
    });

    const ENTERPRISE_MODULES = [
        { key: "pos", name: "High-Speed POS Billing & Barcodes", category: "POS & Invoicing" },
        { key: "receipts", name: "Thermal 80mm & A4 Invoices", category: "POS & Invoicing" },
        { key: "split_payments", name: "Multi-Tender Payments (Cash/Card)", category: "POS & Invoicing" },
        { key: "shift_control", name: "Cashier Shift Tracking & Float", category: "POS & Invoicing" },
        { key: "multi_price", name: "Multiple Price Lists & Rate Cards", category: "POS & Invoicing" },
        { key: "stock_view", name: "Real-Time Stock Level Visibility", category: "Inventory" },
        { key: "dual_stock", name: "Showroom vs Back Storeroom Stock", category: "Inventory" },
        { key: "purchases_grn", name: "Purchases, GRN & Supplier Tracking", category: "Inventory" },
        { key: "customer_credit", name: "Customer Credit Accounts & Returns", category: "Inventory" },
        { key: "bin_card", name: "Stock Movement Audit Ledger", category: "Inventory" },
        { key: "branch_transfer", name: "Inter-Branch Stock Transfers", category: "Multi-Branch" },
        { key: "ho_pricing", name: "Centralized Head Office Pricing", category: "Multi-Branch" },
        { key: "branch_rbac", name: "Branch-Level RBAC Access Control", category: "Multi-Branch" },
        { key: "approvals", name: "Manager Discount & Credit Approvals", category: "Governance" },
        { key: "daily_profit", name: "Daily Gross Profit on Sales Report", category: "Financials" },
        { key: "accounting", name: "Full Revenue & Cost Accounting", category: "Financials" },
        { key: "assets", name: "Company Asset & Equipment Tracking", category: "Financials" },
        { key: "branch_pnl", name: "Multi-Branch Net Profit & Loss", category: "Financials" },
        { key: "dedicated_db", name: "Dedicated Isolated Database", category: "Enterprise Infrastructure" },
        { key: "audit_logs", name: "Complete Security Audit Trail", category: "Enterprise Infrastructure" },
        { key: "custom_domain", name: "Custom Branded Portal & Web Address", category: "Enterprise Infrastructure" },
        { key: "api_access", name: "REST API & External Integrations", category: "Enterprise Infrastructure" },
        { key: "uptime_sla", name: "99.9% High Availability SLA", category: "Enterprise Infrastructure" },
        { key: "emergency_support", name: "24/7 Priority Emergency Hotline", category: "Enterprise Infrastructure" },
    ];

    const featureSuggestions = [
        "Point of Sale (POS) Billing",
        "Thermal & A4 Invoice Printing",
        "Real-Time Stock View",
        "Cash & Card Split Payments",
        "Multi-Price Product Batches",
        "Cashier Shift & Till Control",
        "Showroom & Storeroom Dual Stock",
        "Supplier Purchase & GRN Tracking",
        "Customer Credit Accounts & Returns",
        "Stock Movement Audit (Bin Card)",
        "Daily Gross Profit Reports",
        "Inter-Branch Stock Transfers",
        "Centralized Head Office Pricing",
        "Manager Approval Workflows",
        "Granular Branch-Level RBAC",
        "Financial Summary & Profit Tracking",
        "Dedicated Cloud Database Instance",
        "99.9% High Availability SLA",
    ];

    const audienceSuggestions = [
        "Startups & Solo Founders",
        "Single Retail Stores",
        "Pharmacies & Boutiques",
        "Multi-Branch Retailers",
        "Wholesalers & Distributors",
        "Supermarkets & Department Stores",
    ];

    const parseAudience = (str) => (str ? str.split(",").map((s) => s.trim()).filter(Boolean) : []);
    const parseFeatures = (str) => (str ? str.split(/[|,]/).map((s) => s.trim()).filter(Boolean) : []);

    const handleEditInit = (pkg) => {
        setEditingId(pkg.id);
        const parsedAud = parseAudience(pkg.suitable_for);
        const parsedFeat = parseFeatures(pkg.features);
        setAudienceTags(parsedAud);
        setFeaturesList(parsedFeat);
        setData({
            name: pkg.name || "",
            code: pkg.code || "",
            price: pkg.price !== undefined ? pkg.price : "",
            suitable_for: pkg.suitable_for || "",
            features: pkg.features || "",
            benefits: pkg.benefits || "",
            rating: pkg.rating || "5.0",
            youtube_id: pkg.youtube_id || "",
            max_branches: pkg.max_branches !== undefined ? pkg.max_branches : 1,
            max_warehouses: pkg.max_warehouses !== undefined ? pkg.max_warehouses : 1,
            max_users: pkg.max_users !== undefined ? pkg.max_users : 2,
            max_products: pkg.max_products !== undefined ? pkg.max_products : -1,
            max_monthly_bills: pkg.max_monthly_bills !== undefined ? pkg.max_monthly_bills : -1,
            is_popular: Boolean(pkg.is_popular),
            trial_days: pkg.trial_days !== undefined ? pkg.trial_days : 0,
            inherited_from: pkg.inherited_from || "",
            badge_text: pkg.badge_text || "",
            status: pkg.status || "active",
            modules: Array.isArray(pkg.modules) ? pkg.modules : [],
            sort_order: pkg.sort_order || 0,
        });
        setActiveTab("general");
        setShowPreview(true);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setAudienceTags([]);
        setFeaturesList([]);
        reset();
        setActiveTab("catalog");
    };

    const handleDuplicate = (pkg) => {
        setEditingId(null);
        const parsedAud = parseAudience(pkg.suitable_for);
        const parsedFeat = parseFeatures(pkg.features);
        setAudienceTags(parsedAud);
        setFeaturesList(parsedFeat);
        setData({
            name: `${pkg.name} (Copy)`,
            code: pkg.code ? `${pkg.code}-copy` : "",
            price: pkg.price !== undefined ? pkg.price : "",
            suitable_for: pkg.suitable_for || "",
            features: pkg.features || "",
            benefits: pkg.benefits || "",
            rating: pkg.rating || "5.0",
            youtube_id: pkg.youtube_id || "",
            max_branches: pkg.max_branches !== undefined ? pkg.max_branches : 1,
            max_warehouses: pkg.max_warehouses !== undefined ? pkg.max_warehouses : 1,
            max_users: pkg.max_users !== undefined ? pkg.max_users : 2,
            max_products: pkg.max_products !== undefined ? pkg.max_products : -1,
            max_monthly_bills: pkg.max_monthly_bills !== undefined ? pkg.max_monthly_bills : -1,
            is_popular: false,
            trial_days: pkg.trial_days !== undefined ? pkg.trial_days : 0,
            inherited_from: pkg.inherited_from || "",
            badge_text: pkg.badge_text || "",
            status: "draft",
            modules: Array.isArray(pkg.modules) ? [...pkg.modules] : [],
            sort_order: (pkg.sort_order || 0) + 1,
        });
        setActiveTab("general");
        setShowPreview(true);
    };

    const addAudienceTag = (tag) => {
        const trimmed = (tag || audienceInput).trim();
        if (trimmed && !audienceTags.includes(trimmed)) {
            const next = [...audienceTags, trimmed];
            setAudienceTags(next);
            setData("suitable_for", next.join(", "));
            setAudienceInput("");
        }
    };

    const removeAudienceTag = (idx) => {
        const next = audienceTags.filter((_, i) => i !== idx);
        setAudienceTags(next);
        setData("suitable_for", next.join(", "));
    };

    const addFeatureItem = (feat) => {
        const trimmed = (feat || featureInput).trim();
        if (trimmed && !featuresList.includes(trimmed)) {
            const next = [...featuresList, trimmed];
            setFeaturesList(next);
            setData("features", next.join(" | "));
            setFeatureInput("");
        }
    };

    const removeFeatureItem = (idx) => {
        const next = featuresList.filter((_, i) => i !== idx);
        setFeaturesList(next);
        setData("features", next.join(" | "));
    };

    const moveFeature = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= featuresList.length) return;
        const next = [...featuresList];
        [next[index], next[target]] = [next[target], next[index]];
        setFeaturesList(next);
        setData("features", next.join(" | "));
    };

    const toggleModule = (modKey) => {
        const currentMods = Array.isArray(data.modules) ? data.modules : [];
        const nextMods = currentMods.includes(modKey)
            ? currentMods.filter((k) => k !== modKey)
            : [...currentMods, modKey];
        setData("modules", nextMods);
    };

    const handleQuickStatusChange = (pkg, newStatus) => {
        router.put(`/admin/erp-packages/${pkg.id}`, {
            ...pkg,
            status: newStatus,
        });
    };

    const applyTemplate = (type) => {
        const templates = {
            free: {
                aud: ["Startups", "Solo Founders & Evaluation"],
                feats: ["Quick Billing with Barcode Scanning", "Print Receipts (Thermal & Full-Page)", "Accept Cash & Card in One Sale", "Real-Time Stock Visibility", "Daily Sales Summary Reports"],
                modules: ["pos", "receipts", "split_payments", "stock_view", "daily_summary"],
                data: { name: "ERP Free Starter", code: "free", price: 0, benefits: "30-Day Risk-Free Sandbox", rating: "4.8", youtube_id: "", max_branches: 1, max_warehouses: 1, max_users: 2, max_products: 100, max_monthly_bills: 150, is_popular: false, trial_days: 30, inherited_from: "", badge_text: "30-Day Risk-Free Sandbox", status: "active", sort_order: 1 },
            },
            basic: {
                aud: ["Single Retail Stores", "Pharmacies & Boutiques"],
                feats: ["Point of Sale with Multiple Price Lists", "Cashier Shift & Till Control", "Dual Stock (Showroom & Storeroom)", "Supplier Purchase & GRN Tracking", "Customer Credit Accounts & Returns", "Stock Bin Card (Theft Audit)", "Daily Gross Profit Reports"],
                modules: ["pos", "receipts", "split_payments", "stock_view", "daily_summary", "multi_price", "shift_control", "dual_stock", "purchases_grn", "customer_credit", "bin_card", "daily_profit"],
                data: { name: "ERP Basic Essentials", code: "basic", price: 45000, benefits: "Single Retail Powerhouse", rating: "4.8", youtube_id: "", max_branches: 1, max_warehouses: 2, max_users: 5, max_products: -1, max_monthly_bills: -1, is_popular: false, trial_days: 0, inherited_from: "Free", badge_text: "", status: "active", sort_order: 2 },
            },
            pro: {
                aud: ["Multi-Branch Retailers", "Wholesalers & Distributors"],
                feats: ["Inter-Branch Stock Transfers", "Centralized Head Office Pricing", "Manager Approval Workflows", "Financial Summary & Profit Tracking", "Asset & Equipment Inventory", "Consolidated Multi-Branch P&L", "Branch-Level RBAC Scoping", "Priority WhatsApp & Phone Support"],
                modules: ["pos", "receipts", "split_payments", "stock_view", "daily_summary", "multi_price", "shift_control", "dual_stock", "purchases_grn", "customer_credit", "bin_card", "daily_profit", "branch_transfer", "ho_pricing", "approvals", "accounting", "assets", "branch_pnl", "branch_rbac", "priority_support"],
                data: { name: "ERP Professional Growth", code: "pro", price: 95000, benefits: "Multi-Branch Flagship", rating: "4.9", youtube_id: "", max_branches: 5, max_warehouses: 10, max_users: 20, max_products: -1, max_monthly_bills: -1, is_popular: true, trial_days: 0, inherited_from: "Basic", badge_text: "Most Popular - Flagship", status: "active", sort_order: 3 },
            },
            enterprise: {
                aud: ["Department Stores", "Large Wholesalers & Manufacturers"],
                feats: ["Dedicated Isolated Database Instance", "Full Security Audit Logging", "Granular Per-Module RBAC Permissions", "Unlimited Scaling Across Island", "Dedicated Senior Technical Manager", "99.9% High Availability SLA", "24/7 Critical Response Hotline"],
                modules: ["pos", "receipts", "split_payments", "stock_view", "daily_summary", "multi_price", "shift_control", "dual_stock", "purchases_grn", "customer_credit", "bin_card", "daily_profit", "branch_transfer", "ho_pricing", "approvals", "accounting", "assets", "branch_pnl", "branch_rbac", "priority_support", "dedicated_db", "audit_logs", "custom_domain", "api_access", "custom_invoicing", "uptime_sla", "emergency_support"],
                data: { name: "Enterprise Custom Core", code: "enterprise", price: 195000, benefits: "Enterprise Scale Architecture", rating: "5.0", youtube_id: "", max_branches: -1, max_warehouses: -1, max_users: 50, max_products: -1, max_monthly_bills: -1, is_popular: false, trial_days: 0, inherited_from: "Professional", badge_text: "", status: "active", sort_order: 4 },
            },
        };
        const t = templates[type];
        if (!t) return;
        setAudienceTags(t.aud);
        setFeaturesList(t.feats);
        setData({ ...t.data, suitable_for: t.aud.join(", "), features: t.feats.join(" | "), modules: t.modules });
        setActiveTab("general");
        setShowPreview(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...data, suitable_for: audienceTags.join(", "), features: featuresList.join(" | ") };
        if (editingId) {
            put(`/admin/erp-packages/${editingId}`, { data: payload, onSuccess: () => handleCancelEdit() });
        } else {
            post("/admin/erp-packages", { data: payload, onSuccess: () => handleCancelEdit() });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to permanently delete this ERP package configuration setup?")) {
            router.delete(`/admin/erp-packages/${id}`);
            if (editingId === id) handleCancelEdit();
        }
    };

    const numericPrice = Number(data.price) || 0;
    const isFreePlan = numericPrice === 0;
    const annualPrice = numericPrice * 10;
    const originalAnnualPrice = numericPrice * 12;
    const annualSavings = numericPrice * 2;

    const formatLimitLabel = (val, singular, plural) => {
        if (val === -1 || val === "-1") return `Unlimited ${plural}`;
        return `${val} ${Number(val) === 1 ? singular : plural}`;
    };

    const isEditorTab = activeTab !== "catalog";

    // Determine which step number (for the progress dots)
    const editorTabs = TABS.filter((t) => t.id !== "catalog");
    const currentStepIndex = editorTabs.findIndex((t) => t.id === activeTab);

    return (
        <div className={`flex min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
            <Sidebar isDarkMode={isDarkMode} />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* TOP HEADER BAR */}
                <div className={`shrink-0 px-6 py-4 border-b ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-3">
                            <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                                Studio
                            </span>
                            <div>
                                <h1 className="text-lg font-black tracking-tight leading-tight">
                                    ERP Packages Management Studio
                                </h1>
                                <p className="text-[11px] text-slate-400">
                                    {editingId
                                        ? `Editing: ${data.name || "Untitled"} (Record #${editingId})`
                                        : isEditorTab
                                            ? `Creating: ${data.name || "New Package"}`
                                            : `${packages.length} active tier${packages.length !== 1 ? "s" : ""} in catalog`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isEditorTab && (
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${
                                        showPreview
                                            ? "border-orange-500 text-orange-500 bg-orange-500/5"
                                            : "border-slate-300 dark:border-slate-700 text-slate-400"
                                    }`}
                                >
                                    {showPreview ? "Preview On" : "Preview Off"}
                                </button>
                            )}
                            {isEditorTab && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Back to Catalog
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* TAB NAVIGATION BAR */}
                <div className={`shrink-0 px-6 border-b ${isDarkMode ? "bg-slate-800/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-1 max-w-7xl mx-auto -mb-px">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const isDisabled = tab.id !== "catalog" && activeTab === "catalog" && !editingId && !data.name;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                        isActive
                                            ? "border-orange-500 text-orange-500"
                                            : isDisabled
                                                ? "border-transparent text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                                : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <TabIcon type={tab.icon} className="w-3.5 h-3.5" />
                                    <span>{tab.label}</span>
                                    {tab.id === "catalog" && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                                            isActive ? "bg-orange-500/10 text-orange-500" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                                        }`}>
                                            {packages.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {/* Step progress indicator for editor tabs */}
                        {isEditorTab && (
                            <div className="ml-auto flex items-center gap-1.5 py-3">
                                {editorTabs.map((t, idx) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setActiveTab(t.id)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            idx === currentStepIndex
                                                ? "bg-orange-500 w-5"
                                                : idx < currentStepIndex
                                                    ? "bg-orange-500/40"
                                                    : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                        title={t.label}
                                    />
                                ))}
                                <span className="text-[10px] text-slate-400 ml-2 font-bold">
                                    Step {currentStepIndex + 1} of {editorTabs.length}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6">
                        {/* ===== TAB: CATALOG ===== */}
                        {activeTab === "catalog" && (
                            <div className="space-y-6">
                                {/* Top Enterprise KPI Metrics Ribbon */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200 shadow-sm"}`}>
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Plans</div>
                                            <div className="text-xl font-black">{packages.length} Tiers</div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200 shadow-sm"}`}>
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">
                                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live on Storefront</div>
                                            <div className="text-xl font-black text-emerald-500">
                                                {packages.filter((p) => !p.status || p.status === "active").length} Active
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200 shadow-sm"}`}>
                                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-black">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Flagship Tier</div>
                                            <div className="text-sm font-black truncate max-w-[10rem]">
                                                {packages.find((p) => p.is_popular)?.name || "Professional"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200 shadow-sm"}`}>
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-black">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Entry Commercial MRR</div>
                                            <div className="text-xl font-black text-purple-500">
                                                LKR 45,000<span className="text-xs font-normal text-slate-400">/mo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Create Presets Row */}
                                <div className={`p-5 rounded-xl border ${isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                                                Quick Create From Preset Template
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                Load an enterprise blueprint with pre-configured limits & module entitlements.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleCancelEdit();
                                                setActiveTab("general");
                                                setShowPreview(true);
                                            }}
                                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors flex items-center gap-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            New Blank Package
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { type: "free", name: "Free Starter", price: "LKR 0 (30 Days)", color: "emerald" },
                                            { type: "basic", name: "Basic Essentials", price: "LKR 45,000/mo", color: "blue" },
                                            { type: "pro", name: "Professional", price: "LKR 95,000/mo (Flagship)", color: "orange" },
                                            { type: "enterprise", name: "Enterprise Core", price: "LKR 195,000/mo", color: "purple" },
                                        ].map((t) => (
                                            <button
                                                key={t.type}
                                                type="button"
                                                onClick={() => applyTemplate(t.type)}
                                                className={`text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all hover:border-${t.color}-500 hover:bg-${t.color}-500/5 border-slate-200 dark:border-slate-700 hover:shadow-md`}
                                            >
                                                <div className={`text-${t.color}-500 font-black text-sm`}>{t.name}</div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">{t.price}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Catalog Table with Filters & Search */}
                                <div className={`rounded-xl border overflow-hidden ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-base font-bold flex items-center gap-2">
                                                Active ERP Tier Catalog
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">
                                                    {packages.length}
                                                </span>
                                            </h2>
                                            <p className="text-[11px] text-slate-400">Real-time subscription plans, capacity limits and module entitlements</p>
                                        </div>

                                        {/* Search & Status Filters */}
                                        <div className="flex items-center gap-2.5">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={catalogSearch}
                                                    onChange={(e) => setCatalogSearch(e.target.value)}
                                                    placeholder="Search plan or code..."
                                                    className={`pl-8 pr-3 py-1.5 rounded-lg border text-xs font-medium focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700 placeholder-slate-500" : "border-slate-200 placeholder-slate-400"}`}
                                                />
                                                <svg className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            </div>

                                            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-bold">
                                                {[
                                                    { id: "all", label: "All" },
                                                    { id: "active", label: "Active" },
                                                    { id: "draft", label: "Draft" },
                                                    { id: "archived", label: "Archived" },
                                                ].map((flt) => (
                                                    <button
                                                        key={flt.id}
                                                        type="button"
                                                        onClick={() => setStatusFilter(flt.id)}
                                                        className={`px-2.5 py-1 rounded-md transition-colors ${
                                                            statusFilter === flt.id
                                                                ? "bg-orange-500 text-white shadow-xs"
                                                                : "text-slate-400 hover:text-slate-200"
                                                        }`}
                                                    >
                                                        {flt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {packages.length === 0 ? (
                                        <p className="text-sm text-slate-400 py-12 text-center">
                                            No packages published yet. Use the presets above or create a blank package to get started.
                                        </p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                                                        <th className="px-6 py-3 font-bold">Plan & Code</th>
                                                        <th className="px-4 py-3 font-bold">Monthly Rate</th>
                                                        <th className="px-4 py-3 font-bold">Lifecycle</th>
                                                        <th className="px-4 py-3 font-bold">Hard Limits</th>
                                                        <th className="px-4 py-3 font-bold">Entitlements</th>
                                                        <th className="px-4 py-3 font-bold">Badges</th>
                                                        <th className="px-4 py-3 font-bold text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                    {packages
                                                        .filter((pkg) => {
                                                            const matchesSearch = !catalogSearch ||
                                                                (pkg.name && pkg.name.toLowerCase().includes(catalogSearch.toLowerCase())) ||
                                                                (pkg.code && pkg.code.toLowerCase().includes(catalogSearch.toLowerCase()));
                                                            const matchesStatus = statusFilter === "all" || (pkg.status || "active") === statusFilter;
                                                            return matchesSearch && matchesStatus;
                                                        })
                                                        .map((pkg) => {
                                                            const pkgFeats = parseFeatures(pkg.features);
                                                            const pkgAud = parseAudience(pkg.suitable_for);
                                                            const status = pkg.status || "active";
                                                            const moduleCount = Array.isArray(pkg.modules) ? pkg.modules.length : pkgFeats.length;

                                                            return (
                                                                <tr key={pkg.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors ${editingId === pkg.id ? "bg-blue-500/5" : ""}`}>
                                                                    <td className="px-6 py-4">
                                                                        <div className="font-bold flex items-center gap-2">
                                                                            {pkg.name}
                                                                            {pkg.is_popular ? (
                                                                                <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">Flagship</span>
                                                                            ) : null}
                                                                        </div>
                                                                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                                                                            <span>{pkg.code || "---"}</span>
                                                                            <span className="text-[10px] text-slate-500 font-sans">#Order {pkg.sort_order || 0}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-4 font-black whitespace-nowrap">
                                                                        {Number(pkg.price) === 0 ? (
                                                                            <span className="text-emerald-500 font-black">FREE</span>
                                                                        ) : (
                                                                            <span className="text-orange-500">
                                                                                LKR {Number(pkg.price).toLocaleString()}
                                                                                <span className="text-[10px] font-normal text-slate-400">/mo</span>
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleQuickStatusChange(pkg, status === "active" ? "draft" : status === "draft" ? "archived" : "active")}
                                                                            title="Click to toggle status (Active -> Draft -> Archived)"
                                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-transform hover:scale-105 ${
                                                                                status === "active"
                                                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                                                    : status === "draft"
                                                                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                                                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                                                            }`}
                                                                        >
                                                                            <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500" : status === "draft" ? "bg-amber-500" : "bg-slate-400"}`} />
                                                                            {status}
                                                                        </button>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-xs whitespace-nowrap">
                                                                        <div className="font-semibold">{formatLimitLabel(pkg.max_branches, "Branch", "Branches")} / {formatLimitLabel(pkg.max_warehouses, "Warehouse", "Whs")}</div>
                                                                        <div className="text-[11px] text-slate-400 mt-0.5">{pkg.max_users === -1 ? "Unlimited" : pkg.max_users} Users / {pkg.max_monthly_bills === -1 ? "Unlimited" : pkg.max_monthly_bills} Bills</div>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-xs">
                                                                        <div className="font-bold flex items-center gap-1.5">
                                                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                                            {moduleCount} Modules Active
                                                                        </div>
                                                                        <div className="text-[11px] text-slate-400 truncate max-w-[10rem] mt-0.5">{pkgAud.join(", ") || "--"}</div>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-xs whitespace-nowrap">
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {pkg.badge_text ? <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">{pkg.badge_text}</span> : null}
                                                                            {pkg.trial_days > 0 ? <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{pkg.trial_days}d Trial</span> : null}
                                                                            {pkg.inherited_from ? <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">+{pkg.inherited_from}</span> : null}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-right whitespace-nowrap">
                                                                        <div className="flex items-center justify-end gap-1.5">
                                                                            <button type="button" onClick={() => handleEditInit(pkg)} className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">Edit</button>
                                                                            <button type="button" onClick={() => handleDuplicate(pkg)} className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 transition-colors">Clone</button>
                                                                            <button type="button" onClick={() => handleDelete(pkg.id)} className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">Delete</button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ===== EDITOR TABS (with optional preview) ===== */}
                        {isEditorTab && (
                            <form onSubmit={handleSubmit}>
                                <div className={`grid gap-6 ${showPreview ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1"}`}>
                                    {/* EDITOR PANEL */}
                                    <div className={showPreview ? "xl:col-span-7" : ""}>
                                        {/* TAB: GENERAL & PRICING */}
                                        {activeTab === "general" && (
                                            <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                                <h2 className="text-sm font-black uppercase tracking-wider text-orange-500 flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                    General & Pricing Specification
                                                </h2>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Package Tier Name *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className={`w-full p-3 rounded-lg border text-sm font-semibold focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            placeholder="e.g. ERP Professional Growth"
                                                        />
                                                        {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Plan Code / Slug</label>
                                                        <input
                                                            type="text"
                                                            className={`w-full p-3 rounded-lg border text-sm font-mono focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                                            value={data.code}
                                                            onChange={(e) => setData("code", e.target.value)}
                                                            placeholder="e.g. pro, basic, free"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Monthly Price (LKR) *</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-3 text-xs font-bold text-slate-400">LKR</span>
                                                            <input
                                                                type="number"
                                                                required
                                                                min="0"
                                                                className={`w-full pl-12 pr-3 py-3 rounded-lg border text-sm font-bold focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                                                value={data.price}
                                                                onChange={(e) => setData("price", e.target.value)}
                                                                placeholder="95000 (0 for Free)"
                                                            />
                                                        </div>
                                                        {errors.price && <span className="text-red-500 text-xs mt-1 block">{errors.price}</span>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Storefront Rating</label>
                                                        <select
                                                            className={`w-full p-3 rounded-lg border text-sm font-semibold focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                                                            value={data.rating}
                                                            onChange={(e) => setData("rating", e.target.value)}
                                                        >
                                                            <option value="5.0">5.0 - Flagship Enterprise Score</option>
                                                            <option value="4.9">4.9 - Highly Acclaimed Growth</option>
                                                            <option value="4.8">4.8 - Proven Commercial Tier</option>
                                                            <option value="4.7">4.7 - Evaluation Quality</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Trial Period (Days)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className={`w-full p-3 rounded-lg border text-sm font-semibold focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                                            value={data.trial_days}
                                                            onChange={(e) => setData("trial_days", Number(e.target.value))}
                                                            placeholder="30 (0 for none)"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Lifecycle Status *</label>
                                                        <select
                                                            className={`w-full p-3 rounded-lg border text-sm font-semibold focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                                                            value={data.status}
                                                            onChange={(e) => setData("status", e.target.value)}
                                                        >
                                                            <option value="active">Active (Visible on Customer Storefront)</option>
                                                            <option value="draft">Draft (Internal Staging Only)</option>
                                                            <option value="archived">Archived (Deprecated / Existing Only)</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Display Order (#)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className={`w-full p-3 rounded-lg border text-sm font-semibold focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                                            value={data.sort_order}
                                                            onChange={(e) => setData("sort_order", Number(e.target.value))}
                                                            placeholder="1, 2, 3..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Navigation buttons */}
                                                <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                                    <button type="button" onClick={() => setActiveTab("limits")} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                                                        Next: Hard Limits
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB: HARD LIMITS */}
                                        {activeTab === "limits" && (
                                            <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                                <h2 className="text-sm font-black uppercase tracking-wider text-orange-500 flex items-center gap-2 mb-1 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                    Operational Capacity & Hard Limits
                                                </h2>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                                                    These numbers populate the Hard Plan Limits grid on pricing cards and enforce system quotas. Check "Unlimited" for infinite scaling.
                                                </p>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {[
                                                        { key: "max_branches", label: "Max Branches", defaultVal: 1 },
                                                        { key: "max_warehouses", label: "Max Warehouses", defaultVal: 1 },
                                                        { key: "max_users", label: "Max User Accounts", defaultVal: 2 },
                                                        { key: "max_products", label: "Max Products", defaultVal: 100 },
                                                        { key: "max_monthly_bills", label: "Max Monthly Bills", defaultVal: 150 },
                                                    ].map((field) => (
                                                        <div key={field.key} className={`p-4 rounded-lg border ${isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
                                                            <div className="flex items-center justify-between mb-2.5">
                                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
                                                                <label className="flex items-center gap-1.5 text-xs cursor-pointer font-bold">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded text-orange-500 focus:ring-orange-500"
                                                                        checked={data[field.key] === -1}
                                                                        onChange={(e) => setData(field.key, e.target.checked ? -1 : field.defaultVal)}
                                                                    />
                                                                    <span className={data[field.key] === -1 ? "text-orange-500 font-black" : "text-slate-400"}>Unlimited</span>
                                                                </label>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                disabled={data[field.key] === -1}
                                                                className={`w-full p-2.5 rounded border text-sm font-bold bg-transparent ${
                                                                    data[field.key] === -1
                                                                        ? "opacity-40 cursor-not-allowed border-slate-700"
                                                                        : "focus:outline-none focus:border-orange-500 border-slate-300 dark:border-slate-600"
                                                                }`}
                                                                value={data[field.key] === -1 ? "" : data[field.key]}
                                                                onChange={(e) => setData(field.key, Number(e.target.value))}
                                                                placeholder={data[field.key] === -1 ? "Unlimited (-1)" : String(field.defaultVal)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                                    <button type="button" onClick={() => setActiveTab("general")} className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                                        Back: General
                                                    </button>
                                                    <button type="button" onClick={() => setActiveTab("presentation")} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                                                        Next: Badges & Audience
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB: BADGES & AUDIENCE */}
                                        {activeTab === "presentation" && (
                                            <div className="space-y-6">
                                                {/* Badges & Flagship */}
                                                <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                                    <h2 className="text-sm font-black uppercase tracking-wider text-orange-500 flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                                                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                        Badges, Flagship Status & Hierarchy
                                                    </h2>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        <div className={`p-4 rounded-lg border flex items-center justify-between ${data.is_popular ? "border-orange-500 bg-orange-500/10" : isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
                                                            <div>
                                                                <div className="text-xs font-bold">Flagship Plan</div>
                                                                <div className="text-[10px] text-slate-400">Orange ring + top badge</div>
                                                            </div>
                                                            <input type="checkbox" className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500" checked={data.is_popular} onChange={(e) => setData("is_popular", e.target.checked)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Top Badge Text</label>
                                                            <input type="text" className={`w-full p-3 rounded-lg border text-sm font-semibold focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`} value={data.badge_text} onChange={(e) => setData("badge_text", e.target.value)} placeholder="e.g. Most Popular - Flagship" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Inherits From</label>
                                                            <input type="text" className={`w-full p-3 rounded-lg border text-sm font-semibold focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`} value={data.inherited_from} onChange={(e) => setData("inherited_from", e.target.value)} placeholder="e.g. Free, Basic" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Target Audience */}
                                                <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                                    <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                                                        <h2 className="text-sm font-black uppercase tracking-wider text-orange-500 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                            Best Suited For (Target Audience)
                                                        </h2>
                                                        <span className="text-[11px] text-slate-400 font-bold">{audienceTags.length} tags</span>
                                                    </div>

                                                    <div className="flex gap-2 mb-3">
                                                        <input type="text" className={`flex-1 p-3 rounded-lg border text-sm focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`} value={audienceInput} onChange={(e) => setAudienceInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAudienceTag(); } }} placeholder="Type audience & press Enter" />
                                                        <button type="button" onClick={() => addAudienceTag()} className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold uppercase rounded-lg hover:bg-slate-700 transition-colors">Add</button>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem] p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                                                        {audienceTags.length === 0 ? (
                                                            <span className="text-xs text-slate-400 italic">No tags added yet</span>
                                                        ) : audienceTags.map((tag, idx) => (
                                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                                                                {tag}
                                                                <button type="button" onClick={() => removeAudienceTag(idx)} className="hover:text-red-500 ml-0.5">x</button>
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5 items-center">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Suggestions:</span>
                                                        {audienceSuggestions.map((sug, idx) => (
                                                            <button key={idx} type="button" onClick={() => addAudienceTag(sug)} className="text-[11px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-500 transition-colors">+ {sug}</button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between pt-2">
                                                    <button type="button" onClick={() => setActiveTab("limits")} className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                                        Back: Limits
                                                    </button>
                                                    <button type="button" onClick={() => setActiveTab("capabilities")} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                                                        Next: Capabilities
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB: CAPABILITIES */}
                                        {activeTab === "capabilities" && (
                                            <div className="space-y-6">
                                                <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                                    <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                                                        <h2 className="text-sm font-black uppercase tracking-wider text-orange-500 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                            Included Capabilities (Storefront Checklist)
                                                        </h2>
                                                        <span className="text-[11px] text-slate-400 font-bold">{featuresList.length} items</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Each item appears with a checkmark on the customer-facing pricing card.</p>

                                                    <div className="flex gap-2 mb-3">
                                                        <input type="text" className={`flex-1 p-3 rounded-lg border text-sm focus:outline-none focus:border-orange-500 bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`} value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeatureItem(); } }} placeholder="Type capability & press Enter" />
                                                        <button type="button" onClick={() => addFeatureItem()} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase rounded-lg transition-colors">+ Add</button>
                                                    </div>

                                                    <div className="space-y-2 mb-5 max-h-[300px] overflow-y-auto">
                                                        {featuresList.length === 0 ? (
                                                            <div className="p-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400 italic">No capabilities added yet.</div>
                                                        ) : featuresList.map((feat, idx) => (
                                                            <div key={idx} className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold ${isDarkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-[10px] font-black shrink-0">&#10003;</span>
                                                                    <span>{feat}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button type="button" disabled={idx === 0} onClick={() => moveFeature(idx, -1)} className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-slate-200 disabled:opacity-20">&#8593;</button>
                                                                    <button type="button" disabled={idx === featuresList.length - 1} onClick={() => moveFeature(idx, 1)} className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-slate-200 disabled:opacity-20">&#8595;</button>
                                                                    <button type="button" onClick={() => removeFeatureItem(idx)} className="px-2 py-0.5 text-xs text-red-500 hover:text-red-700 font-bold">&#10005;</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div>
                                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Quick-Add Verified Features:</div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {featureSuggestions.map((sug, idx) => {
                                                                const added = featuresList.includes(sug);
                                                                return (
                                                                    <button key={idx} type="button" disabled={added} onClick={() => addFeatureItem(sug)} className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${added ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800" : "border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-500"}`}>
                                                                        {added ? "Added" : `+ ${sug}`}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ENTERPRISE MODULE ENTITLEMENT MATRIX */}
                                                <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                                    <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                                                        <div>
                                                            <h2 className="text-sm font-black uppercase tracking-wider text-orange-500 flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                                Enterprise Module Entitlements Engine
                                                            </h2>
                                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                                Machine-readable license flags provisioned into the ERP core for runtime access control.
                                                            </p>
                                                        </div>
                                                        <span className="text-xs font-black px-2.5 py-1 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                                            {(data.modules || []).length} / {ENTERPRISE_MODULES.length} Active
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                                                        {ENTERPRISE_MODULES.map((mod) => {
                                                            const isEnabled = (data.modules || []).includes(mod.key);
                                                            return (
                                                                <div
                                                                    key={mod.key}
                                                                    onClick={() => toggleModule(mod.key)}
                                                                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                                                                        isEnabled
                                                                            ? "border-orange-500/60 bg-orange-500/5 shadow-xs"
                                                                            : isDarkMode
                                                                                ? "border-slate-700/60 bg-slate-900/30 hover:border-slate-600 opacity-60"
                                                                                : "border-slate-200 bg-slate-50/50 hover:border-slate-300 opacity-60"
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isEnabled}
                                                                        onChange={() => {}} // handled by parent div onClick
                                                                        className="mt-0.5 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                                                                    />
                                                                    <div className="min-w-0">
                                                                        <div className="text-xs font-bold leading-tight">{mod.name}</div>
                                                                        <div className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">{mod.category}</div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* FINAL SAVE BAR */}
                                                <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                                    <button type="button" onClick={() => setActiveTab("presentation")} className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                                        Back: Badges
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className={`py-3 px-8 rounded-xl text-white font-black uppercase tracking-wider text-sm transition-all shadow-md disabled:opacity-50 ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"}`}
                                                    >
                                                        {processing ? "Saving..." : editingId ? "Save Package Changes" : "Publish New Package"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* LIVE PREVIEW PANEL (sticky, always visible in editor) */}
                                    {showPreview && (
                                        <div className="xl:col-span-5 sticky top-6 self-start">
                                            {/* Preview Controls */}
                                            <div className={`p-3 rounded-t-xl border border-b-0 flex items-center justify-between ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[11px] font-black uppercase tracking-wider">Live Preview</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="inline-flex rounded border border-slate-200 dark:border-slate-700 p-0.5 text-[10px] font-bold">
                                                        <button type="button" onClick={() => setPreviewCycle("monthly")} className={`px-2 py-0.5 rounded ${previewCycle === "monthly" ? "bg-orange-500 text-white" : "text-slate-400"}`}>Monthly</button>
                                                        <button type="button" onClick={() => setPreviewCycle("annual")} className={`px-2 py-0.5 rounded ${previewCycle === "annual" ? "bg-orange-500 text-white" : "text-slate-400"}`}>Annual</button>
                                                    </div>
                                                    <button type="button" onClick={() => setPreviewDark(!previewDark)} className="text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-400">{previewDark ? "Dark" : "Light"}</button>
                                                </div>
                                            </div>

                                            {/* Preview Card */}
                                            <div className={`rounded-b-2xl border p-6 relative transition-all duration-300 shadow-xl flex flex-col ${previewDark ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"} ${data.is_popular ? "border-orange-500 ring-2 ring-orange-500/20" : ""}`}>
                                                {(data.is_popular || data.badge_text) && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
                                                        {data.badge_text || "Most Popular - Flagship"}
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="flex justify-between items-start mb-3 gap-2">
                                                        <div>
                                                            <h3 className="text-xl font-extrabold tracking-tight">{data.name || "Package Title"}</h3>
                                                            {isFreePlan && <span className="text-[11px] font-bold text-emerald-500 block mt-0.5">{data.trial_days > 0 ? `${data.trial_days}-Day Risk-Free Sandbox` : "30-Day Risk-Free Sandbox"}</span>}
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1 text-xs font-black px-2 py-1 rounded-md shrink-0 ${previewDark ? "bg-slate-800 text-amber-400" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`}>
                                                            &#9733; {data.rating || "5.0"}
                                                        </span>
                                                    </div>

                                                    <div className="mb-4">
                                                        {isFreePlan ? (
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-3xl font-black text-emerald-500">FREE</span>
                                                                <span className="text-slate-400 text-xs font-bold">/ {data.trial_days || 30} Days</span>
                                                            </div>
                                                        ) : previewCycle === "monthly" ? (
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-3xl font-black text-orange-500">LKR {numericPrice.toLocaleString()}</span>
                                                                <span className="text-slate-400 text-xs font-bold">/ month</span>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className="flex items-baseline gap-1.5">
                                                                    <span className="text-3xl font-black text-orange-500">LKR {annualPrice.toLocaleString()}</span>
                                                                    <span className="text-slate-400 text-xs font-bold">/ year</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[11px] text-slate-400 line-through">LKR {originalAnnualPrice.toLocaleString()}</span>
                                                                    <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">Save LKR {annualSavings.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <hr className={`my-4 ${previewDark ? "border-slate-800" : "border-slate-200"}`} />

                                                    {audienceTags.length > 0 && (
                                                        <div className="mb-4">
                                                            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">Best Suited For</div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {audienceTags.map((t, i) => (
                                                                    <span key={i} className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${previewDark ? "bg-orange-950/40 text-orange-400" : "bg-orange-50 text-orange-700"}`}>{t}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mb-4">
                                                        <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">Hard Plan Limits</div>
                                                        <div className={`grid grid-cols-2 gap-x-2 gap-y-1.5 p-2.5 rounded-xl border text-[11px] font-bold ${previewDark ? "bg-slate-950/70 border-slate-800 text-slate-100" : "bg-slate-100 border-slate-200 text-slate-900"}`}>
                                                            {[
                                                                formatLimitLabel(data.max_branches, "Branch", "Branches"),
                                                                formatLimitLabel(data.max_warehouses, "Warehouse", "Warehouses"),
                                                                data.max_users === -1 ? "Unlimited Users" : `${data.max_users} Users`,
                                                                data.max_monthly_bills === -1 ? "Unlimited Bills" : `${data.max_products && data.max_products !== -1 ? data.max_products : data.max_monthly_bills} Items & Bills`,
                                                            ].map((label, i) => (
                                                                <div key={i} className="flex items-center gap-1.5">
                                                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isFreePlan ? "bg-emerald-500" : "bg-orange-500"}`} />
                                                                    <span>{label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {featuresList.length > 0 && (
                                                        <div className="mb-4">
                                                            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">Included Capabilities</div>
                                                            {data.inherited_from && (
                                                                <div className={`flex items-center gap-2 mb-3 px-2.5 py-2 rounded-lg border text-[11px] font-bold ${previewDark ? "bg-orange-950/30 border-orange-800/50 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700"}`}>
                                                                    Everything in {data.inherited_from} +
                                                                </div>
                                                            )}
                                                            <ul className="space-y-2">
                                                                {featuresList.slice(0, 8).map((feat, idx) => (
                                                                    <li key={idx} className={`flex items-center gap-2 text-xs font-semibold ${previewDark ? "text-slate-200" : "text-slate-800"}`}>
                                                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${isFreePlan ? "bg-emerald-500/15 text-emerald-500" : "bg-orange-500/15 text-orange-500"}`}>&#10003;</span>
                                                                        <span className="leading-tight">{feat}</span>
                                                                    </li>
                                                                ))}
                                                                {featuresList.length > 8 && (
                                                                    <li className="text-[11px] text-slate-400 font-bold pl-6">+ {featuresList.length - 8} more capabilities...</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <div className={`w-full py-3 rounded-xl font-black uppercase tracking-wider text-xs text-center ${isFreePlan ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"}`}>
                                                        {isFreePlan ? "Start Free Evaluation" : "Upgrade to This Plan"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
