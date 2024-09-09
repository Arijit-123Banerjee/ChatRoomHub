import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TfiWorld } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import { database as db } from "../firebase"; // Import Firestore
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";

const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
  const [roomName, setRoomName] = useState("");
  const [status, setStatus] = useState("Public");
  const [roomKey, setRoomKey] = useState("");
  const [isCreating, setIsCreating] = useState(false); // New state for loading

  // Generate a random 4-digit room key for private rooms
  const generateRoomKey = () => {
    const key = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomKey(key);
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === "Private") {
      generateRoomKey(); // Generate a room key if private
    } else {
      setRoomKey(""); // Clear room key if public
    }
  };

  // Handle room creation logic
  const handleCreate = async () => {
    if (roomName && auth.currentUser) {
      setIsCreating(true); // Set loading state to true
      try {
        const userId = auth.currentUser.uid;

        // Create room data
        const roomData = {
          name: roomName,
          users: [userId], // Initialize with the creator
          messages: [], // Empty messages array initially
          status, // Add status here
        };

        if (status === "Private") {
          roomData.roomKey = roomKey; // Add room key if private
        }

        // Store the room data in Firestore
        const roomRef = doc(db, "rooms", roomName); // Use room name or generate unique ID for the room
        await setDoc(roomRef, roomData);

        // Create a demo message in the room
        const demoMessage = {
          senderUid: userId,
          content: "Welcome to the room! Feel free to introduce yourself.",
          timestamp: new Date().toISOString(), // Use the current timestamp
        };

        await setDoc(
          roomRef,
          {
            messages: [demoMessage],
          },
          { merge: true }
        );

        // Call the onCreate callback with the new room data
        onCreate({ ...roomData, id: roomName });

        // Reset state after room creation
        setRoomName("");
        setStatus("Public");
        setRoomKey("");
      } catch (error) {
        console.error("Failed to create room", error);
      } finally {
        setIsCreating(false); // Reset loading state
        onClose(); // Close the modal
      }
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Create Room
            </Dialog.Title>
            <div className="space-y-4">
              {/* Room Name Input */}
              <div>
                <label htmlFor="room-name" className="block text-gray-600">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                  disabled={isCreating} // Disable input when creating
                />
              </div>
              {/* Status Selection */}
              <div>
                <label className="block text-gray-600 mb-2">Status</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Public")}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      status === "Public"
                        ? "bg-gradient-to-r from-cyan-700 to-blue-800 text-white"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                    disabled={isCreating} // Disable button when creating
                  >
                    <TfiWorld className="mr-2" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Private")}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      status === "Private"
                        ? "bg-gradient-to-r from-cyan-700 to-blue-800 text-white"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    disabled={isCreating} // Disable button when creating
                  >
                    <CiLock className="mr-2" />
                    Private
                  </button>
                </div>
              </div>
              {/* Display Room Key for Private Rooms */}
              {status === "Private" && roomKey && (
                <div className="bg-slate-100 text-center p-4 rounded-md">
                  <p className="text-gray-600 mb-2">Room Key:</p>
                  <p className="text-gray-900 font-bold text-lg">{roomKey}</p>
                  <p className="text-gray-500 text-sm">
                    Share this key with others to join the room.
                  </p>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isCreating} // Disable button when creating
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-lg"
                  disabled={isCreating} // Disable button when creating
                >
                  {isCreating ? "Creating..." : "Create"}{" "}
                  {/* Button text changes */}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateRoomModal;
