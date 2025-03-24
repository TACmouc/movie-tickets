import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

interface UserData {
    uid: string;
    email: string;
    birthdate: string;
    location: string;
    favoriteGenre: string;
}

export const getUserData = async (uid: string): Promise<UserData | null> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? (userDoc.data() as UserData) : null;
};

export const setUserData = async (uid: string, data: UserData): Promise<void> => {
    await setDoc(doc(db, "users", uid), data);
};
