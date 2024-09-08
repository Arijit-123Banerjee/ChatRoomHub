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

  // Handle marking messages as seen
  const handleMarkAsSeen = useCallback(async () => {
    if (auth.currentUser) {
      try {
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
          messages: messages.map((message) =>
            message.senderUid !== auth.currentUser.uid &&
            !message.seenBy.includes(auth.currentUser.uid)
              ? {
                  ...message,
                  seenBy: [...message.seenBy, auth.currentUser.uid],
                }
              : message
          ),
        });
      } catch (error) {
        console.error("Failed to mark messages as seen", error);
      }
    }
  }, [messages, roomId]);

  useEffect(() => {
    handleMarkAsSeen();
  }, [messages, handleMarkAsSeen]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        const message = {
          senderUid: auth.currentUser.uid,
          content: newMessage,
          timestamp: new Date().toISOString(),
          name: auth.currentUser.displayName || "Anonymous",
          seenBy: [], // Initialize as empty array
        };

        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, { messages: arrayUnion(message) });
        setNewMessage(""); // Clear input after sending
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const groupedMessages = groupMessages(messages);

  return (
    <div className="flex flex-col h-screen w-full bg-[#ffffff] text-gray-900 p-4 sm:p-6 shadow-lg border-l border-[#e5e5e5]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[#e5e5e5]">
        <div className="flex items-center space-x-4">
          {/* Back Arrow Button (Visible on Mobile Only) */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onBack}
            aria-label="Back to Rooms"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          {/* Room Avatar and Name */}
          <img
            src="https://via.placeholder.com/40" // Replace with actual room image
            alt="Room Avatar"
            className="w-10 h-10 rounded-full border border-[#e5e5e5]"
          />
          <div className="text-xl font-semibold text-gray-900">{roomName}</div>
        </div>
        <div className="relative">
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={toggleDropdown}
            aria-label="More Options"
          >
            <BsThreeDotsVertical className="w-6 h-6" />
          </button>
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg overflow-hidden z-10">
              <button
                className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
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
                        ? "bg-[#f1f1f1] text-gray-900"
                        : "bg-[#e5e5e5] text-gray-900"
                    } max-w-xs p-3 rounded-lg shadow-md mb-1 relative`}
                  >
                    {/* Display sender's name */}
                    <div className="font-medium">
                      {usernames[message.senderUid] || "Unknown"}
                    </div>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                    {/* Seen indicator */}
                    <div
                      className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full ${
                        message.seenBy.includes(auth.currentUser.uid)
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll reference */}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex items-center border-t border-[#e5e5e5] pt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-[#e5e5e5] rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-[#007bff] text-white px-4 py-2 rounded-lg hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-[#007bff]"
          onClick={handleSendMessage}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
