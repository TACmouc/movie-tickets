import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
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
