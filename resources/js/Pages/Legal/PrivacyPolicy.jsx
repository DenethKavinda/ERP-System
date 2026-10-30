import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function PrivacyPolicy({ auth }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
            <Head title="Privacy Policy — Nexus ERP" />
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
                    <h1 className="text-3xl font-black tracking-tight mb-2">Privacy &amp; Data Protection Policy</h1>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">Nexus ERP Platform &bull; CodeXpress IT Solutions</p>
                    <p className={`text-sm leading-relaxed border-t pt-4 ${isDarkMode ? "text-slate-300 border-slate-800" : "text-slate-600 border-slate-100"}`}>
                        CodeXpress IT Solutions (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;) is committed to safeguarding the proprietary and personal information collected through <strong>portal.codexpressitsolutions.com</strong> and the associated ERP cloud nodes.
                    </p>
                </div>

                <div className={`rounded-3xl p-8 sm:p-10 border space-y-8 text-sm leading-relaxed ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>1. Information We Collect</h2>
                        <p>
                            We collect registration data (Name, Business Name, National Identity Card / Business Registration number, Corporate Email, Mobile Number, and Business Address) required for administrative provisioning and statutory billing compliance in Sri Lanka.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>2. Commercial &amp; ERP Operational Data</h2>
                        <p>
                            Data ingested into your ERP tenant — including customer ledgers, supplier purchase orders, product barcodes, batch serials, cashier shift balances, and sales bills — remains strictly tenant-isolated and confidential. We never sell, monetize, or disclose your business records to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>3. Payment Gateway Security</h2>
                        <p>
                            Online payments are processed directly through PayHere (Central Bank of Sri Lanka approved Payment Service Provider). CodeXpress IT Solutions never stores or sees credit card CVVs, full card numbers, or banking PINs.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>4. Data Retention &amp; Deletion</h2>
                        <p>
                            Active tenant databases are retained for the duration of the subscription. Upon verified written request or prolonged account termination, tenant databases and backup archives are purged within 30 days.
                        </p>
                    </section>
                </div>
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
