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
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute  left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex w-full z-10">
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
              roomId={selectedRoom.id}
            />
          ) : (
            <div className="flex-1 h-screen flex items-center justify-center text-xl font-bold bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                No room selected
              </p>
            </div>
          )}
        </div>
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
