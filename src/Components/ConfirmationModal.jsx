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
          <Dialog.Panel className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-lg px-4 sm:px-8 py-10 w-full max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              Are you sure you want to join this room?
            </h2>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. Confirm to join the room.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onConfirm}
              >
                Yes, Join
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
