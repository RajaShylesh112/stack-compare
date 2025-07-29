"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { account, APPWRITE_PROJECT_ID } from "../appwrite";
import type { Models } from "appwrite";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState("login"); // 'login' or 'signup'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Check if a session already exists
            try {
                await account.get();
                // If no error, user is already logged in
                router.push("/profile");
                return;
            } catch {
                // Not logged in, proceed to create session
            }
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            setUser(user);
            setLoggedIn(true);
            router.push("/profile");
        } catch (err: any) {
            setError(err?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await account.create("unique()", email, password, name);
            const user = await account.get();
            setUser(user);
            setLoggedIn(true);
            router.push("/profile");
        } catch (err: any) {
            setError(err?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-white/10 border border-white/20 rounded-xl p-8 w-full max-w-md shadow-lg">
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-4 py-2 rounded-l font-semibold text-white ${mode === "login" ? "bg-[#232323]" : "bg-transparent border-r border-white/20"}`}
                        onClick={() => setMode("login")}
                        disabled={mode === "login"}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 rounded-r font-semibold text-white ${mode === "signup" ? "bg-[#232323]" : "bg-transparent border-l border-white/20"}`}
                        onClick={() => setMode("signup")}
                        disabled={mode === "signup"}
                    >
                        Sign Up
                    </button>
                </div>
                {mode === "login" ? (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-white mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}
                        <button
                            type="submit"
                            className="w-full py-3 rounded bg-[#232323] text-white font-semibold hover:bg-[#18181b] transition-colors disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label className="block text-white mb-2">Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}
                        <button
                            type="submit"
                            className="w-full py-3 rounded bg-[#232323] text-white font-semibold hover:bg-[#18181b] transition-colors disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>
                )}
                {loggedIn && user && (
                    <div className="mt-6 text-center">
                        <div className="text-white mb-2">Welcome, {user.name}!</div>
                        <a href="/profile" className="text-blue-300 underline mr-4">Go to Profile</a>
                        <a href="/profile/settings" className="text-blue-300 underline">Account Settings</a>
                    </div>
                )}
            </div>
        </div>
    );
}
