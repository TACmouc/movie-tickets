"use client";

import { useEffect } from "react";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) router.push('/');
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Booking</h1>
                    <p className="text-gray-600">Voici tes places</p>
                </div>
            </main>
        </div>
    );
}