import React from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen font-sans bg-[url(''),_linear-gradient(to_bottom,_#fdfbf7,_#f7f4eb)] bg-amber-50/40 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Soft decorative background glowing spheres */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-orange-400/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="sm:mx-auto w-full max-w-md relative z-10 animate-fade-in">
                <div className="text-center mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100/60 px-3 py-1.5 rounded-full inline-block mb-3">
                        Secure Environment System
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                        Sign In to Dashboard
                    </h2>
                </div>

                <div className="bg-white/90 border border-amber-100/80 shadow-xl rounded-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-amber-200/40">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                Email Connection Endpoint
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                                placeholder="name@domain.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-[11px] text-red-500 mt-1 font-bold">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                                Account Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full text-xs font-medium bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <p className="text-[11px] text-red-500 mt-1 font-bold">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Node Token */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="h-4 w-4 text-orange-500 border-amber-200 rounded focus:ring-orange-400"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 block text-xs font-bold text-slate-500"
                                >
                                    Remember session signature
                                </label>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 text-center bg-slate-900 hover:bg-orange-600 active:scale-[0.99] text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
                        >
                            {processing
                                ? "Authenticating Session Token..."
                                : "Initialize Dashboard Connection"}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-amber-100 pt-4">
                        <p className="text-xs text-slate-400 font-medium">
                            New operator to this cluster?{" "}
                            <Link
                                href="/register"
                                className="text-orange-600 font-bold hover:underline transition-all"
                            >
                                Provision Account Node
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
