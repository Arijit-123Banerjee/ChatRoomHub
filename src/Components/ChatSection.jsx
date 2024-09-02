// src/Components/ChatSection.js
import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { database as db } from "../firebase";
import { auth } from "../firebase";

const ChatSection = ({ roomName, onExit, onBack, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages from Firestore
  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Clean up subscription on component unmount
  }, [roomId]);

  // Scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        await addDoc(collection(db, "messages"), {
          roomId,
          senderId: auth.currentUser.uid,
          text: newMessage,
          timestamp: new Date(),
        });
        setNewMessage(""); // Clear input after sending
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Group messages to display consecutive messages from the same user in one block
  const groupMessages = (messages) => {
    const grouped = [];
    let currentGroup = [];

    messages.forEach((message, index) => {
      if (currentGroup.length === 0 || message.senderId === currentGroup[0].senderId) {
        currentGroup.push(message);
      } else {
        grouped.push(currentGroup);
        currentGroup = [message];
      }
      if (index === messages.length - 1) {
        grouped.push(currentGroup);
      }
    });

    return grouped;
  };

  const groupedMessages = groupMessages(messages);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert Firestore timestamp to JavaScript Date
    return date.toLocaleString(); // Format date and time
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#000e2d] text-gray-100 p-4 sm:p-6 shadow-2xl border-l border-[#000e2d]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[#111f36]">
        <div className="flex items-center space-x-4">
          {/* Back Arrow Button (Visible on Mobile Only) */}
          <button
            className="md:hidden text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={onBack}
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
      <div className="flex-1 overflow-y-auto mb-4 chat">
        <div className="space-y-4">
          {groupedMessages.map((messageGroup, index) => (
            <div key={index} className={`flex ${messageGroup[0].senderId === auth.currentUser.uid ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col ${messageGroup[0].senderId === auth.currentUser.uid ? "items-end" : "items-start"}`}>
                {messageGroup.map((message, idx) => (
                  <div
                    key={idx}
                    className={`${
                      message.senderId === auth.currentUser.uid
                        ? "bg-gradient-to-r from-[#003366] to-[#004080] text-white"
                        : "bg-[#002244] text-gray-300"
                    } max-w-xs p-3 rounded-lg shadow-md mb-1`}
                  >
                    {/* Display sender's name only for the first message in the group */}
                    {messageGroup.length > 1 && idx === 0 && (
                      <div className="font-medium">
                        {message.senderId === auth.currentUser.uid ? "You" : "Other User"}
                      </div>
                    )}
                    <div className="text-sm">{message.text}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatTimestamp(message.timestamp)}</div>
                  </div>
                ))}
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
