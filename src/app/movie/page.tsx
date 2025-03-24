"use client";

import { Suspense } from "react";
import MovieComponent from "../../components/MovieComponent";

export default function MoviePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MovieComponent />
        </Suspense>
    );
}