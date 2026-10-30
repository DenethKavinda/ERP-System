import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function ContactConsultation({ auth }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: auth?.user?.name || "",
        business_name: auth?.user?.business_name || "",
        email: auth?.user?.email || "",
        phone: auth?.user?.mobile_number || "",
        branches: "1",
        needs: "ERP Subscription Consultation",
        message: "",
    });

    const WHATSAPP_NUMBER = "94777674308";

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
    };

    const handleWhatsAppDirect = () => {
        const text = `Hello CodeXpress ERP Team,\n\nI would like to request an ERP consultation.\nName: ${formData.name || "Customer"}\nBusiness: ${formData.business_name || "N/A"}\nEmail: ${formData.email || "N/A"}\nPhone: ${formData.phone || "N/A"}\nRequirement: ${formData.message || "General ERP deployment"}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
            <Head title="Contact & Consultation — Nexus ERP" />
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} auth={auth} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20 inline-block">
                        Expert Consultation & Deployment
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                        Let's Engineer Your <span className="text-orange-500">ERP System</span>
                    </h1>
                    <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                        Whether you are transitioning from paper ledgers or scaling across multiple stores and warehouses in Sri Lanka, our technical engineers are here to support your implementation.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Panel: Direct Channels & Information */}
                    <div className="space-y-6">
                        <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                            <h3 className="font-black text-lg mb-4 text-orange-500">Contact Channels</h3>
                            <div className="space-y-4 text-xs">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Hotline / WhatsApp</div>
                                        <div className="text-sm font-bold mt-0.5">+94 77 767 4308</div>
                                        <div className="text-slate-400 mt-0.5">Mon – Sat, 8:30 AM – 6:30 PM</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Corporate Email</div>
                                        <div className="text-sm font-bold mt-0.5">support@codexpressitsolutions.com</div>
                                        <div className="text-slate-400 mt-0.5">noreply@codexpressitsolutions.com</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Office & Operations</div>
                                        <div className="text-sm font-bold mt-0.5">CodeXpress IT Solutions</div>
                                        <div className="text-slate-400 mt-0.5">Colombo, Western Province, Sri Lanka</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleWhatsAppDirect}
                                    className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                                >
                                    <span>Chat on WhatsApp</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.78.829 2.796.829 3.182 0 5.767-2.587 5.767-5.766.001-3.181-2.585-5.816-5.767-5.816zm3.374 8.212c-.14.394-.712.723-1.026.772-.314.048-.716.088-2.316-.575-1.922-.796-3.14-2.774-3.235-2.902-.095-.128-.772-1.028-.772-1.96 0-.932.488-1.391.662-1.583.174-.192.381-.24.508-.24.127 0 .254.001.365.006.118.006.277-.045.433.329.16.384.545 1.332.593 1.429.048.096.08.208.016.335-.064.128-.096.208-.191.319-.096.112-.202.25-.288.336-.096.096-.197.2-.085.392.112.192.497.82 1.068 1.328.736.655 1.357.858 1.549.954.192.096.303.08.416-.048.112-.128.479-.559.607-.751.127-.192.255-.16.43-.096.176.064 1.114.526 1.305.622.191.096.319.144.366.224.048.08.048.463-.092.857z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Interactive Consultation Booking Form */}
                    <div className="lg:col-span-2">
                        <div className={`p-8 rounded-3xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                            {formSubmitted ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black">Consultation Request Received!</h3>
                                    <p className={`text-sm max-w-md mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                        Thank you, <span className="font-bold text-orange-500">{formData.name}</span>. Our deployment engineer will review your requirements for <span className="font-bold">{formData.business_name || "your enterprise"}</span> and reach out within 2 hours.
                                    </p>
                                    <button
                                        onClick={() => setFormSubmitted(false)}
                                        className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                                    >
                                        Submit Another Inquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <h3 className="text-xl font-black">Schedule Your Systems Consultation</h3>
                                        <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                            Tell us about your operational footprint and we will prepare a tailored system architecture.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                                                Your Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Kasun Perera"
                                                className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                                                Business / Company Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.business_name}
                                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                                placeholder="e.g. Ceylon Retailers PVT Ltd"
                                                className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                                                Business Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="kasun@ceylonretailers.lk"
                                                className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                                                Contact / WhatsApp Number *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="077 123 4567"
                                                className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                                                Active Store Locations
                                            </label>
                                            <select
                                                value={formData.branches}
                                                onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                                                className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                            >
                                                <option value="1">Single Branch / Store</option>
                                                <option value="2-5">2 to 5 Branches</option>
                                                <option value="6-15">6 to 15 Branches</option>
                                                <option value="15+">15+ Multi-Region Chain</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                                                Target Timeline
                                            </label>
                                            <select
                                                className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                            >
                                                <option>Immediate (Within 1–3 Days)</option>
                                                <option>Next 2–4 Weeks</option>
                                                <option>Exploratory / Budget Planning</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                                            Operational Requirements & Existing Systems
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us about your hardware (thermal printers, barcode scanners), current inventory challenges, or data migration needs..."
                                            className={`w-full text-xs px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                        <p className="text-[11px] text-slate-400">
                                            All consultation data is protected under our strict non-disclosure security policy.
                                        </p>
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/20 transition-all active:scale-95 cursor-pointer"
                                        >
                                            Submit Consultation Request
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
