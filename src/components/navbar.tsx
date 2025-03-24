"use client";

import Link from "next/link";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
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
                    <div className="flex space-x-4">
                        <Link href="/movies" className="text-gray-700 hover:text-blue-500">
                            Accueil
                        </Link>
                        <Link href="/booking" className="text-gray-700 hover:text-blue-500">
                            Booking
                        </Link>
                        <Link href="/profile" className="text-gray-700 hover:text-blue-500">
                            Profil
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}