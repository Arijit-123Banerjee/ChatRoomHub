import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";

const ChatSection = ({ roomName, onExit, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hello everyone!" },
    { id: 2, sender: "Bob", text: "Hi Alice, how are you?" },
    { id: 3, sender: "Alice", text: "I'm good, thanks! What about you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "You", text: newMessage },
      ]);
      setNewMessage(""); // Clear input after sending
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="flex flex-col h-screen w-full bg-[#000e2d] text-gray-100 p-4 sm:p-6 shadow-2xl border-l border-[#000e2d]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2  border-[#111f36]">
        <div className="flex items-center space-x-4">
          {/* Back Arrow Button (Visible on Mobile Only) */}
          <button
            className="md:hidden text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={onBack} // Call onBack when button is clicked
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          {/* Room Avatar and Name */}
          <img
            src="https://via.placeholder.com/40" // Replace with actual room image
            alt="Room Avatar"
            className="w-10 h-10 rounded-full border border-[#00112d]"
          />
          <div className="text-xl font-semibold text-gray-200">{roomName}</div>
        </div>
        <div className="relative">
          <button
            className="text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={toggleDropdown}
          >
            <BsThreeDotsVertical className="w-6 h-6" />
          </button>
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-[#002244] rounded-lg shadow-lg overflow-hidden z-10">
              <button
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#00112d]"
                onClick={onExit}
              >
                Exit Room
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.sender === "You"
                    ? "bg-gradient-to-r from-[#003366] to-[#004080] text-white"
                    : "bg-[#002244] text-gray-300"
                } max-w-xs p-3 rounded-lg shadow-md`}
              >
                <div className="font-medium">{message.sender}</div>
                <div className="text-sm">{message.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex items-center border-t border-[#00112d] pt-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-[#16253d] bg-[#00112d] rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#003366] text-gray-200 placeholder-gray-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-4 bg-gradient-to-r from-[#003366] to-[#004080] text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#003366]"
          onClick={handleSendMessage}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
