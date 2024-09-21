import React, { useState, useEffect, useRef, useCallback } from "react";
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
  getDocs,
  collection,
  getFirestore,
} from "firebase/firestore";
import { app, database as db } from "../firebase";
import { auth } from "../firebase";

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Utility function to group messages
const groupMessages = (messages) => {
  return messages.reduce((acc, message) => {
    if (
      acc.length === 0 ||
      message.senderUid !== acc[acc.length - 1][0].senderUid
    ) {
      acc.push([message]);
    } else {
      acc[acc.length - 1].push(message);
    }
    return acc;
  }, []);
};

const ChatSection = ({ roomName, onExit, onBack, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usernames, setUsernames] = useState({});
  const messagesEndRef = useRef(null);

  // Function to fetch user data
  const getUserData = async () => {
    try {
      const db = getFirestore(app);
      const docref = collection(db, "users");
      const docsnap = await getDocs(docref);
      const data = docsnap.docs.reduce((acc, doc) => {
        const userData = doc.data();
        acc[doc.id] = userData.username; // Assuming `username` is a field in your `users` collection
        return acc;
      }, {});
      setUsernames(data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  // Call getUserData on component mount
  useEffect(() => {
    getUserData();
  }, []);

  // Fetch messages from Firestore
  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const roomData = snapshot.data();
      if (roomData) {
        setMessages(roomData.messages || []);
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
          name: auth.currentUser.displayName || "Anonymous",
        };

        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, { messages: arrayUnion(message) });
        setNewMessage(""); // Clear input after sending
        await setDoc(roomRef, { typing: null }, { merge: true }); // Ensure typing status is cleared
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const groupedMessages = groupMessages(messages);

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-4 sm:p-6 shadow-lg border-l border-white border-opacity-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white border-opacity-20">
        <div className="flex items-center space-x-4">
          {/* Back Arrow Button (Visible on Mobile Only) */}
          <button
            className="md:hidden text-white hover:text-pink-400 focus:outline-none transition-colors duration-300"
            onClick={onBack}
            aria-label="Back to Rooms"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          {/* Room Avatar and Name */}
          <img
            src="https://via.placeholder.com/40" // Replace with actual room image
            alt="Room Avatar"
            className="w-10 h-10 rounded-full border border-white border-opacity-20"
          />
          <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
            {roomName}
          </div>
        </div>
        <div className="relative">
          <button
            className="text-white hover:text-pink-400 focus:outline-none transition-colors duration-300"
            onClick={toggleDropdown}
            aria-label="More Options"
          >
            <BsThreeDotsVertical className="w-6 h-6" />
          </button>
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg overflow-hidden z-10 border border-white border-opacity-20">
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-300"
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
                        ? "bg-gradient-to-r from-pink-500 to-yellow-500"
                        : "bg-white bg-opacity-10"
                    } max-w-xs p-3 rounded-lg shadow-md mb-1`}
                  >
                    {/* Display sender's name */}
                    <div className="font-medium">
                      {usernames[message.senderUid] || "Unknown"}
                    </div>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs text-white text-opacity-60 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll reference */}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex items-center border-t border-white border-opacity-20 pt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform hover:-translate-y-1"
          onClick={handleSendMessage}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
