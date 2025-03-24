"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import { collection, getDocs } from "firebase/firestore";
import PageTitle from "@/components/page-title";
import Link from "next/link";
import Image from "next/image";

interface Movie {
    id: string;
    name: string;
    genre: string;
    duration_minutes: number;
    rating: number;
    image: string;
}

export default function HomePage() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) router.push('/');
        });

        const fetchMovies = async () => {
            const moviesCollection = collection(db, "movies");
            const moviesSnapshot = await getDocs(moviesCollection);
            const moviesList = moviesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    genre: data.genre,
                    duration_minutes: data.duration_minutes,
                    rating: data.rating,
                    image: data.image // Include image field
                };
            }) as Movie[];
            setMovies(moviesList);
        };

        fetchMovies();

        return () => unsubscribe();
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageTitle title="Movies" />

            <main className="flex-grow flex justify-center bg-gray-100">
                <div className="w-full p-8">
                    <ul>
                        {movies.map(movie => (
                            <li key={movie.id} className="mb-4">
                                <Link href={`/movie?id=${movie.id}`}>
                                    <div className="bg-white rounded-lg shadow p-4 w-full flex items-center hover:shadow-md hover:bg-gray-200 transition duration-200">
                                        <Image width={80} height={0} src={movie.image} alt={movie.name} className="rounded-sm object-fit mr-4" />
                                        <div>
                                            <div className="text-lg font-semibold">{movie.name}</div>
                                            <div className="text-gray-600">Genre: {movie.genre}</div>
                                            <div className="text-gray-600">Duration: {movie.duration_minutes} minutes</div>
                                            <div className="text-gray-800">Rating: {movie.rating}</div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}