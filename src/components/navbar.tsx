"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <Link href="/movies" className="hidden md:block text-gray-700 hover:text-blue-500">
                            Accueil
                        </Link>
                        <Link href="/bookings" className="hidden md:block text-gray-700 hover:text-blue-500">
                            Bookings
                        </Link>
                        <Link href="/vouchers" className="hidden md:block text-gray-700 hover:text-blue-500">
                            Vouchers
                        </Link>
                        <Link href="/profile" className="hidden md:block text-gray-700 hover:text-blue-500">
                            Profile
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="hidden md:block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Déconnexion
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-blue-500 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/movies" className="block text-gray-700 hover:text-blue-500">
                            Accueil
                        </Link>
                        <Link href="/bookings" className="block text-gray-700 hover:text-blue-500">
                            Bookings
                        </Link>
                        <Link href="/vouchers" className="block text-gray-700 hover:text-blue-500">
                            Vouchers
                        </Link>
                        <Link href="/profile" className="block text-gray-700 hover:text-blue-500">
                            Profil
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}