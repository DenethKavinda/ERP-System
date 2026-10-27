import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function SuccessStories({ auth, packages = [], feedbacks = [] }) {
    const { flash } = usePage().props;

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        item_name: "",
        feedback: "",
        rating: 5,
    });

    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("success.stories.store"), {
            onSuccess: () => {
                reset("feedback", "item_name", "rating");
                setSubmittedSuccessfully(true);
                setTimeout(() => setSubmittedSuccessfully(false), 6000);
            },
        });
    };

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-950 text-slate-100"
                    : "bg-slate-50 text-slate-800"
            }`}
        >
            <Head title="Success Stories - Nexus ERP" />

            {/* Header Navigation */}
            <Header
                auth={auth}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />

            {/* Main Body Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 space-y-12">
                {/* Heading Banner */}
                <div className="text-center space-y-3 pt-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        Customer Experiences
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                        Share Your Success Story
                    </h1>
                    <p
                        className={`text-sm md:text-base max-w-2xl mx-auto font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        Tell us how our ERP packages helped streamline your daily operations, inventory control, and organizational processes.
                    </p>
                </div>

                {/* Feedback Submission Panel */}
                <div
                    className={`p-6 sm:p-10 rounded-3xl border shadow-sm transition-all ${
                        isDarkMode
                            ? "bg-slate-900 border-slate-800"
                            : "bg-white border-slate-200 shadow-orange-500/5"
                    }`}
                >
                    {(submittedSuccessfully || flash?.success) && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-3">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{flash?.success || "Thank you for sharing your ERP success story!"}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Select ERP Package */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Select ERP Package
                            </label>
                            <select
                                value={data.item_name}
                                onChange={(e) =>
                                    setData("item_name", e.target.value)
                                }
                                className={`w-full p-3.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                                    isDarkMode
                                        ? "bg-slate-950 border-slate-800 text-slate-100"
                                        : "bg-slate-50/50 border-slate-200 text-slate-800"
                                }`}
                            >
                                <option value="" disabled>
                                    -- Choose an ERP package --
                                </option>
                                {packages.map((name, idx) => (
                                    <option key={idx} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                            {errors.item_name && (
                                <span className="text-xs text-red-500 font-semibold">
                                    {errors.item_name}
                                </span>
                            )}
                        </div>

                        {/* 5-Star Selection Matrix */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Rating Score
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setData("rating", star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform transform hover:scale-110 focus:outline-none cursor-pointer"
                                    >
                                        <svg
                                            className={`w-8 h-8 ${
                                                star <= (hoveredRating || data.rating)
                                                    ? "text-amber-400 fill-amber-400"
                                                    : isDarkMode
                                                      ? "text-slate-700"
                                                      : "text-slate-300"
                                            }`}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M11.48 3.499c.151-.316.604-.316.756 0l2.22 4.502 4.968.721c.35.051.49.482.236.734l-3.593 3.501.847 4.948c.06.35-.307.616-.617.451L12 16.162l-4.426 2.33c-.31.163-.677-.102-.617-.451l.847-4.948-3.593-3.501c-.254-.252-.114-.683.236-.734l4.968-.721 2.22-4.502z"
                                            />
                                        </svg>
                                    </button>
                                ))}
                                <span className="text-xs font-bold ml-2 text-slate-500 dark:text-slate-400">
                                    {hoveredRating || data.rating} of 5 Stars
                                </span>
                            </div>
                            {errors.rating && (
                                <span className="text-xs text-red-500 font-semibold">
                                    {errors.rating}
                                </span>
                            )}
                        </div>

                        {/* Experience Details */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Your Experience Details
                            </label>
                            <textarea
                                value={data.feedback}
                                onChange={(e) => setData("feedback", e.target.value)}
                                rows="5"
                                placeholder="Describe how this ERP package optimized your day-to-day workflow, inventory, billing, or multi-branch management..."
                                className={`w-full p-4 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                                    isDarkMode
                                        ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600"
                                        : "bg-slate-50/50 border-slate-200 text-slate-800 placeholder-slate-400"
                                }`}
                            ></textarea>
                            {errors.feedback && (
                                <span className="text-xs text-red-500 font-semibold">
                                    {errors.feedback}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 cursor-pointer ${
                                processing
                                    ? "bg-orange-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:scale-[1.01]"
                            }`}
                        >
                            {processing ? "Publishing Success Story..." : "Submit Success Story"}
                        </button>
                    </form>
                </div>

                {/* Existing Success Stories Feed */}
                {feedbacks && feedbacks.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight">
                                Recent ERP Customer Stories
                            </h2>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {feedbacks.length} {feedbacks.length === 1 ? "Story" : "Stories"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feedbacks.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-6 rounded-2xl border shadow-xs space-y-4 transition-all flex flex-col justify-between ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-800"
                                            : "bg-white border-slate-200 shadow-slate-100"
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                                {item.item_name}
                                            </span>
                                            <div className="flex gap-0.5 text-amber-400 fill-amber-400">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${
                                                            i < item.rating
                                                                ? "text-amber-400 fill-amber-400"
                                                                : isDarkMode
                                                                  ? "text-slate-800"
                                                                  : "text-slate-200"
                                                        }`}
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>

                                        <p
                                            className={`text-xs leading-relaxed italic ${
                                                isDarkMode ? "text-slate-300" : "text-slate-600"
                                            }`}
                                        >
                                            "{item.feedback}"
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-inherit flex items-center justify-between text-[11px]">
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {item.user?.business_name || item.user?.name || "Verified Customer"}
                                        </span>
                                        <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                                            {new Date(item.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
