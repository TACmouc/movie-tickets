"use client";

import { useEffect, useState, FormEvent, Fragment } from "react";
import { auth } from "../../services/firebase";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import { addTicket, getTickets, updateTicket, deleteTicket } from "../../services/ticketService";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

interface Ticket {
    id: string;
    ticketNumber: string;
    expirationDate: string;
    isUsed: boolean;
}

export default function VouchersPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
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
        try {
            const fetchedTickets = await getTickets(uid);
            setTickets(fetchedTickets);
        } catch (err) {
            setError("Error fetching tickets");
        }
    };

    const handleAddTicket = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const ticketNumberRegex = /^O\d{14}$/;
        if (!ticketNumberRegex.test(ticketNumber)) {
            setError("Le numéro de billet doit commencer par la lettre 'O' suivie de 14 chiffres.");
            setIsLoading(false);
            return;
        }

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

    const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTicketNumber(e.target.value.replace(/\s+/g, ""));
    };

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleDownloadQRCode = () => {
        if (selectedTicket) {
            const svg = document.getElementById("qrcode")?.outerHTML;
            const blob = new Blob([svg!], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${selectedTicket.ticketNumber}.svg`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleUpdateTicket = async (ticket: Ticket) => {
        try {
            await updateTicket(ticket.id, {
                ticketNumber: ticket.ticketNumber,
                expirationDate: ticket.expirationDate,
                isUsed: ticket.isUsed,
            });
            fetchTickets(auth.currentUser?.uid!);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error updating ticket");
        }
    };

    const handleDeleteTicket = async () => {
        if (selectedTicket) {
            const confirmed = window.confirm("Are you sure you want to delete this ticket?");
            if (confirmed) {
                try {
                    await deleteTicket(selectedTicket.id);
                    setSelectedTicket(null);
                    fetchTickets(auth.currentUser?.uid!);
                } catch (err) {
                    setError("Error deleting ticket");
                }
            }
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
                <div className="w-full max-w-6xl">
                    <h2 className="text-2xl font-semibold mb-4">Tickets non utilisés</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {tickets.filter(ticket => !ticket.isUsed).map(ticket => (
                            <div key={ticket.id} className="p-4 bg-white rounded shadow cursor-pointer flex flex-col items-center" onClick={() => handleTicketClick(ticket)}>
                                <Image src="/ticket-placeholder.png" alt="Ticket Image" width={150} height={150} className="mb-4" />
                                <p><strong>Numéro de billet:</strong> {ticket.ticketNumber}</p>
                                <p><strong>Date d&apos;expiration:</strong> {ticket.expirationDate}</p>
                            </div>
                        ))}
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Tickets utilisés</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tickets.filter(ticket => ticket.isUsed).map(ticket => (
                            <div key={ticket.id} className="p-4 bg-white rounded shadow cursor-pointer flex flex-col items-center" onClick={() => handleTicketClick(ticket)}>
                                <Image src="/ticket-placeholder.png" alt="Ticket Image" width={150} height={150} className="mb-4" />
                                <p><strong>Numéro de billet:</strong> {ticket.ticketNumber}</p>
                                <p><strong>Date d&apos;expiration:</strong> {ticket.expirationDate}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 flex items-center justify-center" onClose={() => setIsOpen(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title className="text-xl font-semibold">Ajouter un billet</Dialog.Title>
                                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleAddTicket} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Numéro de billet"
                                    value={ticketNumber}
                                    onChange={handleTicketNumberChange}
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
                    </TransitionChild>
                </Dialog>
            </Transition>

            {selectedTicket && (
                <Transition show={!!selectedTicket} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-10 flex items-center justify-center" onClose={() => setSelectedTicket(null)}>

                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold">Détails du billet</Dialog.Title>
                                    <button onClick={() => setSelectedTicket(null)} className="text-gray-500 hover:text-gray-700">
                                        &times;
                                    </button>
                                </div>
                                <form onSubmit={(e) => { e.preventDefault(); handleUpdateTicket(selectedTicket!); }} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Numéro de billet"
                                        value={selectedTicket.ticketNumber}
                                        onChange={(e) => setSelectedTicket({ ...selectedTicket, ticketNumber: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled
                                        required
                                    />
                                    <input
                                        type="date"
                                        placeholder="Date d&apos;expiration"
                                        value={selectedTicket.expirationDate}
                                        onChange={(e) => setSelectedTicket({ ...selectedTicket, expirationDate: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled
                                        required
                                    />
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedTicket.isUsed}
                                            onChange={(e) => {
                                                const updatedTicket = { ...selectedTicket, isUsed: e.target.checked };
                                                setSelectedTicket(updatedTicket);
                                                handleUpdateTicket(updatedTicket);
                                            }}
                                            className="mr-2"
                                        />
                                        <label>Utilisé</label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDeleteTicket}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full"
                                    >
                                        Supprimer
                                    </button>
                                    {error && <p className="text-red-500 mt-4">{error}</p>}
                                </form>
                                <div className="mt-4">
                                    <div id="qrcode" className="flex justify-center p-4">
                                        <QRCodeSVG value={selectedTicket.ticketNumber} size={128} />
                                    </div>
                                    <button
                                        onClick={handleDownloadQRCode}
                                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
                                    >
                                        Télécharger le QR Code
                                    </button>
                                </div>
                            </div>
                        </TransitionChild>
                    </Dialog>
                </Transition>
            )}
        </div>
    );
}