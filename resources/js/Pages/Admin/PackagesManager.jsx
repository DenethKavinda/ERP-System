import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function PackagesManager({ auth, carts = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Tracks editing states for Carts and individual Packages
    const [editingCartId, setEditingCartId] = useState(null);
    const [editingPackageId, setEditingPackageId] = useState(null);

    // Form 1: Building or updating a Package Cart Group Container
    const cartForm = useForm({
        cart_name: "",
        button_name: "",
        description: "",
        color_class: "from-blue-500 to-indigo-600",
        youtube_link: "", // FIXED POSITION: Unified walkway video added safely under Cart Level elements
    });

    // Form 2: Appending or updating a Specific Package Item
    const packageForm = useForm({
        package_cart_id: "",
        main_topic: "",
        small_description: "",
        package_name: "",
        price: "",
        suitable_business: "",
        core_features: "",
        benefits: "",
        rating: "5.0",
        discount_percentage: "0",
        discount_description: "",
    });

    // ==========================================
    // CART HANDLING EDIT & ACTION LOGIC
    // ==========================================
    const handleEditCartInit = (cart) => {
        setEditingCartId(cart.id);
        cartForm.setData({
            cart_name: cart.cart_name,
            button_name: cart.button_name,
            description: cart.description || "",
            color_class: cart.color_class,
            youtube_link: cart.youtube_link || "",
        });
    };

    const handleCancelCartEdit = () => {
        setEditingCartId(null);
        cartForm.reset();
    };

    const handleCreateOrUpdateCart = (e) => {
        e.preventDefault();
        if (editingCartId) {
            cartForm.put(`/admin/packages/cart/${editingCartId}`, {
                onSuccess: () => {
                    setEditingCartId(null);
                    cartForm.reset();
                },
            });
        } else {
            cartForm.post("/admin/packages/cart", {
                onSuccess: () => cartForm.reset(),
            });
        }
    };

    const handleDeleteCart = (id) => {
        if (
            confirm(
                "Are you sure you want to delete this cart? All its packages will be deleted automatically.",
            )
        ) {
            router.delete(`/admin/packages/cart/${id}`);
        }
    };

    // ==========================================
    // SEPARATED PACKAGE HANDLING EDIT & ACTION LOGIC
    // ==========================================
    const handleEditPackageInit = (pkg) => {
        setEditingPackageId(pkg.id);
        packageForm.setData({
            package_cart_id: pkg.package_cart_id,
            main_topic: pkg.main_topic,
            small_description: pkg.small_description || "",
            package_name: pkg.package_name,
            price: pkg.price,
            suitable_business: pkg.suitable_business,
            core_features: pkg.core_features,
            benefits: pkg.benefits,
            rating: pkg.rating || "5.0",
            discount_percentage: pkg.discount_percentage || "0",
            discount_description: pkg.discount_description || "",
        });
    };

    const handleCancelPackageEdit = () => {
        setEditingPackageId(null);
        packageForm.reset();
    };

    const handleCreateOrUpdatePackage = (e) => {
        e.preventDefault();
        if (editingPackageId) {
            packageForm.put(`/admin/packages/item/${editingPackageId}`, {
                onSuccess: () => {
                    setEditingPackageId(null);
                    packageForm.reset();
                },
            });
        } else {
            packageForm.post("/admin/packages/item", {
                onSuccess: () =>
                    packageForm.reset({
                        ...packageForm.data,
                        main_topic: "",
                        small_description: "",
                        package_name: "",
                        price: "",
                        suitable_business: "",
                        core_features: "",
                        benefits: "",
                        discount_percentage: "0",
                        discount_description: "",
                    }),
            });
        }
    };

    const handleDeletePackage = (id) => {
        if (
            confirm(
                "Are you sure you want to remove this specific package variant?",
            )
        ) {
            router.delete(`/admin/packages/item/${id}`);
        }
    };

    return (
        <div
            className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Packages Architecture Manager" />

            <Sidebar isDarkMode={isDarkMode} />

            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-10 overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            Packages Architecture Manager
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure core package category structures and embed
                            unified walkthrough system videos.
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
                    {/* SECTION A: CARTS FORM INTERFACE (WITH INTEGRATED YOUTUBE LINK ON STEP 1) */}
                    <div
                        className={`p-6 border rounded-xl shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-base font-black tracking-tight">
                                {editingCartId
                                    ? "🛠️ Edit Package Group Cart"
                                    : "Step 1: Create Package Group Cart"}
                            </h2>
                            {editingCartId && (
                                <button
                                    onClick={handleCancelCartEdit}
                                    className="text-[11px] font-bold text-red-500 hover:underline"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                        <form
                            onSubmit={handleCreateOrUpdateCart}
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

                            {/* LOCKED HERE: MAIN CATEGORY WALKTHROUGH LINK FOR THE ENTIRE CART GRID */}
                            <div className="p-3 border border-dashed rounded-lg border-blue-500/20 bg-blue-500/[0.01]">
                                <label className="block mb-1 font-bold text-blue-500 dark:text-blue-400">
                                    Main Category Walkthrough Video (YouTube
                                    Link)
                                </label>
                                <input
                                    type="url"
                                    value={cartForm.data.youtube_link}
                                    onChange={(e) =>
                                        cartForm.setData(
                                            "youtube_link",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                <span className="text-[10px] opacity-50 block mt-1">
                                    This video serves as the overarching guide
                                    layout video for all sub-packages
                                    underneath.
                                </span>
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
                                {editingCartId
                                    ? "Update Cart Node"
                                    : "Register Cart Component"}
                            </button>
                        </form>
                    </div>

                    {/* SECTION B: INDIVIDUAL PACKAGE SUB-ITEMS FORM */}
                    <div
                        className={`p-6 border rounded-xl shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-base font-black tracking-tight">
                                {editingPackageId
                                    ? "🛠️ Edit Individual Package Item"
                                    : "Step 2: Append System Package into Cart"}
                            </h2>
                            {editingPackageId && (
                                <button
                                    onClick={handleCancelPackageEdit}
                                    className="text-[11px] font-bold text-red-500 hover:underline"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                        <form
                            onSubmit={handleCreateOrUpdatePackage}
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
                                        placeholder="e.g. Cloud inventory tracking"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-bold">
                                        Price Structure (LKR Value)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
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

                            {/* DISCOUNT FIELD ATTRIBUTES */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-lg border border-dashed border-orange-500/20 bg-orange-500/[0.01]">
                                <div>
                                    <label className="block mb-1 font-bold text-orange-500">
                                        Discount Value (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={
                                            packageForm.data.discount_percentage
                                        }
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "discount_percentage",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="e.g., 12.50"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-bold text-orange-500">
                                        Discount Tag / Badge Description
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            packageForm.data
                                                .discount_description
                                        }
                                        onChange={(e) =>
                                            packageForm.setData(
                                                "discount_description",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="e.g., Seasonal Special Promo"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 font-bold">
                                    Suitable Business Profiles
                                </label>
                                <input
                                    type="text"
                                    value={packageForm.data.suitable_business}
                                    onChange={(e) =>
                                        packageForm.setData(
                                            "suitable_business",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-950 dark:border-slate-800"
                                    placeholder="e.g. Medium stores"
                                />
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
                                    placeholder="Quick introductory sentence..."
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
                                        placeholder="Feature nodes..."
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
                                        placeholder="System performance enhancements..."
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={packageForm.processing}
                                className="w-full bg-slate-800 dark:bg-orange-600 text-white font-bold py-2.5 rounded-md hover:brightness-110 uppercase tracking-wider text-[11px]"
                            >
                                {editingPackageId
                                    ? "Update Selected Package Node"
                                    : "Add Variant Node to Live Package Feed"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* AREA C: ACTION MANAGEMENT SUMMARY WORKSPACE FEED */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black tracking-tight border-b pb-2">
                        Configured Architectural Layout Nodes
                    </h2>
                    {carts.length === 0 ? (
                        <div className="p-12 text-center border border-dashed rounded-xl text-slate-400">
                            No layouts configured yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {carts.map((cart) => (
                                <div
                                    key={cart.id}
                                    className={`p-5 border rounded-xl flex flex-col justify-between md:flex-row gap-6 items-start transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                                >
                                    <div className="space-y-2 flex-1 w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
                                                {cart.youtube_link && (
                                                    <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                                                        📺 Category Overview
                                                        Video Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() =>
                                                        handleEditCartInit(cart)
                                                    }
                                                    className="px-2.5 py-1 text-[11px] font-bold bg-blue-500/10 text-blue-500 hover:bg-blue-50 hover:text-white rounded transition-all"
                                                >
                                                    Edit Cart
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteCart(
                                                            cart.id,
                                                        )
                                                    }
                                                    className="px-2.5 py-1 text-[11px] font-bold bg-red-500/10 text-red-500 hover:bg-red-50 hover:text-white rounded transition-all"
                                                >
                                                    Remove Cart
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs opacity-75">
                                            {cart.description}
                                        </p>

                                        {/* Sub-Packages List Layout View hooks */}
                                        {cart.packages &&
                                            cart.packages.length > 0 && (
                                                <div className="mt-3 pt-3 border-t space-y-2 border-slate-100 dark:border-slate-800">
                                                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold opacity-60">
                                                        Assigned Variants Feed:
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                                                        {cart.packages.map(
                                                            (p) => (
                                                                <div
                                                                    key={p.id}
                                                                    className="p-3 border rounded bg-slate-50 dark:bg-slate-950/40 dark:border-slate-800 flex justify-between items-center"
                                                                >
                                                                    <div>
                                                                        <span className="font-bold block text-slate-900 dark:text-white">
                                                                            {
                                                                                p.package_name
                                                                            }
                                                                        </span>
                                                                        <span className="opacity-60 text-[10px] text-orange-500 font-bold">
                                                                            {
                                                                                p.main_topic
                                                                            }{" "}
                                                                            —
                                                                            LKR{" "}
                                                                            {Number(
                                                                                p.price,
                                                                            ).toLocaleString(
                                                                                "en-US",
                                                                                {
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 2,
                                                                                },
                                                                            )}
                                                                        </span>
                                                                        {Number(
                                                                            p.discount_percentage,
                                                                        ) >
                                                                            0 && (
                                                                            <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded uppercase block w-max mt-1">
                                                                                {Number(
                                                                                    p.discount_percentage,
                                                                                ).toLocaleString(
                                                                                    "en-US",
                                                                                    {
                                                                                        maximumFractionDigits: 2,
                                                                                    },
                                                                                )}
                                                                                %
                                                                                OFF
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEditPackageInit(
                                                                                    p,
                                                                                )
                                                                            }
                                                                            className="text-blue-500 font-bold hover:underline px-1.5 py-0.5 rounded text-[11px]"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeletePackage(
                                                                                    p.id,
                                                                                )
                                                                            }
                                                                            className="text-red-500 font-bold hover:text-red-700 text-sm px-1"
                                                                            title="Remove Individual Package"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
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
