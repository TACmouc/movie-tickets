"use client";

import { Suspense } from "react";
import BookComponent from "@/components/BookComponent";

export default function BookPage() {
    document.title = "Book";

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookComponent />
        </Suspense>
    );
}