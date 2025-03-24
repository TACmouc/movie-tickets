"use client";

import { useRouter } from "next/navigation";

export default function PageTitle({ title }: { title: string }) {
    useRouter();
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">{title}</h1>
                    </div>
                </div>
            </div>
        </nav>
    );
}