"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import Navbar from "../../components/navbar";

interface Booking {
    id: string;
    movieName: string;
    bookingTime: string;
}

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push('/');
                return;
            }

            const fetchBookings = async () => {
                try {
                    const bookingsCollection = collection(db, "bookings");
                    const q = query(bookingsCollection, where("user_id", "==", doc(db, "users", user.uid)));
                    const bookingsSnapshot = await getDocs(q);
                    const bookingsList = await Promise.all(bookingsSnapshot.docs.map(async (doc) => {
                        const bookingData = doc.data();
                        const showtimeDoc = await getDoc(bookingData.showtime_id);
                        const showtimeData = showtimeDoc.data();
                        const movieDoc = await getDoc(showtimeData.movie_id);
                        const movieData = movieDoc.data();
                        return {
                            id: doc.id,
                            movieName: movieData.name,
                            bookingTime: showtimeData.date.toDate().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
                        };
                    }));
                    setBookings(bookingsList);
                } catch (error) {
                    console.error("Error fetching bookings: ", error);
                }
            };

            fetchBookings();
        });

        return () => unsubscribe();
    }, [router]);

    const handleDelete = async (bookingId: string) => {
        try {
            await deleteDoc(doc(db, "bookings", bookingId));
            setBookings(bookings.filter(booking => booking.id !== bookingId));
            alert("Booking deleted successfully!");
        } catch (error) {
            console.error("Error deleting booking: ", error);
            alert("Failed to delete booking.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow flex justify-center bg-gray-100">
                <div className="w-full p-8">
                    <ul>
                        {bookings.map(booking => (
                            <li key={booking.id} className="mb-4">
                                <div className="bg-white p-4 rounded shadow flex justify-between items-center">
                                    <span className={"mr-4"}>{booking.movieName} - {booking.bookingTime}</span>
                                    <button
                                        onClick={() => handleDelete(booking.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}