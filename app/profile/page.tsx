"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../appwrite";
import type { Models } from "appwrite";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const user = await account.get();
                setUser(user);
            } catch {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            router.push("/login");
        } catch (err: any) {
            setError(err?.message || "Logout failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
                <div className="text-white text-xl">Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-white/10 border border-white/20 rounded-xl p-8 w-full max-w-md shadow-lg text-white">
                <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
                <div className="mb-4">
                    <span className="font-semibold">Name:</span> {user.name}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Email:</span> {user.email}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">User ID:</span> {user.$id}
                </div>
                {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}
                <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded bg-[#232323] text-white font-semibold hover:bg-[#18181b] transition-colors mt-4"
                >
                    Logout
                </button>
            </div>
        </div>
    );
} 