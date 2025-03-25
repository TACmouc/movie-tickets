"use client";

import { useEffect, useState, FormEvent, Fragment } from "react";
import { auth } from "../../services/firebase";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import { addTicket, getTickets } from "../../services/ticketService";
import { Dialog, Transition } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";

interface Ticket {
    id: string;
    ticketNumber: string;
    expirationDate: string;
    isUsed: boolean;
}

export default function VouchersPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketNumber, setTicketNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [isUsed, setIsUsed] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) router.push('/');
            else fetchTickets(user.uid);
        });

        return () => unsubscribe();
    }, [router]);

    const fetchTickets = async (uid: string) => {
        const fetchedTickets = await getTickets(uid);
        setTickets(fetchedTickets);
    };

    const handleAddTicket = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const user = auth.currentUser;
            if (user) {
                await addTicket(user.uid, {
                    ticketNumber,
                    expirationDate,
                    isUsed,
                });
                setTicketNumber("");
                setExpirationDate("");
                setIsUsed(false);
                setIsOpen(false);
                fetchTickets(user.uid);
            } else {
                setError("User not authenticated");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error saving ticket");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Vouchers</h1>
                    <p className="text-gray-600">Voici tes places</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="mb-8 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                    +
                </button>
                <div className="w-full max-w-4xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Tickets non utilisés</h2>
                        {tickets.filter(ticket => !ticket.isUsed).length > 0 ? (
                            tickets.filter(ticket => !ticket.isUsed).map(ticket => (
                                <div key={ticket.id} className="p-4 mb-4 bg-white rounded shadow flex items-center">
                                    <div className="mr-4">
                                        <p><strong>Numéro de billet:</strong> {ticket.ticketNumber}</p>
                                        <p><strong>Date d&apos;expiration:</strong> {ticket.expirationDate}</p>
                                    </div>
                                    <QRCodeSVG value={ticket.ticketNumber} size={64} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Aucun ticket non utilisé</p>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Tickets utilisés</h2>
                        {tickets.filter(ticket => ticket.isUsed).length > 0 ? (
                            tickets.filter(ticket => ticket.isUsed).map(ticket => (
                                <div key={ticket.id} className="p-4 mb-4 bg-white rounded shadow flex items-center">
                                    <div className="mr-4">
                                        <p><strong>Numéro de billet:</strong> {ticket.ticketNumber}</p>
                                        <p><strong>Date d&apos;expiration:</strong> {ticket.expirationDate}</p>
                                    </div>
                                    <QRCodeSVG value={ticket.ticketNumber} size={64} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Aucun ticket utilisé</p>
                        )}
                    </div>
                </div>
            </main>

            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 flex items-center justify-center" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black opacity-30" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
                            <Dialog.Title className="text-xl font-semibold mb-4">Ajouter un billet</Dialog.Title>
                            <form onSubmit={handleAddTicket} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Numéro de billet"
                                    value={ticketNumber}
                                    onChange={(e) => setTicketNumber(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="date"
                                    placeholder="Date d&apos;expiration"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isUsed}
                                        onChange={(e) => setIsUsed(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label>Utilisé</label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    {isLoading ? "Loading..." : "Ajouter un billet"}
                                </button>
                                {error && <p className="text-red-500 mt-4">{error}</p>}
                            </form>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </div>
    );
}