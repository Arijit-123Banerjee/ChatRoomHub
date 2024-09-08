import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white text-gray-900 rounded-xl shadow-lg px-6 py-8 w-full max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Are you sure you want to join this room?
            </h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Confirm to join the room.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white px-4 py-2 rounded-lg shadow-lg hover:from-cyan-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onClick={onConfirm}
              >
                Yes, Join
              </button>
              <button
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
