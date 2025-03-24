"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar";
import PageTitle from "@/components/page-title";
import Image from "next/image";
import Link from "next/link";

interface Movie {
    id: string;
    name: string;
    genre: string;
    duration_minutes: number;
    rating: number;
    description: string;
    release_date: string;
    image: string;
}

export default function MoviePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const movieId = searchParams.get("id");
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        if (!movieId) {
            router.push('/');
            return;
        }

        const fetchMovie = async () => {
            const movieDoc = doc(db, "movies", movieId);
            const movieSnapshot = await getDoc(movieDoc);
            if (movieSnapshot.exists()) {
                const data = movieSnapshot.data();
                setMovie({
                    id: movieSnapshot.id,
                    name: data.name,
                    genre: data.genre,
                    duration_minutes: data.duration_minutes,
                    rating: data.rating,
                    description: data.description,
                    release_date: data.release_date.toDate().toLocaleDateString(), // Convert release_date to string
                    image: data.image
                });
            } else {
                router.push('/');
            }
        };

        fetchMovie();
    }, [movieId, router]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageTitle title={movie.name} />

            <main className="flex-grow flex justify-center bg-gray-100">
                <div className="w-full max-w-4xl m-8 p-8 bg-white h-fit rounded-lg shadow">
                    <div className="flex flex-col md:flex-row items-center">
                        <Image width={200} height={0} src={movie.image} alt={movie.name} className="rounded-sm object-fit mb-4 md:mb-0 md:mr-4" />
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{movie.name}</h2>
                            <p className="text-gray-600 mb-2">Genre: {movie.genre}</p>
                            <p className="text-gray-600 mb-2">Duration: {movie.duration_minutes} minutes</p>
                            <p className="text-gray-600 mb-2">Rating: {movie.rating}</p>
                            <p className="text-gray-600 mb-2">Release Date: {movie.release_date}</p>
                            <p className="text-gray-800">{movie.description}</p>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Link href={`/book?id=${movie.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                            Book Now
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}