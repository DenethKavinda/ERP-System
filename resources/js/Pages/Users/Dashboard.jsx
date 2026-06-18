import React, { useState, useMemo, useCallback } from "react";
import { Head } from "@inertiajs/react";
import Header from "../../Components/Header"; // Adjust this relative path to match your project directory structure

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

    // Service price calculation is a flat addition
    const cartTotal = useMemo(() => {
        return cart.reduce(
            (sum, item) => sum + item.price * item.qty + item.serviceRate,
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
                    : "bg-slate-50 text-slate-900"
            }`}
        >
            <Head title="Enterprise Product Bundle Console" />

            {/* SEPARATED HEADER REFACTOR */}
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                auth={auth}
            />

            {/* MAIN APP SHELL CONTENT LAYOUT */}
            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-40 md:pb-32">
                {/* SEARCH AND CATEGORY SELECTION FILTERS */}
                <div
                    className={`p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 shadow-sm transition-colors ${
                        isDarkMode
                            ? "bg-slate-900 border-slate-800"
                            : "bg-white border-slate-200"
                    }`}
                >
                    <div className="w-full md:w-1/2">
                        <label
                            className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                        >
                            Search Core Inventory
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by product name, SKU title code refs..."
                            className={`w-full text-sm px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                                isDarkMode
                                    ? "bg-slate-950 border-slate-800 text-white"
                                    : "bg-slate-50 border-slate-200 text-slate-800"
                            }`}
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label
                            className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                        >
                            Category Filter Inclusion
                        </label>
                        <div className="flex gap-2 flex-wrap">
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
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        selectedCategory === cat
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : isDarkMode
                                              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PRODUCT LIST GRID SEGMENT */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold tracking-tight uppercase border-l-4 border-blue-600 pl-3">
                        Available Products & Custom Bundles
                    </h2>

                    {filteredProducts.length === 0 ? (
                        <div
                            className={`border-2 border-dashed p-12 text-center rounded-xl ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
                        >
                            <p className="text-sm text-slate-400 font-medium">
                                No inventory matrix matches your active
                                selection parameters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {filteredProducts.map((product) => {
                                const hasAddonChecked =
                                    !!selectedServices[product.id];
                                const activeCardQty = getCardQty(product.id);

                                return (
                                    <div
                                        key={product.id}
                                        className={`border rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800"
                                                : "bg-white border-slate-200"
                                        }`}
                                    >
                                        <div className="p-5 space-y-4">
                                            {/* Top Meta Header Layer */}
                                            <div className="flex gap-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-24 h-24 object-cover rounded-lg border border-slate-200/20 shrink-0 bg-slate-100"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=150";
                                                    }}
                                                />
                                                <div className="space-y-1">
                                                    <span
                                                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                            isDarkMode
                                                                ? "bg-slate-800 text-slate-300"
                                                                : "bg-slate-100 text-slate-600"
                                                        }`}
                                                    >
                                                        {product.sku}
                                                    </span>
                                                    <h3 className="font-bold text-lg leading-tight text-blue-600 dark:text-blue-400">
                                                        {product.name}
                                                    </h3>
                                                    <p
                                                        className={`text-xs line-clamp-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                                                    >
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Price Allocation Layer */}
                                            <div className="flex justify-between items-baseline pt-2">
                                                <span
                                                    className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                                                >
                                                    Base Product Price
                                                </span>
                                                <span className="text-2xl font-black text-emerald-600 font-mono">
                                                    ${product.price}
                                                </span>
                                            </div>

                                            {/* INTEGRATED SERVICE BUNDLE ADD-ON CONTAINER */}
                                            <div
                                                onClick={() =>
                                                    toggleServiceCheckbox(
                                                        product.id,
                                                    )
                                                }
                                                className={`p-3.5 rounded-lg border-2 transition-all cursor-pointer select-none flex items-start gap-3 ${
                                                    hasAddonChecked
                                                        ? "bg-blue-50/10 border-blue-500"
                                                        : isDarkMode
                                                          ? "bg-slate-950 border-slate-800 hover:border-slate-700"
                                                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={hasAddonChecked}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 mt-0.5 cursor-pointer"
                                                />
                                                <div className="flex-1 space-y-0.5">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                                                            Add Service Operator
                                                            & Tuning Support
                                                            (Flat Price)
                                                        </h4>
                                                        <span className="text-xs font-bold text-emerald-600 font-mono">
                                                            +$
                                                            {
                                                                product
                                                                    .availableService
                                                                    .rate
                                                            }
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`text-[11px] leading-normal ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                                                    >
                                                        {
                                                            product
                                                                .availableService
                                                                .description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Card Pricing & Pre-Cart Controls */}
                                        <div
                                            className={`p-4 border-t px-5 flex flex-col sm:flex-row items-center gap-4 justify-between ${isDarkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"}`}
                                        >
                                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                                {/* Pre-Cart Quantity Selector Widgets */}
                                                <div className="flex items-center border rounded-lg overflow-hidden bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                                                    <button
                                                        onClick={() =>
                                                            handleCardQtyChange(
                                                                product.id,
                                                                -1,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 text-xs font-bold font-mono min-w-[2rem] text-center text-slate-800 dark:text-slate-200">
                                                        {activeCardQty}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleCardQtyChange(
                                                                product.id,
                                                                1,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-left">
                                                    <span className="text-[9px] uppercase text-slate-400 font-semibold block">
                                                        Estimated Group Cost
                                                    </span>
                                                    <span className="text-base font-bold font-mono text-emerald-600">
                                                        $
                                                        {product.price *
                                                            activeCardQty +
                                                            (hasAddonChecked
                                                                ? product
                                                                      .availableService
                                                                      .rate
                                                                : 0)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg uppercase tracking-wider transition-all transform active:scale-95 shadow-sm"
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

            {/* STICKY DRAW-PANEL CART FOOTER MODAL */}
            <footer
                className={`fixed bottom-0 inset-x-0 z-50 p-4 border-t shadow-[0_-15px_40px_rgba(0,0,0,0.15)] transition-all ${
                    isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white"
                        : "bg-white border-slate-200 text-slate-900"
                }`}
            >
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                    {/* Cart Status Totals */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="bg-blue-600 text-white h-12 w-12 rounded-xl flex items-center justify-center text-xl shadow-md font-bold">
                            🛒
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wide">
                                Master Order Terminal
                            </h4>
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                Total Units: {cartVolume} Items
                            </p>
                        </div>
                    </div>

                    {/* Horizontal Cart Line Item List View Panel */}
                    <div
                        className={`flex-1 flex items-center gap-2 overflow-x-auto p-2 rounded-lg border min-h-[52px] ${
                            isDarkMode
                                ? "bg-slate-950 border-slate-800"
                                : "bg-slate-50 border-slate-150"
                        }`}
                    >
                        {cart.length === 0 ? (
                            <p className="text-xs text-slate-400 font-medium tracking-wide w-full text-center py-1">
                                Your transactional workspace pipeline memory is
                                empty.
                            </p>
                        ) : (
                            cart.map((cartItem, idx) => (
                                <div
                                    key={`${cartItem.id}-${cartItem.hasService}-${idx}`}
                                    className={`inline-flex items-center gap-3 text-xs font-medium border px-2.5 py-1.5 rounded-md shadow-sm shrink-0 ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-700 text-white"
                                            : "bg-white border-slate-200 text-slate-800"
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold max-w-[120px] truncate text-blue-600 dark:text-blue-400">
                                            {cartItem.name}
                                        </span>
                                        {cartItem.hasService && (
                                            <span className="text-[9px] font-semibold text-amber-600 uppercase tracking-tight">
                                                + Operator Support (Flat)
                                            </span>
                                        )}
                                    </div>

                                    {/* Direct Checkout Panel Quantity Tweaks */}
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <button
                                            onClick={() =>
                                                handleUpdateCartQty(
                                                    cartItem.id,
                                                    cartItem.hasService,
                                                    -1,
                                                )
                                            }
                                            className="px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 font-bold transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-1.5 font-mono font-bold text-[11px] text-slate-800 dark:text-slate-200">
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
                                            className="px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 font-bold transition-colors"
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
                                        className="text-slate-400 hover:text-rose-500 font-bold transition-colors"
                                        title="Flush entry item index"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Operational Trigger Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200/40">
                        <div
                            className={`p-2 rounded border px-4 min-w-[140px] text-right ${
                                isDarkMode
                                    ? "bg-slate-950 border-slate-800"
                                    : "bg-slate-50 border-slate-200"
                            }`}
                        >
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                                Total Cart Value
                            </span>
                            <span className="text-xl font-black text-emerald-600 font-mono">
                                ${cartTotal.toLocaleString()}
                            </span>
                        </div>

                        <button
                            disabled={cart.length === 0}
                            onClick={() =>
                                alert(
                                    `Processing transaction ledger dispatch containing combined product-service arrays totaling: $${cartTotal}`,
                                )
                            }
                            className={`text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider transition-all whitespace-nowrap shadow-md ${
                                cart.length > 0
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white transform active:scale-95"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
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
