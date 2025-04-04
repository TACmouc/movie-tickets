"use client"
import { useState, FormEvent } from "react";
import { auth } from "../../services/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import Login from "@/app/login/login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    document.title = "Login";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState("");
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
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/movies');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Authentication error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setResetMessage("");
        setError("");
        try {
            await sendPasswordResetEmail(auth, email);
            setResetMessage("Password reset email sent!");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error sending reset email");
        }
    };

    return (
        <Login
            email={email}
            password={password}
            error={error}
            isLoading={isLoading}
            resetMessage={resetMessage}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleSubmit}
            onResetPassword={handleResetPassword}
        />
    );
}