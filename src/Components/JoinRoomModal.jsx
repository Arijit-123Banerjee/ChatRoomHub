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
          <Dialog.Panel className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg px-8 py-10 w-full max-w-sm mx-auto text-center border border-white border-opacity-20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

            <header className="mb-8">
              <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                Enter Room Key
              </h1>
              <p className="text-gray-300">
                Enter the 4-digit key to join the private room.
              </p>
            </header>
            <form id="otp-form" onSubmit={handleSubmit}>
              <div className="flex items-center justify-center gap-4 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    className="w-14 h-14 text-center text-2xl font-bold text-white bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition-all duration-300"
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
                className="w-full inline-flex justify-center rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                Verify Key
              </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            <div className="text-sm text-gray-300 mt-6">
              Didn't receive the key?{" "}
              <a
                className="font-medium text-pink-400 hover:text-pink-300 transition-colors duration-300"
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
