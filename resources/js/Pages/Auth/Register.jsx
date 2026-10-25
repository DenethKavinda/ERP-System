import React, { useState, useEffect } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import { useT } from "@/hooks/useT";

export default function Register() {
    const { flash } = usePage().props;
    const t = useT();

    const [planInfo, setPlanInfo] = useState({
        plan: "free",
        title: "ERP Free Starter (30-Day Free Trial)",
        cycle: "monthly",
        isFree: true,
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        nic: "",
        name: "",
        business_name: "",
        address: "",
        mobile_number: "",
        email: "",
        plan: "free",
        cycle: "monthly",
        addons: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const planParam = (params.get("plan") || "free").toLowerCase();
            const cycleParam = params.get("cycle") || "monthly";
            const addonsParam = params.get("addons") || "";

            const planMap = {
                free: { title: "ERP Free Starter (30-Day Free Trial)", isFree: true },
                basic: { title: "ERP Basic Essentials (LKR 45,000 / mo)", isFree: false },
                pro: { title: "ERP Professional Growth (LKR 95,000 / mo)", isFree: false },
                enterprise: { title: "Enterprise Custom Core (LKR 195,000 / mo)", isFree: false },
            };

            const resolved = planMap[planParam] || {
                title: params.get("package_name") || "ERP Free Starter",
                isFree: planParam === "free",
            };

            setPlanInfo({
                plan: planParam,
                title: resolved.title,
                cycle: cycleParam,
                isFree: resolved.isFree,
            });

            setData((prev) => ({
                ...prev,
                plan: planParam,
                cycle: cycleParam,
                addons: addonsParam,
            }));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmEmail(data.email);
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirmModal(false);
        post("/register");
    };

    return (
        <div className="min-h-screen font-sans bg-[url('/img/registerANDlogin.jpg')] bg-cover bg-center text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-96 h-96 bg-orange-400/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="sm:mx-auto w-full max-w-xl relative z-10 animate-fade-in">
                <div className="text-center mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100/60 px-3 py-1.5 rounded-full inline-block mb-3">
                        {t("register.clientOnboarding")}
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                        {t("register.registerCompanyAccount")}
                    </h2>
                    <div className="mt-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{t("register.plan")} <strong className="font-black">{planInfo.title}</strong></span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                            {planInfo.isFree
                                ? t("register.freeTrialNotice")
                                : t("register.paidPlanNotice")}
                        </p>
                    </div>
                </div>

                <div className="bg-white/90 border border-amber-100/80 shadow-xl rounded-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-amber-200/40">
                    {/* Server-side errors */}
                    {errors.erp_provision && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <p className="text-xs text-amber-700 font-bold">{errors.erp_provision}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row 1: NIC */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                {t("register.nic")}
                            </label>
                            <input
                                type="text"
                                value={data.nic}
                                onChange={(e) => setData("nic", e.target.value)}
                                className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                                placeholder="e.g., 199512345678"
                                required
                            />
                            {errors.nic && (
                                <p className="text-[11px] text-red-500 mt-1 font-bold">
                                    {errors.nic}
                                </p>
                            )}
                        </div>

                        {/* Row 2: Full Name & Business Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                    {t("register.fullName")}
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-[11px] text-red-500 mt-1 font-bold">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                    {t("register.businessName")}
                                </label>
                                <input
                                    type="text"
                                    value={data.business_name}
                                    onChange={(e) =>
                                        setData("business_name", e.target.value)
                                    }
                                    className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                                    placeholder="Acme Enterprise"
                                />
                                {errors.business_name && (
                                    <p className="text-[11px] text-red-500 mt-1 font-bold">
                                        {errors.business_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address Field */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                {t("register.address")}
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors h-20 resize-none"
                                placeholder="Enter street address, city, country..."
                                required
                            />
                            {errors.address && (
                                <p className="text-[11px] text-red-500 mt-1 font-bold">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Row 3: Mobile & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                    {t("register.mobileNumber")}
                                </label>
                                <input
                                    type="tel"
                                    value={data.mobile_number}
                                    onChange={(e) =>
                                        setData("mobile_number", e.target.value)
                                    }
                                    className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                                    placeholder="+94 7X XXX XXXX"
                                    required
                                />
                                {errors.mobile_number && (
                                    <p className="text-[11px] text-red-500 mt-1 font-bold">
                                        {errors.mobile_number}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                    {t("register.emailAddress")}
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                                    placeholder="example@domain.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-[11px] text-red-500 mt-1 font-bold">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Info Notice — No password fields */}
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5">
                            <div className="flex items-start gap-2.5">
                                <svg className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-[11px] text-sky-800 font-semibold leading-relaxed">
                                    {t("register.passwordNotice")}
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 text-center bg-slate-900 hover:bg-orange-600 active:scale-[0.99] text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        >
                            {processing
                                ? t("register.creatingAccount")
                                : planInfo.isFree
                                    ? t("register.createAndActivateFree")
                                    : t("register.createAndContinuePayment")}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-amber-100 pt-4">
                        <p className="text-xs text-slate-400 font-medium">
                            {t("register.alreadyHaveAccount")}{" "}
                            <Link
                                href="/login"
                                className="text-orange-600 font-bold hover:underline transition-all"
                            >
                                {t("register.signInHere")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal — Shown before submitting */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 text-center">
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-black text-white">
                                {t("register.confirmErpLoginEmail")}
                            </h3>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5">
                            <p className="text-xs text-slate-500 font-medium text-center mb-4">
                                {t("register.credentialsSentTo")}
                            </p>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center mb-4">
                                <span className="text-sm font-black text-slate-900 font-mono">
                                    {confirmEmail}
                                </span>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                                <p className="text-[11px] text-amber-800 font-semibold text-center leading-relaxed">
                                    {t("register.emailConfirmNotice")}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                                >
                                    {t("register.goBack")}
                                </button>
                                <button
                                    onClick={handleConfirmSubmit}
                                    disabled={processing}
                                    className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? t("register.creating") : t("register.confirmAndCreate")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
