// firestoreUtils.js
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { database as db } from "../firebase"; // Adjust the import path as needed

export const AddUserToRoom = async (roomId, user) => {
  try {
    const roomRef = doc(db, "rooms", roomId);

    // Add user to members array and increment memberCount
    await updateDoc(roomRef, {
      members: arrayUnion({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Unknown",
      }),
      memberCount: increment(1),
    });

    console.log("User added to room successfully");
  } catch (error) {
    console.error("Failed to add user to room", error);
  }
};
