// src/utils/addUserToRoom.js
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { database as db } from "../firebase";

export const AddUserToRoom = async (roomId, user) => {
  try {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(roomRef);

    if (roomSnapshot.exists()) {
      const roomData = roomSnapshot.data();

      const isUserAlreadyMember = roomData.members?.some(
        (member) => member.uid === user.uid
      );

      if (!isUserAlreadyMember) {
        await updateDoc(roomRef, {
          members: arrayUnion({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Unknown",
          }),
          memberCount: increment(1),
        });
        console.log("User added to room successfully");
      } else {
        console.log("User is already a member of this room");
      }
    } else {
      console.error("Room not found");
    }
  } catch (error) {
    console.error("Failed to add user to room", error);
  }
};
