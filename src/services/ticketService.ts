import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

interface TicketData {
    id: string;
    ticketNumber: string;
    expirationDate: string;
    isUsed: boolean;
}

export const addTicket = async (uid: string, ticketData: Omit<TicketData, 'id'>): Promise<void> => {
    await addDoc(collection(db, "tickets"), { uid, ...ticketData });
};

export const getTickets = async (uid: string): Promise<TicketData[]> => {
    const q = query(collection(db, "tickets"), where("uid", "==", uid), orderBy("expirationDate"));
    const querySnapshot = await getDocs(q);
    const tickets: TicketData[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        tickets.push({
            id: doc.id,
            ticketNumber: data.ticketNumber,
            expirationDate: data.expirationDate,
            isUsed: data.isUsed,
        });
    });
    return tickets;
};

export const updateTicket = async (id: string, ticketData: Omit<TicketData, 'id'>): Promise<void> => {
    await updateDoc(doc(db, "tickets", id), ticketData);
};

export const deleteTicket = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "tickets", id));
};
