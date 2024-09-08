import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const JoinRoomModal = ({ isOpen, onClose, onJoin, expectedKey }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]{1}$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      if (index > 0 && otp[index] === "") {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("");
    setOtp(pastedData);
    if (pastedData.length > 0) {
      document.getElementById(`otp-${pastedData.length - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredKey = otp.join("");
    if (enteredKey === expectedKey) {
      setError("");
      onJoin();
      setOtp(["", "", "", ""]);
    } else {
      setError("Incorrect key. Please try again.");
      setTimeout(() => setError(""), 3000);
      setOtp(["", "", "", ""]);
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
          <Dialog.Panel className="bg-gradient-to-br from-white via-gray-100 to-white rounded-lg shadow-lg px-6 py-8 w-full max-w-sm mx-auto text-center">
            <header className="mb-6">
              <h1 className="text-2xl font-bold mb-1 text-gray-900">
                Enter Room Key
              </h1>
              <p className="text-sm text-gray-600">
                Enter the 4-digit key to join the private room.
              </p>
            </header>
            <form id="otp-form" onSubmit={handleSubmit}>
              <div className="flex items-center justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    className="w-12 h-12 text-center text-2xl font-bold text-gray-900 bg-gray-200 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                    value={digit}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength="1"
                    onPaste={handlePaste}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150"
              >
                Verify Key
              </button>
            </form>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <div className="text-sm text-gray-600 mt-4">
              Didn't receive the key?{" "}
              <a
                className="font-medium text-blue-500 hover:text-blue-600"
                href="#0"
              >
                Resend
              </a>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default JoinRoomModal;
