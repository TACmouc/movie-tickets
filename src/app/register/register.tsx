"use client";

import { FormEvent } from "react";
import Link from "next/link";

interface RegisterProps {
    email: string;
    password: string;
    error: string;
    isLoading: boolean;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onSubmit: (e: FormEvent) => void;
}

export default function Register({
                                     email,
                                     password,
                                     error,
                                     isLoading,
                                     onEmailChange,
                                     onPasswordChange,
                                     onSubmit,
                                 }: RegisterProps) {
    return (
        <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="absolute top-4 left-4">
                <Link
                    href="/"
                    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-black dark:bg-white text-white dark:text-black gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                >
                    &larr; Back
                </Link>
            </header>
            <main className="flex flex-col gap-8 items-center">
                <h1 className="text-4xl font-bold">Register</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={onSubmit} className="space-y-4 max-w-sm w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-black dark:bg-white text-white dark:text-black gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        >
                            {isLoading ? "Loading..." : "Register"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}