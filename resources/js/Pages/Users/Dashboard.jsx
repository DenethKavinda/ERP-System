import React, { useState, useMemo, useCallback } from "react";
import { Head } from "@inertiajs/react";
import Header from "../../Components/Header";

// ============================================================================
// MARKETPLACE ASSET DATA STORE (PRODUCTS WITH ATTACHED SERVICE ADD-ONS)
// ============================================================================
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Premium Multi-Speed Cooling Fan",
        sku: "FAN-PREM-01",
        category: "Appliances",
        price: 89,
        image: "/img/fan.jpg",
        description:
            "High-efficiency aerodynamic 3-speed pedestal fan with programmatic oscillation metrics and whispering silent motor tech.",
        availableService: {
            id: "srv-1",
            title: "Professional Fan Assembly & Operator Service",
            rate: 25,
            description:
                "On-site balancing configuration, safe routing calibration, and dedicated operations orientation setup.",
        },
    },
    {
        id: 2,
        name: "Smart Inverter Air Conditioner (A/C)",
        sku: "AC-SMART-INV",
        category: "Climate Control",
        price: 749,
        image: "/img/ac.jpg",
        description:
            "5-Star rated dual-inverter climate framework with real-time room ambient tracking parameters and dynamic micro-filter meshes.",
        availableService: {
            id: "srv-2",
            title: "A/C Master Wall Mount Installation & Tuning",
            rate: 120,
            description:
                "Full bracket anchor provisioning, dual-layer vacuum drain test, and optimization performance testing.",
        },
    },
    {
        id: 3,
        name: "Quantum Sound Acoustic Matrix Soundbar",
        sku: "AUD-QNT-MX",
        category: "Audio Equipment",
        price: 299,
        image: "/img/soundbar.jpg",
        description:
            "Dolby Atmos enabled home sound stage bar with dual multi-directional sub-frequency matrices and wireless connectivity map.",
        availableService: {
            id: "srv-3",
            title: "Acoustic Tuning & Room Calibration Service",
            rate: 45,
            description:
                "Frequency response optimization scan matching your designated physical interior layout metrics.",
        },
    },
    {
        id: 4,
        name: "Helios Ergo Workspace Desk",
        sku: "FURN-HLS-DSK",
        category: "Office Infrastructure",
        price: 450,
        image: "/img/desk.jpg",
        description:
            "Dual-motor synchronized height-adjustable smart desk with embedded structural load tracking and custom preset memory configurations.",
        availableService: {
            id: "srv-4",
            title: "White-Glove Heavy Furniture Assembly Matrix",
            rate: 65,
            description:
                "Unboxing layout tracking, multi-motor stabilization mapping, and structural durability compliance check.",
        },
    },
];

export default function Dashboard({ auth }) {
    // UI Theme state controls
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Marketplace Inventory Streams
    const [products] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState([]);

    // Core filter search hooks
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    // Tracks state of checked add-on services per product card
    const [selectedServices, setSelectedServices] = useState({});

    // Tracks the selected quantity on the product card before adding to cart
    const [cardQuantities, setCardQuantities] = useState({});

    // Helper to get selected quantity for a card (defaults to 1)
    const getCardQty = useCallback(
        (productId) => cardQuantities[productId] || 1,
        [cardQuantities],
    );

    // Update quantity selectors on individual product cards
    const handleCardQtyChange = useCallback((productId, delta) => {
        setCardQuantities((prev) => {
            const current = prev[productId] || 1;
            const updated = Math.max(1, current + delta);
            return { ...prev, [productId]: updated };
        });
    }, []);

    // Toggle service add-on checkbox state
    const toggleServiceCheckbox = useCallback((productId) => {
        setSelectedServices((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    }, []);

    // Staging allocations dispatch pipeline
    const handleAddToCart = useCallback(
        (product) => {
            const includeService = !!selectedServices[product.id];
            const quantityToAdd = getCardQty(product.id);

            setCart((prevCart) => {
                const matchIndex = prevCart.findIndex(
                    (item) =>
                        item.id === product.id &&
                        item.hasService === includeService,
                );

                if (matchIndex > -1) {
                    const updatedCart = [...prevCart];
                    updatedCart[matchIndex].qty += quantityToAdd;
                    return updatedCart;
                }

                return [
                    ...prevCart,
                    {
                        ...product,
                        hasService: includeService,
                        qty: quantityToAdd,
                        serviceRate: includeService
                            ? product.availableService.rate
                            : 0,
                    },
                ];
            });

            setSelectedServices((prev) => ({ ...prev, [product.id]: false }));
            setCardQuantities((prev) => ({ ...prev, [product.id]: 1 }));
        },
        [selectedServices, getCardQty],
    );

    // Handle adjustments directly inside the master checkout footer timeline
    const handleUpdateCartQty = useCallback((productId, hasService, delta) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (
                        item.id === productId &&
                        item.hasService === hasService
                    ) {
                        const newQty = item.qty + delta;
                        return newQty > 0 ? { ...item, qty: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean),
        );
    }, []);

    const handleRemoveCartItem = useCallback((productId, hasService) => {
        setCart((prev) =>
            prev.filter(
                (item) =>
                    !(item.id === productId && item.hasService === hasService),
            ),
        );
    }, []);

    // Service price calculation matches item quantity scaling behavior
    const cartTotal = useMemo(() => {
        return cart.reduce(
            (sum, item) => sum + (item.price + item.serviceRate) * item.qty,
            0,
        );
    }, [cart]);

    const cartVolume = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }, [cart]);

    // Compute active catalogue filter pipeline matrices
    const filteredProducts = useMemo(() => {
        return products.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat =
                selectedCategory === "ALL" ||
                item.category === selectedCategory;
            return matchesSearch && matchesCat;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <div
            className={`min-h-screen font-sans transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-950 text-slate-100"
                    : "bg-[#f8f9fa] text-slate-800"
            }`}
        >
            <Head title="Enterprise Product Bundle Console" />

            {/* SEPARATED HEADER */}
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                auth={auth}
            />

            {/* VIBRANT HIGH-COLOR HERO COVER BAR */}
            <div className="relative bg-slate-950 text-white min-h-[55vh] flex items-center justify-center py-16 px-4 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen scale-105"
                    style={{ backgroundImage: "url('/img/hero-bg.jpg')" }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="relative z-10 max-w-4xl w-full text-center space-y-6">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                        Bring your big ideas to life.
                    </h1>
                    <p className="text-sm md:text-base text-slate-200 max-w-xl mx-auto font-medium drop-shadow-md">
                        Search for tailored infrastructure, active configuration
                        modules, and bundle options at value pricing.
                    </p>

                    {/* Integrated Search Box Floating Layer */}
                    <div className="p-4 md:p-6 rounded-xl border border-white/20 bg-slate-950/80 backdrop-blur-lg shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-stretch md:items-center gap-4 text-left max-w-3xl mx-auto">
                        <div className="w-full md:w-1/2 relative flex flex-col justify-center">
                            <label className="text-xs font-bold block mb-1.5 text-slate-300">
                                Find your product package
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Enter keywords or reference codes..."
                                    className="w-full text-sm pl-11 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900/90 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                />
                                <svg
                                    className="absolute left-4 top-3 h-4 w-4 text-slate-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-center">
                            <label className="text-xs font-bold block mb-1.5 text-slate-300">
                                Filter by Category Tier
                            </label>
                            <div className="flex gap-1.5 flex-wrap">
                                {[
                                    "ALL",
                                    "Appliances",
                                    "Climate Control",
                                    "Audio Equipment",
                                    "Office Infrastructure",
                                ].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-2.5 py-1.5 text-[11px] font-bold rounded transition-all border ${
                                            selectedCategory === cat
                                                ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                                                : "bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN APP SHELL CONTENT LAYOUT */}
            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-72 sm:pb-64 md:pb-48">
                <div className="space-y-6">
                    <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Choose Your Custom Framework Packages
                        </h2>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div
                            className={`border border-dashed p-16 text-center rounded-xl ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
                        >
                            <p className="text-sm text-slate-400 font-medium">
                                No matching setup elements were found matching
                                your filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => {
                                const hasAddonChecked =
                                    !!selectedServices[product.id];
                                const activeCardQty = getCardQty(product.id);

                                // Calculate row assignment dynamically to apply staggered delay rows
                                const rowNumber = Math.floor(index / 3) + 1;
                                const delayClass =
                                    rowNumber === 1
                                        ? "delay-row-1"
                                        : rowNumber === 2
                                          ? "delay-row-2"
                                          : "delay-row-3";

                                return (
                                    <div
                                        key={product.id}
                                        className={`animate-fade-in-up ${delayClass} border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800/80 hover:border-slate-700"
                                                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                        {product.category}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                                        {product.sku}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                                                    {product.name}
                                                </h3>
                                                <p
                                                    className={`text-xs line-clamp-3 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                                >
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 text-center py-1">
                                                <div className="flex justify-center items-baseline">
                                                    <span className="text-3xl font-bold text-slate-900 dark:text-white font-sans">
                                                        ${product.price}
                                                    </span>
                                                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-1"></span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                                                    Renews at standard rate
                                                </span>
                                            </div>

                                            <div
                                                onClick={() =>
                                                    toggleServiceCheckbox(
                                                        product.id,
                                                    )
                                                }
                                                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer select-none flex items-start gap-3 ${
                                                    hasAddonChecked
                                                        ? "bg-orange-50 dark:bg-orange-950/20 border-orange-500/40"
                                                        : isDarkMode
                                                          ? "bg-slate-950 border-slate-800 hover:border-slate-700"
                                                          : "bg-[#f8f9fa] border-slate-200 hover:border-slate-300"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={hasAddonChecked}
                                                    onChange={() => {}}
                                                    className="w-3.5 h-3.5 mt-0.5 rounded text-orange-500 focus:ring-orange-500 border-slate-300 cursor-pointer transition-transform duration-200 active:scale-90"
                                                />
                                                <div className="flex-1 space-y-0.5">
                                                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                                                        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                                                            Add Supporting Setup
                                                        </h4>
                                                        <span className="text-[11px] font-bold text-slate-600 dark:text-orange-400">
                                                            +$
                                                            {
                                                                product
                                                                    .availableService
                                                                    .rate
                                                            }
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] leading-tight line-clamp-2 text-slate-500 dark:text-slate-400">
                                                        {
                                                            product
                                                                .availableService
                                                                .description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={`p-4 border-t px-5 flex items-center justify-between gap-3 ${isDarkMode ? "border-slate-800 bg-slate-950/20" : "border-slate-100 bg-[#f8f9fa]"}`}
                                        >
                                            <div className="flex items-center border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 overflow-hidden">
                                                <button
                                                    onClick={() =>
                                                        handleCardQtyChange(
                                                            product.id,
                                                            -1,
                                                        )
                                                    }
                                                    className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-500 dark:hover:text-orange-400 font-bold transition-colors text-xs"
                                                >
                                                    —
                                                </button>
                                                <span className="px-1 text-xs font-bold min-w-[1.2rem] text-center text-slate-800 dark:text-slate-100">
                                                    {activeCardQty}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleCardQtyChange(
                                                            product.id,
                                                            1,
                                                        )
                                                    }
                                                    className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-500 dark:hover:text-orange-400 font-bold transition-colors text-xs"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                                className="flex-1 max-w-[140px] bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded text-center transition-all uppercase tracking-wider active:scale-95 shadow-sm hover:shadow"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* STICKY DRAW-PANEL CART FOOTER WITH SMOOTH ENTRANCE ANIMATIONS */}
            <footer
                className={`fixed bottom-0 inset-x-0 z-50 p-4 border-t shadow-[0_-10px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-in-out ${
                    cartVolume > 0
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "translate-y-4 opacity-90 pointer-events-auto"
                } ${
                    isDarkMode
                        ? "bg-slate-900 border-slate-800 text-slate-100"
                        : "bg-white border-slate-200 text-slate-900"
                }`}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-slate-800 dark:bg-slate-950 text-white h-10 w-10 rounded flex items-center justify-center relative transition-transform duration-300 ease-out active:scale-95 border dark:border-slate-800">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartVolume > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                                    {cartVolume}
                                </span>
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Shopping Cart Selection
                            </h4>
                            <p className="text-xs text-slate-800 dark:text-slate-200 transition-all duration-200">
                                {cartVolume} items configured
                            </p>
                        </div>
                    </div>

                    <div
                        className={`flex-1 flex items-center gap-2 overflow-y-auto md:overflow-x-auto p-2 rounded border flex-wrap md:flex-nowrap max-h-[100px] md:max-h-[56px] min-h-[40px] transition-all duration-300 ${
                            isDarkMode
                                ? "bg-slate-950 border-slate-800/80"
                                : "bg-[#f8f9fa] border-slate-200"
                        }`}
                    >
                        {cart.length === 0 ? (
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium w-full text-center py-1 transition-opacity duration-300">
                                No packages selected yet. Choose options from
                                the grid above.
                            </p>
                        ) : (
                            cart.map((cartItem, idx) => (
                                <div
                                    key={`${cartItem.id}-${cartItem.hasService}-${idx}`}
                                    className={`inline-flex items-center gap-2.5 text-xs border px-2.5 py-1 rounded shadow-sm shrink-0 max-w-full md:max-w-[240px] transition-all duration-300 transform scale-100 hover:scale-[1.02] ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-700 text-slate-100"
                                            : "bg-white border-slate-200 text-slate-800"
                                    }`}
                                >
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-bold truncate text-slate-900 dark:text-slate-100">
                                            {cartItem.name}
                                        </span>
                                        {cartItem.hasService && (
                                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-tight">
                                                + Support Add-on
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0">
                                        <button
                                            onClick={() =>
                                                handleUpdateCartQty(
                                                    cartItem.id,
                                                    cartItem.hasService,
                                                    -1,
                                                )
                                            }
                                            className="px-1.5 py-0.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-bold transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-1 text-[11px] font-bold text-slate-800 dark:text-slate-100">
                                            {cartItem.qty}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleUpdateCartQty(
                                                    cartItem.id,
                                                    cartItem.hasService,
                                                    1,
                                                )
                                            }
                                            className="px-1.5 py-0.5 text-slate-500 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 font-bold transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleRemoveCartItem(
                                                cartItem.id,
                                                cartItem.hasService,
                                            )
                                        }
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold p-0.5 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800 shrink-0">
                        <div className="text-right px-2">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                                Subtotal
                            </span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white transition-all duration-300">
                                ${cartTotal}
                            </span>
                        </div>
                        <button
                            disabled={cart.length === 0}
                            onClick={() =>
                                alert(
                                    `Processing checkout workflow: $${cartTotal}`,
                                )
                            }
                            className={`text-xs font-bold px-6 py-2.5 rounded transition-all duration-200 uppercase tracking-wider ${
                                cart.length > 0
                                    ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer active:scale-95 shadow-md shadow-orange-500/10"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                            }`}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
