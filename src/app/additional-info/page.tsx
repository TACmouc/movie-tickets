"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AdditionalInfoPage() {
    const [birthdate, setBirthdate] = useState("");
    const [location, setLocation] = useState("");
    const [favoriteGenre, setFavoriteGenre] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    birthdate,
                    location,
                    favoriteGenre,
                });
                router.push("/home");
            } else {
                setError("User not authenticated");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error saving information");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                <h1 className="text-4xl font-bold">Additional Information</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
                    <input
                        type="date"
                        placeholder="Birthdate"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        list="location-suggestions"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <select
                        value={favoriteGenre}
                        onChange={(e) => setFavoriteGenre(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="" disabled>Select your favorite genre</option>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Horror">Horror</option>
                        <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                    </select>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-black dark:bg-white text-white dark:text-black gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        >
                            {isLoading ? "Loading..." : "Submit"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
