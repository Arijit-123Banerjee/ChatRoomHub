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
        <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Create Room
            </Dialog.Title>
            <div className="space-y-4">
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
                  disabled={isCreating}
                />
              </div>
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
                    disabled={isCreating}
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
                    disabled={isCreating}
                  >
                    <CiLock className="mr-2" />
                    Private
                  </button>
                </div>
              </div>
              {status === "Private" && roomKey && (
                <div className="bg-slate-100 text-center p-4 rounded-md">
                  <p className="text-gray-600 mb-2">Room Key:</p>
                  <p className="text-gray-900 font-bold text-lg">{roomKey}</p>
                  <p className="text-gray-500 text-sm">
                    Share this key with others to join the room.
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-lg"
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
