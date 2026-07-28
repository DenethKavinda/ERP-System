import React from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nic: "",
        name: "",
        address: "",
        mobile_number: "",
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register", {
            onFinish: () => reset(),
        });
    };

    return (
        <div className="min-h-screen font-sans bg-[url('/img/registerANDlogin.jpg')] bg-cover bg-center text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Soft decorative background glowing spheres */}
            <div className="absolute -top-10 -left-10 w-96 h-96 bg-orange-400/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="sm:mx-auto w-full max-w-xl relative z-10 animate-fade-in">
                <div className="text-center mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100/60 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-sm">
                        Free Trial Registration
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                        Create Your ERP Account
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                        Fill in your details below to receive instant access credentials
                    </p>
                </div>

                <div className="bg-white/90 border border-amber-100/80 shadow-xl rounded-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-amber-200/40">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row 1: NIC & Full Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                    National Identity Card (NIC)
                                </label>
                                <input
                                    type="text"
                                    value={data.nic}
                                    onChange={(e) =>
                                        setData("nic", e.target.value)
                                    }
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

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                    Full Name
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
                        </div>

                        {/* Address Field */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                Physical / Business Address
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

                        {/* Row 2: Mobile Number & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                    Mobile Number
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
                                    Email Address
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

                        {/* Info Banner: System Generated Password */}
                        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
                            <div className="p-1.5 bg-orange-500 text-white rounded-lg shrink-0 mt-0.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
                                </svg>
                            </div>
                            <div className="text-xs text-slate-700">
                                <p className="font-bold text-slate-900">Instant Free Trial Access Credentials</p>
                                <p className="mt-0.5 text-slate-600">
                                    A system-generated secure password and direct ERP login link will be emailed immediately to your registered address upon submission.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 text-center bg-slate-900 hover:bg-orange-600 active:scale-[0.99] text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
                        >
                            {processing
                                ? "Creating Free Trial Account..."
                                : "Register & Claim Free Trial Access"}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-amber-100 pt-4">
                        <p className="text-xs text-slate-400 font-medium">
                            Already configured an account?{" "}
                            <Link
                                href="/login"
                                className="text-orange-600 font-bold hover:underline transition-all"
                            >
                                Connect Credentials
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
