"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, doc, addDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import Navbar from "../../components/navbar";
import PageTitle from "@/components/page-title";

interface GroupedShowtimes {
    [date: string]: { time: string, id: string }[];
}

export default function BookPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const movieId = searchParams.get("id");
    const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtimes>({});

    useEffect(() => {
        if (!movieId) {
            router.push('/');
            return;
        }

        const fetchShowtimes = async () => {
            try {
                const movieRef = doc(db, "movies", movieId);
                const showtimesCollection = collection(db, "showtimes");
                const q = query(showtimesCollection, where("movie_id", "==", movieRef));
                const showtimesSnapshot = await getDocs(q);
                const showtimesList = showtimesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    date: doc.data().date.toDate() // Convert Firestore Timestamp to Date
                }));

                const grouped: GroupedShowtimes = showtimesList.reduce((acc, showtime) => {
                    const dateKey = showtime.date.toLocaleDateString();
                    const time = showtime.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time without seconds
                    if (!acc[dateKey]) {
                        acc[dateKey] = [];
                    }
                    acc[dateKey].push({ time, id: showtime.id });
                    return acc;
                }, {} as GroupedShowtimes);

                setGroupedShowtimes(grouped);
            } catch (error) {
                console.error("Error fetching showtimes: ", error);
            }
        };

        fetchShowtimes();
    }, [movieId, router]);

    const handleBooking = async (showtimeId: string) => {
        const user = auth.currentUser;
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const showtimeRef = doc(db, "showtimes", showtimeId);
            await addDoc(collection(db, "bookings"), {
                user_id: userRef,
                showtime_id: showtimeRef
            });
            alert("Booking successful!");
        } catch (error) {
            console.error("Error creating booking: ", error);
            alert("Failed to create booking.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageTitle title="Book Showtimes" />

            <main className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-4xl m-8 p-8 bg-white h-fit rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Available Showtimes</h2>
                    <ul>
                        {Object.keys(groupedShowtimes).map(date => (
                            <li key={date} className="mb-4">
                                <div className="bg-gray-300 p-4 rounded">
                                    <h3 className="text-xl font-semibold">{date}</h3>
                                    <ul className="ml-4 mt-2">
                                        {groupedShowtimes[date].map((showtime, index) => (
                                            <li key={index} className="mb-1">
                                                <button
                                                    className="bg-gray-200 p-2 rounded"
                                                    onClick={() => handleBooking(showtime.id)}
                                                >
                                                    {showtime.time}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}