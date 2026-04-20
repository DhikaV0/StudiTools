"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOGIN",
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (data.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/peminjam");
      }
    } catch {
      setError("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: `linear-gradient(135deg, var(--color-navy) 0%, var(--color-urban) 100%)`,
            }}
        >

            {/* Main Card */}
            <div className="relative w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <div className="flex flex-col md:flex-row">
                    {/* Brand Sidebar - Now integrated beside form */}
                    <div
                        className="md:w-2/5 p-8 md:p-10 relative overflow-hidden"
                        style={{
                            background: `linear-gradient(145deg, var(--color-navy) 0%, var(--color-urban) 100%)`,
                        }}
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="relative inline-block">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-neon to-cyan rounded-full blur opacity-70"></div>
                                    <Image
                                        src="/StudioTools.png"
                                        alt="Studio Tools Logo"
                                        width={64}
                                        height={64}
                                        className="relative rounded-2xl"
                                    />
                                </div>
                                <h2 className="text-3xl font-bold text-white mt-6 mb-2">
                                    Studio Tools
                                </h2>
                                <p className="text-white/70 text-sm">
                                    Professional Equipment Borrowing System
                                </p>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-0 left-0 w-40 h-40 bg-cyan/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* Form Section */}
                    <div className="md:w-3/5 p-8 md:p-10">
                        <div className="max-w-md mx-auto">
                            {/* Mobile Logo */}
                            <div className="md:hidden text-center mb-6">
                                <Image
                                    src="/StudioTools.png"
                                    alt="Studio Tools Logo"
                                    width={56}
                                    height={56}
                                    className="mx-auto mb-3 rounded-xl"
                                />
                                <h2
                                    className="text-2xl font-bold"
                                    style={{ color: `var(--color-navy)` }}
                                >
                                    Welcome Back
                                </h2>
                            </div>

                            <div className="text-center md:text-left">
                                <h1
                                    className="text-3xl font-bold mb-2"
                                    style={{ color: `var(--color-cyan)` }}
                                >
                                    Sign in
                                </h1>
                                <p className="text-white mb-6">
                                    to continue to your account
                                </p>
                            </div>

                            {error && (
                                <div
                                    className="mb-4 p-3 rounded-xl border text-sm flex items-center gap-2"
                                    style={{
                                        background: `rgba(255,101,132,0.1)`,
                                        borderColor: `var(--color-neon)`,
                                        color: `var(--color-neon)`,
                                    }}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon"></div>
                                    {error}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: `var(--color-cyan)` }}
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                                        style={{
                                            borderColor: `rgba(74,78,137,0.2)`,
                                        }}
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: `var(--color-cyan)` }}
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                                            style={{
                                                borderColor: `rgba(74,78,137,0.2)`,
                                            }}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 focus:ring-0"
                                            style={{
                                                accentColor: `var(--color-cyan)`,
                                            }}
                                        />
                                        <span className="text-sm text-white">
                                            Remember me
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, var(--color-navy), var(--color-urban))`,
                                        color: "white",
                                    }}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <LogIn size={18} />
                                            <span>Sign In</span>
                                            <ArrowRight
                                                size={16}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-sm text-white mt-6 text-center">
                                Don&apos;t have an account?{" "}
                                <a
                                    href="/register"
                                    className="font-semibold transition-colors hover:opacity-80"
                                    style={{ color: `var(--color-cyan)` }}
                                >
                                    Create account
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
