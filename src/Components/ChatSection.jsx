import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import ShowMembersModal from "./ShowMembersModal";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";

const ChatSection = ({ roomName, onExit, onBack, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const messagesEndRef = useRef(null);

  // Simulate fetching messages
  useEffect(() => {
    const simulatedMessages = [
      { id: "1", sender: "user1", text: "Hello!", timestamp: new Date() },
      { id: "2", sender: "user2", text: "Hi there!", timestamp: new Date() },
    ];
    setMessages(simulatedMessages);
  }, [roomName]);

  // Fetch members data from Firestore
  const fetchMembers = async () => {
    try {
      const db = getFirestore(app);
      const docRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMembers(docSnap.data().members || []);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching room data: ", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: (messages.length + 1).toString(),
        sender: "currentUser",
        text: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleAvatarClick = () => {
    fetchMembers();
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#000e2d] text-gray-100 p-4 sm:p-6 shadow-2xl border-l border-[#000e2d]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[#111f36]">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={onBack}
            aria-label="Back to Rooms"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          <img
            src="https://via.placeholder.com/40"
            alt="Room Avatar"
            className="w-10 h-10 rounded-full border-4 border-[#e9ecf2]"
            onClick={handleAvatarClick}
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

      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "currentUser"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.sender === "currentUser"
                    ? "bg-gradient-to-r from-[#003366] to-[#004080] text-white"
                    : "bg-[#002244] text-gray-300"
                } max-w-xs p-3 rounded-lg shadow-md`}
              >
                <div className="font-medium">
                  {message.sender === "currentUser" ? "You" : "Other User"}
                </div>
                <div className="text-sm">{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

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

      <ShowMembersModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        members={members}
        roomId={roomId}
      />
    </div>
  );
};

export default ChatSection;
