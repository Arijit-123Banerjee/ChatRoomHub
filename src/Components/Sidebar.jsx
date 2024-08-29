import React, { useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import { CiLock } from "react-icons/ci";
import { TfiWorld } from "react-icons/tfi";

const initialRooms = [
  { name: "Room 1", members: 5, status: "Public" },
  { name: "Room 2", members: 3, status: "Private" },
  { name: "Room 3", members: 4, status: "Public" },
  { name: "Room 4", members: 2, status: "Private" },
  { name: "Room 5", members: 6, status: "Public" },
  { name: "Room 6", members: 1, status: "Private" },
  // Add more rooms here
];

const Sidebar = ({ onRoomSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(initialRooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to manage sidebar visibility on mobile

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoom = (newRoom) => {
    setRooms([{ ...newRoom, members: 0 }, ...rooms]); // Add the new room to the beginning of the list
    setModalOpen(false);
  };

  return (
    <>
      {/* Full Screen Sidebar on Mobile */}
      <div
        className={`fixed inset-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-4 sm:p-6 shadow-xl border-r border-gray-700 transform transition-transform ${
          sidebarOpen ? "translate-x-0 " : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-96 md:h-screen md:border-l md:border-gray-700 flex flex-col`}
      >
        {/* Toggle Button for Mobile */}
        <button
          className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            className={`w-6 h-6 text-gray-400 ${
              sidebarOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Heading */}
        <div className="text-3xl font-semibold mb-6 text-white">Rooms</div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create Button */}
        <button
          className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-4 py-2 rounded-lg mb-6 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={() => setModalOpen(true)}
        >
          Create
        </button>
        <p className="text-gray-400 mb-6 font-medium">Available Rooms</p>

        {/* Scrollable Room List */}
        <div className="flex-1 overflow-y-auto">
          {" "}
          {/* Makes this container scrollable */}
          <div className="space-y-4">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 hover:bg-gray-700 transition duration-300 cursor-pointer"
                  onClick={() => {
                    onRoomSelect(room); // Notify parent about room selection
                    if (window.innerWidth <= 768) {
                      setSidebarOpen(false); // Hide sidebar on mobile
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-lg font-semibold text-white">
                      {room.name}
                    </div>
                    <div
                      className={`text-xs px-3 py-1 rounded-full flex items-center ${
                        room.status === "Public" ? "bg-teal-600" : "bg-red-600"
                      } text-white`}
                    >
                      {room.status === "Public" ? (
                        <TfiWorld className="mr-1" />
                      ) : (
                        <CiLock className="mr-1" />
                      )}
                      {room.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Members: {room.members}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No rooms found</p>
            )}
          </div>
        </div>

        {/* Modal */}
        <CreateRoomModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateRoom}
        />
      </div>
    </>
  );
};

export default Sidebar;
