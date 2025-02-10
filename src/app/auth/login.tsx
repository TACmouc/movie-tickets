"use client";

import { FormEvent } from "react";

interface LoginProps {
    email: string;
    password: string;
    error: string;
    isLoading: boolean;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onSubmit: (e: FormEvent) => void;
}

export default function Login({
    email,
    password,
    error,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: LoginProps) {
    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Connexion</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={onSubmit} className="space-y-4">
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
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? "Chargement..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
}