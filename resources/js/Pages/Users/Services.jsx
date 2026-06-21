import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function Services({ services = [] }) {
    // UI Theme state controls
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Sync state with HTML class list to enable Tailwind dark: variants globally
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const categories = ["All", ...new Set(services.map((s) => s.category))];

    const filteredServices =
        selectedCategory === "All"
            ? services
            : services.filter((s) => s.category === selectedCategory);

    const toggleCartItem = (service) => {
        if (cart.some((item) => item.id === service.id)) {
            setCart(cart.filter((item) => item.id !== service.id));
        } else {
            setCart([...cart, service]);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + Number(item.price), 0);
    };

    const handleCheckoutConfirm = () => {
        alert(
            `Order Placed Successfully!\nTotal Services Selected: ${cart.length}\nTotal: LKR ${calculateTotal().toLocaleString()}`,
        );
        setCart([]);
        setIsCartOpen(false);
    };

    return (
        <div
            className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-950 text-slate-100"
                    : "bg-slate-50 text-slate-900"
            }`}
        >
            <div>
                {/* GLOBAL NAVBAR HEADER */}
                <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

                {/* IMMERSIVE HERO SECTION WITH DROPDOWN FILTER */}
                <div
                    className={`relative border-b backdrop-blur-sm ${
                        isDarkMode
                            ? "border-slate-900 bg-slate-950/40"
                            : "border-slate-200 bg-white/60"
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                                <div
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                        isDarkMode
                                            ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                            : "bg-orange-50 text-orange-600 border-orange-100"
                                    }`}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                                    Premium Modular Extensions
                                </div>
                                <h1
                                    className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}
                                >
                                    Standalone Ecosystem Services
                                </h1>
                                <p
                                    className={`max-w-2xl text-sm ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Deploy highly targeted solutions modularly
                                    to expand your workspace capabilities
                                    instantly.
                                </p>
                            </div>

                            {/* INLINE DROPDOWN FILTER */}
                            <div className="space-y-1.5 max-w-xs">
                                <label
                                    htmlFor="category-select"
                                    className="block text-[10px] font-bold uppercase tracking-widest text-slate-400"
                                >
                                    Ecosystem Catalog
                                </label>
                                <div className="relative">
                                    <select
                                        id="category-select"
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value)
                                        }
                                        className={`w-full appearance-none px-4 py-2.5 border rounded-xl text-xs font-bold tracking-wide shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer pr-10 capitalize ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800 text-slate-200"
                                                : "bg-white border-slate-200 text-slate-700"
                                        }`}
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}{" "}
                                                {category === "All"
                                                    ? "Catalog"
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <div
                                        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 border-l my-2 ${
                                            isDarkMode
                                                ? "border-slate-800"
                                                : "border-slate-200"
                                        }`}
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WORKSPACE FLOATING ACTION CARD */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className={`relative group p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 shadow-md shrink-0 self-start md:self-auto ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                                    : "bg-white border-slate-200 text-slate-900 hover:border-slate-300"
                            }`}
                        >
                            <div
                                className={`p-3 rounded-xl text-orange-500 transition-transform group-hover:scale-110 ${
                                    isDarkMode ? "bg-slate-800" : "bg-slate-100"
                                }`}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                </svg>
                                {cart.length > 0 && (
                                    <span className="absolute top-3 left-3 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                    </span>
                                )}
                            </div>
                            <div className="text-left font-bold text-sm tracking-tight pr-4">
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Active Basket
                                </span>
                                {cart.length}{" "}
                                {cart.length === 1
                                    ? "Module Selected"
                                    : "Modules Selected"}
                            </div>
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT FULL-WIDTH DISPLAY GRID */}
                <main className="max-w-7xl mx-auto px-6 py-12">
                    {filteredServices.length === 0 ? (
                        <div
                            className={`border border-dashed p-16 text-center rounded-2xl ${
                                isDarkMode
                                    ? "bg-slate-900/40 border-slate-800 text-slate-400"
                                    : "bg-white border-slate-300 text-slate-500"
                            }`}
                        >
                            <p className="text-sm font-semibold">
                                No operational modules found in records.
                            </p>
                        </div>
                    ) : (
                        /* Balanced 3-Column Grid rows */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((service) => {
                                const isInCart = cart.some(
                                    (item) => item.id === service.id,
                                );
                                return (
                                    <div
                                        key={service.id}
                                        className={`border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm group ${
                                            isDarkMode
                                                ? "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                                                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                                        }`}
                                    >
                                        {/* Content Frame */}
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${
                                                        isDarkMode
                                                            ? "bg-slate-800 text-slate-300"
                                                            : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    {service.billing_type}
                                                </span>
                                                <div
                                                    className={`h-1.5 w-1.5 rounded-full transition-colors group-hover:bg-orange-500 ${
                                                        isDarkMode
                                                            ? "bg-slate-700"
                                                            : "bg-slate-300"
                                                    }`}
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <h3
                                                    className={`font-bold text-lg tracking-tight ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-slate-900"
                                                    }`}
                                                >
                                                    {service.name}
                                                </h3>
                                                <p
                                                    className={`text-xs leading-relaxed line-clamp-4 ${
                                                        isDarkMode
                                                            ? "text-slate-400"
                                                            : "text-slate-600"
                                                    }`}
                                                >
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Interactive Segment */}
                                        <div
                                            className={`p-4 border-t px-6 flex items-center justify-between ${
                                                isDarkMode
                                                    ? "border-slate-800 bg-slate-950/40"
                                                    : "border-slate-200 bg-slate-50"
                                            }`}
                                        >
                                            <div>
                                                <span className="text-base font-black text-orange-500 block tracking-tight">
                                                    LKR{" "}
                                                    {Number(
                                                        service.price,
                                                    ).toLocaleString()}
                                                </span>
                                                <span className="text-[9px] font-medium text-slate-400 block uppercase tracking-wider">
                                                    {service.billing_type ===
                                                    "monthly"
                                                        ? "per month"
                                                        : "one-time"}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    toggleCartItem(service)
                                                }
                                                className={`text-xs font-bold px-4 py-2 rounded transition-all shadow-sm transform active:scale-95 uppercase tracking-wider ${
                                                    isInCart
                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                        : isDarkMode
                                                          ? "bg-white text-slate-900 hover:bg-slate-100"
                                                          : "bg-slate-900 text-white hover:bg-slate-800"
                                                }`}
                                            >
                                                {isInCart
                                                    ? "Selected ✓"
                                                    : "Add Asset"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* CART POP-UP OVERLAY MODAL */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-end">
                    <div
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <div
                        className={`relative w-full max-w-md h-screen border-l shadow-2xl p-6 flex flex-col justify-between ${
                            isDarkMode
                                ? "bg-slate-900 border-slate-800 text-white"
                                : "bg-white border-slate-200 text-slate-900"
                        }`}
                    >
                        <div>
                            <div
                                className={`flex justify-between items-center mb-8 pb-4 border-b ${
                                    isDarkMode
                                        ? "border-slate-800"
                                        : "border-slate-100"
                                }`}
                            >
                                <h3 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    Active Pipeline Basket
                                </h3>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className={`transition-colors ${
                                        isDarkMode
                                            ? "text-slate-400 hover:text-white"
                                            : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="overflow-y-auto space-y-3 pr-1 max-h-[65vh]">
                                {cart.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400 text-xs font-medium">
                                        Your live workspace cart is empty.
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-4 border rounded-xl flex items-center justify-between gap-4 ${
                                                isDarkMode
                                                    ? "bg-slate-950/40 border-slate-800"
                                                    : "bg-slate-50 border-slate-200"
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold tracking-tight truncate">
                                                    {item.name}
                                                </h4>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">
                                                    LKR{" "}
                                                    {Number(
                                                        item.price,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    toggleCartItem(item)
                                                }
                                                className="text-[11px] text-red-500 hover:text-red-600 font-bold uppercase tracking-wider shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {cart.length > 0 && (
                            <div
                                className={`border-t pt-6 space-y-4 ${
                                    isDarkMode
                                        ? "border-slate-800"
                                        : "border-slate-200"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Grand Total:
                                    </span>
                                    <span className="text-xl font-black text-emerald-500">
                                        LKR {calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckoutConfirm}
                                    className="w-full text-center py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-widest rounded shadow-md transition-all transform active:scale-[0.99]"
                                >
                                    Confirm Pipeline
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
