import React, { useState } from "react";
import CreateRoomModal from "./CreateRoomModal"; // Adjust the import path as needed

const initialRooms = [
  { name: "Room 1", members: 5, status: "Public" },
  { name: "Room 2", members: 3, status: "Private" },
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
    setRooms([...rooms, { ...newRoom, members: 0 }]);
    setModalOpen(false);
  };

  return (
    <>
      {/* Full Screen Sidebar on Tablet and Mobile */}
      <div
        className={`fixed inset-0 z-40 bg-gradient-to-r from-teal-50 to-blue-50 text-gray-800 p-4 sm:p-6 shadow-xl border-r border-gray-300 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-80 md:h-screen md:border-l md:border-gray-300`}
      >
        {/* Toggle Button for Mobile */}
        <button
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            className={`w-6 h-6 text-gray-600 ${
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
        <div className="text-3xl font-semibold mb-6 text-gray-900">Rooms</div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-transform duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create Button */}
        <button
          className="bg-gradient-to-r from-teal-400 to-teal-600 text-white px-4 py-2 rounded-lg mb-6 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={() => setModalOpen(true)}
        >
          Create
        </button>
        <p className="text-gray-600 mb-6 font-medium">Available Rooms</p>

        {/* Room List */}
        <div className="space-y-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-300 hover:bg-gray-100 transition duration-300 cursor-pointer"
                onClick={() => {
                  onRoomSelect(room); // Notify parent about room selection
                  if (window.innerWidth <= 768) {
                    setSidebarOpen(false); // Hide sidebar on mobile
                  }
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-gray-800">
                    {room.name}
                  </div>
                  <div
                    className={`text-xs px-3 py-1 rounded-full ${
                      room.status === "Public" ? "bg-teal-500" : "bg-red-500"
                    } text-white`}
                  >
                    {room.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Members: {room.members}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No rooms found</p>
          )}
        </div>

        {/* Modal */}
        <CreateRoomModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateRoom}
        />
      </div>

      {/* Button to show sidebar again on mobile */}
      {!sidebarOpen && (
        <button
          className="fixed bottom-4 right-4 p-3 bg-teal-600 text-white rounded-full shadow-lg z-50 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12l5 5 5-5-5-5-5 5z"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default Sidebar;
