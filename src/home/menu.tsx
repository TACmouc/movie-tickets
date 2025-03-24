// app/movies/page.tsx
export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold">Salut !</h1>
        </div>
    );
}





// "use client";

// import { useEffect, useState } from "react";
// import { auth } from "./../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//     const [userPlaces, setUserPlaces] = useState([]);
//     const [newPlaceCode, setNewPlaceCode] = useState("");
//     const [validationDate, setValidationDate] = useState("");
//     const router = useRouter();

//     const handleAddPlace = () => {
//         // Ajouter la logique pour ajouter une place
//         console.log("Ajout d'une place avec code:", newPlaceCode);
//     };

//     const handleSignOut = async () => {
//         try {
//             await signOut(auth);
//             router.push('/');
//         } catch (error) {
//             console.error("Erreur lors de la déconnexion:", error);
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (!user) {
//                 router.push('/');
//             }
//         });
//         return () => unsubscribe();
//     }, [router]);

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <nav className="bg-white shadow-md">
//                 <div className="max-w-6xl mx-auto px-4">
//                     <div className="flex justify-between items-center h-16">
//                         <div className="flex space-x-4">
//                             <button
//                                 onClick={handleAddPlace}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                             >
//                                 Ajouter une place
//                             </button>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <button
//                                 onClick={handleSignOut}
//                                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                             >
//                                 Déconnexion
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </nav>

//             <div className="max-w-6xl mx-auto py-8 px-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Section Ajout de place */}
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <h2 className="text-xl font-semibold mb-4">Ajouter une place</h2>
//                         <div className="space-y-4">
//                             <input
//                                 type="text"
//                                 placeholder="Code de la place"
//                                 value={newPlaceCode}
//                                 onChange={(e) => setNewPlaceCode(e.target.value)}
//                                 className="w-full p-2 border rounded"
//                             />
//                             <input
//                                 type="date"
//                                 value={validationDate}
//                                 onChange={(e) => setValidationDate(e.target.value)}
//                                 className="w-full p-2 border rounded"
//                             />
//                             <button
//                                 onClick={handleAddPlace}
//                                 className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
//                             >
//                                 Valider la place
//                             </button>
//                         </div>
//                     </div>

//                     {/* Section Places possédées */}
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <h2 className="text-xl font-semibold mb-4">Mes places</h2>
//                         <div className="space-y-2">
//                             {userPlaces.length > 0 ? (
//                                 userPlaces.map((place, index) => (
//                                     <div key={index} className="p-2 border-b">
//                                         {/* Afficher les détails de la place */}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-gray-500">Aucune place disponible</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Section Profil */}
//                 <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-xl font-semibold mb-4">Profil</h2>
//                     <div className="space-y-2">
//                         <p>Email: {auth.currentUser?.email}</p>
//                         {/* Ajouter d'autres informations du profil ici */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }