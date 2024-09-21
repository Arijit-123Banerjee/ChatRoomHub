import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TfiWorld } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import { database as db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";

const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
  const [roomName, setRoomName] = useState("");
  const [status, setStatus] = useState("Public");
  const [roomKey, setRoomKey] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateRoomKey = () => {
    const key = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomKey(key);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === "Private") {
      generateRoomKey();
    } else {
      setRoomKey("");
    }
  };

  const handleCreate = async () => {
    if (roomName && auth.currentUser) {
      setIsCreating(true);
      try {
        const userId = auth.currentUser.uid;
        const roomData = {
          name: roomName,
          users: [userId],
          messages: [],
          status,
        };

        if (status === "Private") {
          roomData.roomKey = roomKey;
        }

        const roomRef = doc(db, "rooms", roomName);
        await setDoc(roomRef, roomData);

        const demoMessage = {
          senderUid: userId,
          content: "Welcome to the room! Feel free to introduce yourself.",
          timestamp: new Date().toISOString(),
        };

        await setDoc(
          roomRef,
          {
            messages: [demoMessage],
          },
          { merge: true }
        );

        onCreate({ ...roomData, id: roomName });
        setRoomName("");
        setStatus("Public");
        setRoomKey("");
      } catch (error) {
        console.error("Failed to create room", error);
      } finally {
        setIsCreating(false);
        onClose();
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
        <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-black bg-opacity-60">
          <Dialog.Panel className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-md mx-auto border border-white border-opacity-20">
            <Dialog.Title className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-6">
              Create Room
            </Dialog.Title>
            <div className="space-y-6">
              <div>
                <label htmlFor="room-name" className="block text-gray-300 mb-2">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                  disabled={isCreating}
                  placeholder="Enter room name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Status</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Public")}
                    className={`flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ${
                      status === "Public"
                        ? "bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
                        : "bg-white bg-opacity-10 text-white border border-white border-opacity-20"
                    }`}
                    disabled={isCreating}
                  >
                    <TfiWorld className="mr-2" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Private")}
                    className={`flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ${
                      status === "Private"
                        ? "bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
                        : "bg-white bg-opacity-10 text-white border border-white border-opacity-20"
                    }`}
                    disabled={isCreating}
                  >
                    <CiLock className="mr-2" />
                    Private
                  </button>
                </div>
              </div>
              {status === "Private" && roomKey && (
                <div className="bg-white bg-opacity-10 text-center p-4 rounded-lg">
                  <p className="text-gray-300 mb-2">Room Key:</p>
                  <p className="text-white font-bold text-lg">{roomKey}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Share this key with others to join the room.
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20 transition-all duration-300"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 transform hover:-translate-y-1"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create"}
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
