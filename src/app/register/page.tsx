// src/app/register/page.tsx
"use client";
import { useState, FormEvent } from "react";
import Register from "@/app/register/register";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleEmailChange = (email: string) => {
        setEmail(email);
    };

    const handlePasswordChange = (password: string) => {
        setPassword(password);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/additional-info");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Authentication error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Register
            email={email}
            password={password}
            error={error}
            isLoading={isLoading}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleSubmit}
        />
    );
}