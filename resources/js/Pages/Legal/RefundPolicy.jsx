import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function RefundPolicy({ auth }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
            <Head title="Refund & Cancellation Policy — Nexus ERP" />
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} auth={auth} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/ERP"
                        className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider"
                    >
                        &larr; View ERP Pricing
                    </Link>
                    <div className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
                        Effective Date: October 30, 2026
                    </div>
                </div>

                <div className={`rounded-3xl p-8 sm:p-10 border mb-8 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Refund &amp; Cancellation Policy</h1>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">Nexus ERP Platform &bull; CodeXpress IT Solutions</p>
                    <p className={`text-sm leading-relaxed border-t pt-4 ${isDarkMode ? "text-slate-300 border-slate-800" : "text-slate-600 border-slate-100"}`}>
                        This Policy outlines the terms and conditions governing subscription cancellations, trial periods, and refund requests for software licenses and cloud services operated by CodeXpress IT Solutions.
                    </p>
                </div>

                <div className={`rounded-3xl p-8 sm:p-10 border space-y-8 text-sm leading-relaxed ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>1. 30-Day Free Starter Evaluation</h2>
                        <p>
                            We provide a 30-Day Free Starter workspace allowing full evaluation of core POS, invoicing, and inventory features prior to financial commitment. We encourage all prospective tenants to test their hardware and workflow during this free evaluation term.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>2. Monthly Subscription Cancellations</h2>
                        <p>
                            Monthly subscription plans can be cancelled at any time before the next billing cycle by contacting support or via administrative request. Upon cancellation, your tenant workspace remains active until the end of the paid 30-day period. No prorated partial-month refunds are issued.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>3. Annual Prepayment Refund Window</h2>
                        <p>
                            For Annual Prepayment plans, a full refund (minus payment processing fees) may be requested within 14 calendar days of initial purchase if the system cannot satisfy your verified operational requirements. After 14 days, annual plans are non-refundable.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>4. How to Submit a Refund Claim</h2>
                        <p>
                            To submit a cancellation or refund inquiry, send an official email from your registered account to <strong>support@codexpressitsolutions.com</strong> with your Customer ID (NXS-XXXXX), Order Reference, and reason for cancellation.
                        </p>
                    </section>
                </div>
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
