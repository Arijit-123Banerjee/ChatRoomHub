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
        <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-black bg-opacity-60">
          <Dialog.Panel className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white rounded-xl shadow-lg px-8 py-10 w-full max-w-md mx-auto text-center border border-white border-opacity-20 relative overflow-hidden">
            {/* Background blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

            <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
              Join Room Confirmation
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Are you sure you want to join this room? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-6">
              <button
                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-8 py-3 rounded-full shadow-lg hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform hover:-translate-y-1 font-semibold"
                onClick={onConfirm}
              >
                Yes, Join
              </button>
              <button
                className="bg-white bg-opacity-10 text-white px-8 py-3 rounded-full shadow-lg hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform hover:-translate-y-1 font-semibold"
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
