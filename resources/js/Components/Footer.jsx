import React from "react";
import { router } from "@inertiajs/react";
import { useT } from "@/hooks/useT";

export default function Footer({ isDarkMode }) {
    const currentYear = new Date().getFullYear();
    const t = useT();

    const handleNavigate = (path) => {
        router.visit(path);
    };

    return (
        <footer
            className={`border-t transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400"
                    : "bg-white border-slate-200 text-slate-600"
            }`}
        >
            <div className="max-w-[1720px] mx-auto px-4 md:px-10 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3
                            className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                            {t("footer.enterpriseNode")}
                        </h3>
                        <p className="text-xs leading-relaxed">
                            {t("footer.missionStatement")}
                        </p>
                    </div>

                    {/* Quick Access Portal links */}
                    <div className="space-y-3">
                        <h4
                            className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                        >
                            {t("footer.corePortals")}
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <button
                                    onClick={() => handleNavigate("/ERP")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    {t("footer.erpPackages")}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigate("/services")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    {t("footer.services")}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigate("/success-stories")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    {t("header.successStories") || "Success Stories"}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Insights & Interaction links */}
                    <div className="space-y-3">
                        <h4
                            className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                        >
                            {t("footer.resources")}
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <button
                                    onClick={() =>
                                        handleNavigate("/contact-consultation")
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    {t("footer.contactConsultation")}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() =>
                                        handleNavigate("/knowledge-center")
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Knowledge Base &amp; Docs
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigate("/terms")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Terms of Service
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigate("/privacy")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigate("/refund-policy")}
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    Refund &amp; Cancellation
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / Bulletin Subscription */}
                    <div className="space-y-3">
                        <h4
                            className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                        >
                            {t("footer.stayUpdated")}
                        </h4>
                        <p className="text-xs">
                            {t("footer.subscribeSummaries")}
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert("Thank you! You are now subscribed to Nexus ERP feature updates.");
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="email"
                                required
                                placeholder={t("footer.emailPlaceholder")}
                                className={`text-xs px-3 py-2 rounded-xl border w-full focus:outline-none focus:border-orange-500 ${
                                    isDarkMode
                                        ? "bg-slate-950 border-slate-800 text-slate-200"
                                        : "bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                            />
                            <button
                                type="submit"
                                className="text-[11px] font-bold bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-xl uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                            >
                                {t("footer.join")}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lower Boundary Bar including Copyright */}
                <div
                    className={`pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs ${
                        isDarkMode ? "border-slate-800" : "border-slate-100"
                    }`}
                >
                    <div>
                        &copy; {currentYear} {t("footer.copyright")}
                    </div>
                </div>
            </div>
        </footer>
    );
}
