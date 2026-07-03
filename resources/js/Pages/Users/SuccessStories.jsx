import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SuccessStories({ packages, services, isDarkMode }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        item_type: "package",
        item_name: "",
        feedback: "",
        rating: 5,
    });

    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("success.stories.store"), {
            onSuccess: () => reset("feedback", "item_name", "rating"),
        });
    };

    const selectOptions = data.item_type === "package" ? packages : services;

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-300 ${
                isDarkMode
                    ? "bg-slate-950 text-slate-100"
                    : "bg-slate-50 text-slate-800"
            }`}
        >
            {/* 1. Header Injection Node */}
            <Header isDarkMode={isDarkMode} setIsDarkMode={() => {}} />

            {/* 2. Main Body Content Area */}
            <div className="flex-1 p-6 md:p-12 flex items-center justify-center">
                <div className="max-w-2xl w-full mx-auto space-y-8 my-auto">
                    {/* Heading Banner */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Share Your Success Story
                        </h1>
                        <p
                            className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                        >
                            Tell us how our customized modules helped streamline
                            your organizational processes.
                        </p>
                    </div>

                    {/* Feedback Submission Panel */}
                    <div
                        className={`p-6 md:p-8 rounded-xl border shadow-sm ${
                            isDarkMode
                                ? "bg-slate-900 border-slate-800"
                                : "bg-white border-slate-200"
                        }`}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Type Selection Tabs */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData((prev) => ({
                                            ...prev,
                                            item_type: "package",
                                            item_name: "",
                                        }))
                                    }
                                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                                        data.item_type === "package"
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : isDarkMode
                                              ? "border-slate-800 text-slate-400 hover:bg-slate-800"
                                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    ERP Package
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData((prev) => ({
                                            ...prev,
                                            item_type: "service",
                                            item_name: "",
                                        }))
                                    }
                                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                                        data.item_type === "service"
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : isDarkMode
                                              ? "border-slate-800 text-slate-400 hover:bg-slate-800"
                                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Core Service
                                </button>
                            </div>

                            {/* Dropdown Catalog Selection */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide">
                                    Select Item
                                </label>
                                <select
                                    value={data.item_name}
                                    onChange={(e) =>
                                        setData("item_name", e.target.value)
                                    }
                                    className={`w-full p-3 rounded border text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                                        isDarkMode
                                            ? "bg-slate-950 border-slate-800 text-slate-100"
                                            : "bg-white border-slate-200 text-slate-800"
                                    }`}
                                >
                                    <option value="" disabled>
                                        -- Choose a catalog option --
                                    </option>
                                    {selectOptions.map((name, idx) => (
                                        <option key={idx} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                {errors.item_name && (
                                    <span className="text-xs text-red-500">
                                        {errors.item_name}
                                    </span>
                                )}
                            </div>

                            {/* 5-Star Selection Matrix */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide">
                                    Rating Score
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() =>
                                                setData("rating", star)
                                            }
                                            onMouseEnter={() =>
                                                setHoveredRating(star)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredRating(0)
                                            }
                                            className="transition-transform transform hover:scale-110 focus:outline-none"
                                        >
                                            <svg
                                                className={`w-8 h-8 ${
                                                    star <=
                                                    (hoveredRating ||
                                                        data.rating)
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
                                </div>
                                {errors.rating && (
                                    <span className="text-xs text-red-500">
                                        {errors.rating}
                                    </span>
                                )}
                            </div>

                            {/* Feedback Area */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide">
                                    Your Experience Details
                                </label>
                                <textarea
                                    value={data.feedback}
                                    onChange={(e) =>
                                        setData("feedback", e.target.value)
                                    }
                                    rows="4"
                                    placeholder="Describe how this feature optimized your day-to-day workflow..."
                                    className={`w-full p-3 rounded border text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                                        isDarkMode
                                            ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600"
                                            : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                                    }`}
                                ></textarea>
                                {errors.feedback && (
                                    <span className="text-xs text-red-500">
                                        {errors.feedback}
                                    </span>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3 rounded text-xs font-bold uppercase tracking-wider text-white transition-all ${
                                    processing
                                        ? "bg-orange-400 cursor-not-allowed"
                                        : "bg-orange-500 hover:bg-orange-600"
                                }`}
                            >
                                {processing
                                    ? "Publishing Review..."
                                    : "Submit Review Log"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* 3. Footer Alignment Anchor */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
}
