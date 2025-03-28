"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { auth } from "../../services/firebase";
import { getUserData } from "../../services/userService";
import PageTitle from "@/components/page-title";

interface UserData {
    uid: string;
    email: string;
    birthdate: string;
    location: string;
    favoriteGenre: string;
}

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const user = auth.currentUser;

    useEffect(() => {
        document.title = "Profile";
        const fetchUserData = async () => {
            if (user) {
                const data = await getUserData(user.uid);
                if (data) {
                    setUserData(data as UserData);
                }
            }
        };
        fetchUserData();
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageTitle title={"Profil"} />

            <main className="flex-grow bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Profil Utilisateur</h2>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Date inscription:</strong> {user?.metadata.creationTime}</p>
                        {userData && (
                            <>
                                <p><strong>Date de naissance:</strong> {userData.birthdate}</p>
                                <p><strong>Localisation:</strong> {userData.location}</p>
                                <p><strong>Genre de film préféré:</strong> {userData.favoriteGenre}</p>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}