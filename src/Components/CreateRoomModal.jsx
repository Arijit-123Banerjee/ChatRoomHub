// CreateRoomModal.js
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TfiWorld } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";

const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
  const [roomName, setRoomName] = useState("");
  const [status, setStatus] = useState("Public");
  const [roomKey, setRoomKey] = useState("");

  const generateRoomKey = () => {
    const key = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomKey(key);
  };

  const handleCreate = () => {
    if (roomName) {
      onCreate({
        name: roomName,
        status,
        roomKey: status === "Private" ? roomKey : null,
      });
      setRoomName("");
      setStatus("Public");
      setRoomKey("");
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
          <Dialog.Panel className="bg-[#000e2d] rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Create Room
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label htmlFor="room-name" className="block text-gray-300">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Status</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("Public");
                      setRoomKey("");
                    }}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      status === "Public"
                        ? "bg-blue-600 text-white border-teal-600"
                        : "bg-gray-700 text-gray-300 border-gray-600"
                    } hover:bg-blue-700 hover:border-teal-700`}
                  >
                    <TfiWorld className="mr-2" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("Private");
                      generateRoomKey();
                    }}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      status === "Private"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-gray-700 text-gray-300 border-gray-600"
                    } hover:bg-red-700 hover:border-red-700`}
                  >
                    <CiLock className="mr-2" />
                    Private
                  </button>
                </div>
              </div>
              {status === "Private" && roomKey && (
                <div className="bg-gray-800 text-center p-4 rounded-md">
                  <p className="text-gray-300 mb-2">Room Key:</p>
                  <p className="text-white font-mono text-lg">{roomKey}</p>
                  <p className="text-gray-400 text-sm">
                    Share this key with others to join the room.
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
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
