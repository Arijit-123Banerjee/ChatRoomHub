import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path as needed
import useAuth from "../hooks/useAuth"; // Custom hook to get current user

const ChatSection = ({ roomName, onExit, onBack }) => {
  const { currentUser } = useAuth(); // Get current user from auth
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages from Firestore
  useEffect(() => {
    const messagesRef = collection(db, `rooms/${roomName}/messages`);
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [roomName]);

  // Scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        const messagesRef = collection(db, `rooms/${roomName}/messages`);
        await addDoc(messagesRef, {
          sender: currentUser.uid, // Save the sender's UID
          text: newMessage,
          timestamp: new Date(), // Save the timestamp
        });
        setNewMessage(""); // Clear input after sending
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="flex flex-col h-screen w-full bg-[#000e2d] text-gray-100 p-4 sm:p-6 shadow-2xl border-l border-[#000e2d]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[#111f36]">
        <div className="flex items-center space-x-4">
          {/* Back Arrow Button (Visible on Mobile Only) */}
          <button
            className="md:hidden text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={onBack} // Call onBack when button is clicked
            aria-label="Back to Rooms"
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
            aria-label="More Options"
          >
            <BsThreeDotsVertical className="w-6 h-6" />
          </button>
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-[#002244] rounded-lg shadow-lg overflow-hidden z-10">
              <button
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#00112d]"
                onClick={onExit}
                aria-label="Exit Room"
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
                message.sender === currentUser.uid
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.sender === currentUser.uid
                    ? "bg-gradient-to-r from-[#003366] to-[#004080] text-white"
                    : "bg-[#002244] text-gray-300"
                } max-w-xs p-3 rounded-lg shadow-md`}
              >
                <div className="font-medium">
                  {message.sender === currentUser.uid ? "You" : "Other User"}
                </div>
                <div className="text-sm">{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll reference */}
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
