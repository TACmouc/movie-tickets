// app/profile/page.tsx
"use client";

import Navbar from "../../components/navbar";
import { auth } from "../../firebase";
// import { useRouter } from "next/navigation";

export default function ProfilePage() {
    // const router = useRouter();
    const user = auth.currentUser;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Profil Utilisateur</h2>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Date inscription:</strong> {user?.metadata.creationTime}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}