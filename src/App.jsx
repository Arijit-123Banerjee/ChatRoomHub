import React, { useState } from "react";
import ChatSection from "./Components/ChatSection";
import Sidebar from "./Components/Sidebar";

const App = () => {
  // State to manage selected room and sidebar visibility
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    if (window.innerWidth <= 768) setSidebarOpen(false); // Hide sidebar on mobile
  };

  const handleExitRoom = () => {
    setSelectedRoom(null);
    if (window.innerWidth <= 768) setSidebarOpen(true); // Show sidebar on mobile
  };

  const handleBackToSidebar = () => setSidebarOpen(true); // Show sidebar on back action

  return (
    <div className="flex h-screen bg-[#000e2d]">
      {sidebarOpen && (
        <Sidebar
          onRoomSelect={handleRoomSelect}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      <div
        className={`flex-1 ${
          sidebarOpen ? "hidden md:flex" : "flex"
        } transition-all duration-300`}
      >
        {selectedRoom ? (
          <ChatSection
            roomName={selectedRoom.name}
            onExit={handleExitRoom}
            onBack={handleBackToSidebar}
          />
        ) : (
          <div className="flex-1 h-screen flex items-center justify-center text-gray-300 bg-[#000e2d]">
            No room selected
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
