import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react"; // 🚀 FIXED: Added missing Head component import
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import axios from "axios";

export default function Services({ auth, services = [] }) {
    // UI Theme state controls
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

    const [showHistory, setShowHistory] = useState(false);
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

    // 🚀 FIXED: Wrapped explicitly inside window reference checks to eliminate runtime script initialization crashes
    const handleCheckoutConfirm = async () => {
        if (cart.length === 0) return;

        // Verify if PayHere's native library JavaScript file is loaded inside the browser DOM scope
        const payhereSDK =
            window.payhere || (typeof payhere !== "undefined" ? payhere : null);

        if (!payhereSDK) {
            alert(
                "PayHere payment gateway runtime engine script is not loaded. Please verify your script tags.",
            );
            return;
        }

        try {
            const serviceIds = cart.map((item) => item.id);

            // Post items array list payload to secure server side processing route
            const response = await axios.post("/checkout/services", {
                service_ids: serviceIds,
            });

            const paymentConfig = response.data;

            // Define programmatic event trigger behaviors expected by PayHere script engine
            payhereSDK.onCompleted = function onCompleted(orderId) {
                window.location.href =
                    "/checkout/success-callback?order_id=" +
                    orderId +
                    "&amount=" +
                    paymentConfig.amount +
                    "&items=" +
                    paymentConfig.items;
            };

            payhereSDK.onDismissed = function onDismissed() {
                console.log(
                    "Service payment gateway panel closed by action sequence.",
                );
            };

            payhereSDK.onError = function onError(error) {
                alert("PayHere verification pipeline error: " + error);
            };

            // Call native payment screen container lightbox
            payhereSDK.startPayment(paymentConfig);
        } catch (error) {
            console.error(
                "Failed to generate system payment payload metrics parameters:",
                error,
            );
            alert(
                "Unable to reach payment servers. Check your configurations.",
            );
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Service Workspace Center" />

            <div>
                <Header
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    auth={auth}
                />

                <main className="max-w-7xl mx-auto p-4 md:p-8 mt-4 relative">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-slate-800">
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                Infrastructure Services Catalog
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Deploy standalone custom system enhancements
                                directly into your framework logs pipelines.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
                        >
                            <span>🛒 Service Pipeline</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* CATEGORIES SELECTION SYSTEM TRACK */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 border rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all ${selectedCategory === cat ? "bg-orange-500 text-white border-orange-500 shadow-sm" : isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* CATALOG ROW DISPLAY LOG MATRIX */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredServices.map((service) => {
                            const isInCart = cart.some(
                                (item) => item.id === service.id,
                            );
                            return (
                                <div
                                    key={service.id}
                                    className={`p-6 border rounded-2xl flex flex-col justify-between shadow-xs transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded tracking-wider border dark:border-slate-800">
                                                {service.category}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {service.billing_type}
                                            </span>
                                        </div>
                                        <h3 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                                            {service.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                            {service.description ||
                                                "No runtime parameter configurations detailed."}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-dashed dark:border-slate-800 flex items-center justify-between gap-4">
                                        <div>
                                            <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">
                                                Price Cost
                                            </span>
                                            <span className="text-base font-black text-orange-500">
                                                LKR{" "}
                                                {Number(service.price).toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                toggleCartItem(service)
                                            }
                                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${isInCart ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-50 hover:text-white" : "bg-orange-500 border-orange-500 text-white hover:bg-orange-600"}`}
                                        >
                                            {isInCart
                                                ? "✕ Remove"
                                                : "➕ Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* OVERLAY SLIDE PIPELINE SYSTEM DRAWER CONTAINER */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <div
                        className={`w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col justify-between p-6 ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
                    >
                        <div className="space-y-6 overflow-y-auto max-h-[75vh]">
                            <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
                                <div>
                                    <h2 className="text-base font-black uppercase tracking-wider text-orange-500">
                                        Service Pipeline Cart
                                    </h2>
                                    <p className="text-[11px] opacity-60">
                                        Staged on-demand system components
                                        selection queue
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Close ✕
                                </button>
                            </div>

                            <div className="space-y-3">
                                {cart.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-12 text-center italic">
                                        Your service provisioning queue is
                                        empty.
                                    </p>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-3.5 border rounded-xl flex items-center justify-between gap-4 text-xs ${isDarkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}
                                        >
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">
                                                    {item.name}
                                                </h4>
                                                <span className="text-[10px] text-orange-500 font-extrabold">
                                                    LKR{" "}
                                                    {Number(item.price).toFixed(
                                                        2,
                                                    )}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    toggleCartItem(item)
                                                }
                                                className="text-rose-500 hover:text-rose-700 font-black text-sm px-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {cart.length > 0 && (
                            <div className="pt-4 border-t dark:border-slate-800 space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Grand Total Rate:
                                    </span>
                                    <span className="text-xl font-black text-emerald-500">
                                        LKR{" "}
                                        {calculateTotal().toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            },
                                        )}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckoutConfirm}
                                    className="w-full text-center py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-98"
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
