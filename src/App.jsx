import React, { useState } from "react";
import ChatSection from "./Components/ChatSection";
import Sidebar from "./Components/Sidebar";
import ConfirmationModal from "./Components/ConfirmationModal";

const App = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleRoomSelect = (room) => {
    if (room.status === "Private") {
      setSelectedRoom(room);
      setConfirmationModalOpen(true);
    } else {
      setSelectedRoom(room);
      if (window.innerWidth <= 768) setSidebarOpen(false);
    }
  };

  const handleConfirmJoin = () => {
    setConfirmationModalOpen(false);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleExitRoom = () => {
    setSelectedRoom(null);
    if (window.innerWidth <= 768) setSidebarOpen(true);
  };

  const handleBackToSidebar = () => setSidebarOpen(true);

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
            roomId={selectedRoom.id} // Pass the roomId
          />
        ) : (
          <div className="flex-1 h-screen flex items-center justify-center text-gray-300 bg-[#000e2d]">
            No room selected
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmJoin}
      />
    </div>
  );
};

export default App;
