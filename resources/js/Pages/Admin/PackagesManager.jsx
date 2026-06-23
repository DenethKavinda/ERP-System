import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function PackagesManager({ auth, carts = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeCartId, setActiveCartId] = useState("");

    // Form 1: Building a New Card/Cart Group Container
    const cartForm = useForm({
        cart_name: "",
        button_name: "",
        description: "",
        color_class: "from-blue-500 to-indigo-600",
    });

    // Form 2: Appending a Specific Package Item under a designated Cart Container
    const packageForm = useForm({
        package_cart_id: "",
        youtube_link: "",
        main_topic: "",
        small_description: "",
        package_name: "",
        price: "",
        suitable_business: "",
        core_features: "",
        benefits: "",
        rating: "5.0",
    });

    const handleCreateCart = (e) => {
        e.preventDefault();
        cartForm.post("/admin/packages/cart", {
            onSuccess: () => cartForm.reset(),
        });
    };

    const handleCreatePackage = (e) => {
        e.preventDefault();
        packageForm.post("/admin/packages/item", {
            onSuccess: () =>
                packageForm.reset({
                    ...packageForm.data,
                    youtube_link: "",
                    main_topic: "",
                    small_description: "",
                    package_name: "",
                    price: "",
                    suitable_business: "",
                    core_features: "",
                    benefits: "",
                }),
        });
    };

    return (
        <div
            className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Packages Administration Panel" />

            <Sidebar isDarkMode={isDarkMode} />

            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-10 overflow-y-auto">
                {/* Control Panel Top Banner Row */}
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            Packages Architecture Manager
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Assemble primary service packages and assign custom
                            layout cards onto the live user workspace view.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="px-4 py-2 text-xs font-bold border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800"
                    >
                        {isDarkMode ? "☀️ Light Node" : "🌙 Dark Node"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* SECTION A: CARD CREATION FORM AREA */}
                    <div
                        className={`p-6 border rounded-xl shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        <h2 className="text-base font-black tracking-tight border-b pb-2 mb-4">
                            Step 1: Create Package Group Cart
                        </h2>
                        <form
                            onSubmit={handleCreateCart}
                            className="space-y-4 text-xs font-medium"
                        >
                            <div>
                                <label className="block mb-1 font-bold">
                                    Cart Container Name
                                </label>
                                <input
                                    type="text"
                                    value={cartForm.data.cart_name}
                                    onChange={(e) =>
                                        cartForm.setData(
                                            "cart_name",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                    placeholder="e.g. Premium Enterprise Bundle"
                                />
                                {cartForm.errors.cart_name && (
                                    <p className="text-red-500 mt-0.5">
                                        {cartForm.errors.cart_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">
                                    Action Button Label
                                </label>
                                <input
                                    type="text"
                                    value={cartForm.data.button_name}
                                    onChange={(e) =>
                                        cartForm.setData(
                                            "button_name",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                    placeholder="e.g. BUY NOW"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">
                                    Color Theme Gradient
                                </label>
                                <select
                                    value={cartForm.data.color_class}
                                    onChange={(e) =>
                                        cartForm.setData(
                                            "color_class",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                >
                                    <option value="from-blue-500 to-indigo-600">
                                        Ocean Blue to Deep Indigo Gradient
                                    </option>
                                    <option value="from-emerald-500 to-teal-600">
                                        Emerald Mint to Deep Teal Gradient
                                    </option>
                                    <option value="from-orange-500 to-red-600">
                                        Sunset Orange to Flame Red Gradient
                                    </option>
                                    <option value="from-purple-600 to-pink-600">
                                        Orchid Purple to Coral Pink Gradient
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">
                                    General Cart Description
                                </label>
                                <textarea
                                    rows="3"
                                    value={cartForm.data.description}
                                    onChange={(e) =>
                                        cartForm.setData(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                    placeholder="A summary introduction detailing what these modules encompass..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={cartForm.processing}
                                className="w-full bg-orange-500 text-white font-bold py-2.5 rounded-md hover:bg-orange-600 uppercase tracking-wider text-[11px]"
                            >
                                Register Cart Component
                            </button>
                        </form>
                    </div>

                    {/* SECTION B: ASSIGN INDIVIDUAL PACKAGES UNTO GENERATED CARTS */}
                    <div
                        className={`p-6 border rounded-xl shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        <h2 className="text-base font-black tracking-tight border-b pb-2 mb-4">
                            Step 2: Append System Package into Cart
                        </h2>
                        <form
                            onSubmit={handleCreatePackage}
                            className="space-y-4 text-xs font-medium"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Select Target Cart Group
                                    </label>
                                    <select
                                        value={packageForm.data.package_cart_id}
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "package_cart_id",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                    >
                                        <option value="">
                                            -- Choose Container Box --
                                        </option>
                                        {carts.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.cart_name}
                                            </option>
                                        ))}
                                    </select>
                                    {packageForm.errors.package_cart_id && (
                                        <p className="text-red-500 mt-0.5">
                                            {packageForm.errors.package_cart_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Package Variant Name
                                    </label>
                                    <input
                                        type="text"
                                        value={packageForm.data.package_name}
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "package_name",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="e.g. Gold Tier Engine"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Main Category Topic Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={packageForm.data.main_topic}
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "main_topic",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="e.g. Inventory Management"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Price Structure (LKR Value)
                                    </label>
                                    <input
                                        type="number"
                                        value={packageForm.data.price}
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "price",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="e.g. 150000.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Suitable Business Profiles
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            packageForm.data.suitable_business
                                        }
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "suitable_business",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="e.g. Medium to Large Scale Supermarkets"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-bold">
                                        How-To Walkthrough Video (YouTube Link)
                                    </label>
                                    <input
                                        type="url"
                                        value={packageForm.data.youtube_link}
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "youtube_link",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 font-bold">
                                    Brief Sub-topic Description
                                </label>
                                <input
                                    type="text"
                                    value={packageForm.data.small_description}
                                    onChange={(e) =>
                                        packageForm.setData(
                                            "small_description",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                    placeholder="Quick one-line sales pitch..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Core Modules / Features List
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={packageForm.data.core_features}
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "core_features",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="Stock Tracking, Barcode Ingestion, Cloud Sync..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Operational System Benefits
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={packageForm.data.benefits}
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "benefits",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="Reduces shelf auditing overheads by 45%..."
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={packageForm.processing}
                                className="w-full bg-slate-800 dark:bg-orange-600 text-white font-bold py-2.5 rounded-md hover:brightness-110 uppercase tracking-wider text-[11px]"
                            >
                                Add Variant Node to Live Package Feed
                            </button>
                        </form>
                    </div>
                </div>

                {/* AREA C: DYNAMIC CONTROL LISTS SUMMARY MATRIX */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black tracking-tight border-b pb-2">
                        Configured Architectural Layout Nodes
                    </h2>
                    {carts.length === 0 ? (
                        <div className="p-12 text-center border border-dashed rounded-xl text-slate-400">
                            No layout structures configured yet. Apply
                            configurations above.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {carts.map((cart) => (
                                <div
                                    key={cart.id}
                                    className={`p-5 border rounded-xl flex flex-col justify-between md:flex-row gap-6 items-start ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-0.5 font-bold uppercase text-[9px] rounded text-white bg-gradient-to-r ${cart.color_class}`}
                                            >
                                                {cart.button_name}
                                            </span>
                                            <h3 className="font-extrabold text-base">
                                                {cart.cart_name}
                                            </h3>
                                        </div>
                                        <p className="text-xs opacity-75">
                                            {cart.description}
                                        </p>

                                        {/* Nested Packages display block */}
                                        {cart.packages &&
                                            cart.packages.length > 0 && (
                                                <div className="mt-3 pt-3 border-t space-y-2 border-slate-100 dark:border-slate-800">
                                                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold opacity-60">
                                                        Assigned Variants Feed:
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                                        {cart.packages.map(
                                                            (p) => (
                                                                <div
                                                                    key={p.id}
                                                                    className="p-2 border rounded bg-slate-50 dark:bg-slate-950/40 dark:border-slate-800 flex justify-between items-center"
                                                                >
                                                                    <div>
                                                                        <span className="font-bold block">
                                                                            {
                                                                                p.package_name
                                                                            }
                                                                        </span>
                                                                        <span className="opacity-60 text-[10px]">
                                                                            {
                                                                                p.main_topic
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <span className="font-black text-orange-500">
                                                                        LKR{" "}
                                                                        {parseFloat(
                                                                            p.price,
                                                                        ).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
