// register.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, UserPlus, Check, X, ArrowRight, Shield, Gift } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    { label: "Contains uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "Contains lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const isPasswordValid = passwordRequirements.every(req => req.test(password));
    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REGISTER",
          fullName,
          username,
          password,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, var(--color-navy) 0%, var(--color-urban) 100%)` }}>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="flex flex-col md:flex-row">
          {/* Brand Sidebar */}
          <div className="md:w-2/5 p-8 md:p-10 relative overflow-hidden" style={{ background: `linear-gradient(145deg, var(--color-navy) 0%, var(--color-urban) 100%)` }}>
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
                <h2 className="text-3xl font-bold text-white mt-6 mb-2">Studio Tools</h2>
                <p className="text-white/70 text-sm">Join the creative community</p>
              </div>

            </div>
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
                <h2 className="text-2xl font-bold" style={{ color: `var(--color-navy)` }}>Get Started</h2>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2" style={{ color: `var(--color-cyan)` }}>Create account</h1>
                <p className="text-white mb-6">Start your creative journey today</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl border text-sm flex items-center gap-2" style={{ background: `rgba(255,101,132,0.1)`, borderColor: `var(--color-neon)`, color: `var(--color-neon)` }}>
                  <X size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-xl border text-sm flex items-center gap-2" style={{ background: `rgba(0,194,255,0.1)`, borderColor: `var(--color-cyan)`, color: `var(--color-cyan)` }}>
                  <Check size={16} />
                  <span>Registration successful! Redirecting to login...</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-cyan)` }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    style={{ borderColor: `rgba(74,78,137,0.2)` }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-cyan)` }}>Username</label>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    style={{ borderColor: `rgba(74,78,137,0.2)` }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-cyan)` }}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      style={{ borderColor: `rgba(74,78,137,0.2)` }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.test(password);
                      return (
                        <div key={index} className="flex items-center gap-1.5">
                          {isValid ? (
                            <Check size={12} className="text-green-500 shrink-0" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-300 shrink-0"></div>
                          )}
                          <span className={isValid ? "text-green-600" : "text-gray-500"}>{req.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mt-6"
                  style={{ background: `linear-gradient(135deg, var(--color-navy), var(--color-urban))`, color: 'white' }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Create Account</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-sm text-white mt-6 text-center">
                Already have an account?{" "}
                <a href="/login" className="font-semibold transition-colors hover:opacity-80" style={{ color: `var(--color-cyan)` }}>
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}