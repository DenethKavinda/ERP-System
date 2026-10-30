import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function TermsOfService({ auth }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
            <Head title="Terms of Service — Nexus ERP" />
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
                    <h1 className="text-3xl font-black tracking-tight mb-2">Terms of Service</h1>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">Nexus ERP Platform &bull; CodeXpress IT Solutions</p>
                    <p className={`text-sm leading-relaxed border-t pt-4 ${isDarkMode ? "text-slate-300 border-slate-800" : "text-slate-600 border-slate-100"}`}>
                        These Terms of Service (&quot;Agreement&quot;) govern the access and use of the Nexus ERP enterprise resource planning software, Point of Sale (POS) suites, inventory management, cloud APIs, and associated web applications hosted at <strong>portal.codexpressitsolutions.com</strong> and <strong>selferp.codexpressitsolutions.com</strong>, operated by CodeXpress IT Solutions (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                    </p>
                </div>

                <div className={`rounded-3xl p-8 sm:p-10 border space-y-8 text-sm leading-relaxed ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>1. Acceptance of Terms &amp; Tenant Provisioning</h2>
                        <p>
                            By registering an account, purchasing a subscription package, or accessing any module within Nexus ERP, you certify that you are authorized to represent your business organization (&quot;Tenant&quot;), and agree to be bound by these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>2. Subscription Plans, Billing &amp; Invoicing</h2>
                        <p>
                            Subscriptions are billed on either a Monthly recurring basis or Annual prepayment (with a 2-month discount). Invoices and automated receipts are denominated in Sri Lankan Rupees (LKR) and processed via PayHere payment gateway or verified offline bank deposit. Failure to settle timely renewals may result in temporary service suspension.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>3. Plan Limits &amp; Resource Fair Use</h2>
                        <p>
                            Tenants must operate strictly within the user seat, warehouse, branch, and monthly bill quotas allocated to their active tier (Free Starter, Basic Essentials, Professional Growth, or Enterprise Custom Core). System limits are enforced at the API gateway layer.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>4. Data Ownership &amp; Security</h2>
                        <p>
                            The Tenant retains all right, title, and interest in their commercial data, including customer profiles, inventory items, and financial records. CodeXpress IT Solutions employs cryptographic safeguards, role-based access control, and automated daily database snapshots.
                        </p>
                    </section>

                    <section>
                        <h2 className={`text-lg font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>5. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by applicable laws of Sri Lanka, CodeXpress IT Solutions shall not be liable for indirect, incidental, or consequential damages resulting from network outages, third-party gateway downtime, or unauthorized credential disclosure by tenant personnel.
                        </p>
                    </section>
                </div>
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
