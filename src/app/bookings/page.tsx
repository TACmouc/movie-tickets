"use client";

import {CSSProperties, useEffect, useState} from "react";
import { auth, db } from "../../services/firebase";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, DocumentReference, Timestamp } from "firebase/firestore";
import Navbar from "../../components/navbar";
import PageTitle from "@/components/page-title";
import {ClipLoader} from "react-spinners";

interface Booking {
    id: string;
    movieName: string;
    bookingTime: string;
}

interface ShowtimeData {
    movie_id: DocumentReference;
    date: Timestamp;
}

interface MovieData {
    name: string;
}

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Bookings";
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
                        const showtimeData = showtimeDoc.data() as ShowtimeData;
                        const movieDoc = await getDoc(showtimeData.movie_id);
                        const movieData = movieDoc.data() as MovieData;
                        return {
                            id: doc.id,
                            movieName: movieData.name,
                            bookingTime: showtimeData.date.toDate().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
                        };
                    }));
                    setBookings(bookingsList);
                } catch (error) {
                    console.error("Error fetching bookings: ", error);
                } finally {
                    setLoading(false);
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

    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageTitle title={"Bookings"} />

            <main className="flex-grow flex justify-center bg-gray-100">
                <div className="w-full p-8">
                    {loading ? (
                        <div>
                            <p className="text-center text-gray-600">Loading bookings...</p>
                            <ClipLoader
                                color={"#000"}
                                loading={loading}
                                cssOverride={override}
                                size={150}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div>
                    ) : bookings.length === 0 ? (
                        <p className="text-center text-gray-600">No bookings found.</p>
                    ) : (
                        <ul>
                            {bookings.map(booking => (
                                <li key={booking.id} className="mb-4">
                                    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
                                        <span className="mr-4">{booking.movieName} - {booking.bookingTime}</span>
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
                    )}
                </div>
            </main>
        </div>
    );
}