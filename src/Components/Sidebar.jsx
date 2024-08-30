import React, { useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
import { CiLock } from "react-icons/ci";
import { TfiWorld } from "react-icons/tfi";

const initialRooms = [];

const Sidebar = ({ onRoomSelect, setSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(initialRooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoom = (newRoom) => {
    setRooms((prevRooms) => [{ ...newRoom, members: 0 }, ...prevRooms]);
    setModalOpen(false);
  };

  const handleRoomSelect = (room) => {
    if (room.status === "Private") {
      setSelectedRoom(room);
      setJoinModalOpen(true); // Open the join modal for private rooms
    } else {
      onRoomSelect(room);
      if (window.innerWidth <= 768) setSidebarOpen(false); // Hide sidebar on mobile
    }
  };

  const handleJoinRoom = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false); // Hide sidebar on mobile
    onRoomSelect(selectedRoom);
    setJoinModalOpen(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-[#000e2d] via-[#000e2d] to-[#000e2d] text-gray-100 p-4 sm:p-6 shadow-2xl border-r border-[#000e2d] transform transition-transform ${
        setSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 md:w-[30%] md:h-screen md:border-l md:border-[#000e2d] flex flex-col`}
    >
      <div className="text-3xl font-semibold mb-6 text-gray-100 tracking-wide">
        Rooms
      </div>

      <input
        type="text"
        placeholder="Search rooms..."
        className="w-full px-4 py-2 border border-[#002244] bg-[#00112d] rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 placeholder-gray-500 mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button
        className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white px-4 py-2 rounded-lg mb-6 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
        onClick={() => setModalOpen(true)}
      >
        Create Room
      </button>

      <p className="text-gray-400 mb-4 font-medium tracking-wide">
        Available Rooms
      </p>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div
                key={index}
                className="bg-[#002244] p-4 rounded-lg shadow-md border border-[#00112d] hover:bg-[#003366] transition duration-300 cursor-pointer"
                onClick={() => handleRoomSelect(room)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-gray-200">
                    {room.name}
                  </div>
                  <div
                    className={`text-xs px-3 py-1 rounded-full flex items-center ${
                      room.status === "Public" ? "bg-cyan-600" : "bg-red-600"
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
            <p className="text-gray-500">No rooms found</p>
          )}
        </div>
      </div>

      <CreateRoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateRoom}
      />

      {/* JoinRoomModal for private rooms */}
      {selectedRoom && (
        <JoinRoomModal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          onJoin={handleJoinRoom}
          expectedKey={selectedRoom.roomKey}
        />
      )}
    </div>
  );
};

export default Sidebar;
