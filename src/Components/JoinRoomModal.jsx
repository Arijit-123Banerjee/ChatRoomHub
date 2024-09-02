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
      setTimeout(() => setError(""), 3000); // Clear error message after 3 seconds
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
          <Dialog.Panel className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-lg px-4 sm:px-8 py-10 w-full max-w-md mx-auto text-center">
            <header className="mb-8">
              <h1 className="text-2xl font-bold mb-1 text-white">
                Enter Room Key
              </h1>
              <p className="text-sm text-gray-400">
                Enter the 4-digit key to join the private room.
              </p>
            </header>
            <form id="otp-form" onSubmit={handleSubmit}>
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    className="w-14 h-14 text-center text-2xl font-extrabold text-white bg-[#00112d] border border-gray-600 rounded p-4 outline-none focus:bg-[#000e2d] focus:border-blue-600 focus:ring-2 focus:ring-blue-400"
                    value={digit}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength="1"
                    onPaste={handlePaste}
                  />
                ))}
              </div>
              <div className="max-w-[260px] mx-auto mt-4">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150"
                >
                  Verify Key
                </button>
              </div>
            </form>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="text-sm text-gray-400 mt-4">
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
