"use client";

import { Suspense } from "react";
import MovieComponent from "../../components/MovieComponent";

export default function MoviePage() {
    document.title = "Movie";

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MovieComponent />
        </Suspense>
    );
}