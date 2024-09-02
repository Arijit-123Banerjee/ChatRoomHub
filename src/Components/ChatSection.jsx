import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { database as db } from "../firebase";
import { auth } from "../firebase";

const ChatSection = ({ roomName, onExit, onBack, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [typing, setTyping] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch messages and typing status from Firestore
  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const roomData = snapshot.data();
      if (roomData) {
        setMessages(roomData.messages || []);
        setTyping(roomData.typing || null);
      }
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
        const message = {
          senderUid: auth.currentUser.uid,
          content: newMessage,
          timestamp: new Date().toISOString(),
          name: auth.currentUser.displayName || "Anonymous", // Use user name if available
        };

        const roomRef = doc(db, "rooms", roomId);

        // Update the messages array in the room document
        await updateDoc(roomRef, {
          messages: arrayUnion(message),
        });

        setNewMessage(""); // Clear input after sending
        // Clear typing status after sending a message
        await setDoc(roomRef, { typing: null }, { merge: true });
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  // Handle typing status
  const handleTyping = async () => {
    // Clear the previous typing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    try {
      const roomRef = doc(db, "rooms", roomId);

      // Update typing status to Firestore
      await setDoc(
        roomRef,
        {
          typing: {
            uid: auth.currentUser.uid,
            name: auth.currentUser.displayName || "Anonymous",
            timestamp: serverTimestamp(),
          },
        },
        { merge: true }
      );

      // Set a timeout to clear typing status after 1 second of inactivity
      const timeout = setTimeout(async () => {
        await setDoc(roomRef, { typing: null }, { merge: true });
      }, 1000);

      setTypingTimeout(timeout);
    } catch (error) {
      console.error("Failed to update typing status", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Group messages to display consecutive messages from the same user in one block
  const groupMessages = (messages) => {
    const grouped = [];
    let currentGroup = [];

    messages.forEach((message, index) => {
      if (
        currentGroup.length === 0 ||
        message.senderUid === currentGroup[0].senderUid
      ) {
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
    const date = new Date(timestamp);
    return date.toLocaleString();
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
            <div
              key={index}
              className={`flex ${
                messageGroup[0].senderUid === auth.currentUser.uid
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col ${
                  messageGroup[0].senderUid === auth.currentUser.uid
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {messageGroup.map((message, idx) => (
                  <div
                    key={idx}
                    className={`${
                      message.senderUid === auth.currentUser.uid
                        ? "bg-gradient-to-r from-[#003366] to-[#004080] text-white"
                        : "bg-[#002244] text-gray-300"
                    } max-w-xs p-3 rounded-lg shadow-md mb-1`}
                  >
                    {/* Display sender's name only for the first message in the group */}
                    {messageGroup.length > 1 && idx === 0 && (
                      <div className="font-medium">
                        {message.senderUid === auth.currentUser.uid
                          ? "You"
                          : message.name}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Typing Indicator */}
          {typing && (
            <div className="flex justify-start items-center mb-4 text-gray-300">
              <div className="animate-pulse">Typing...</div>
            </div>
          )}
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
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(); // Update typing status on input change
          }}
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
