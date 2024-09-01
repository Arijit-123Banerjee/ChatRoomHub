import React, { useState } from "react";
import ChatSection from "./Components/ChatSection";
import Sidebar from "./Components/Sidebar";
import ConfirmationModal from "./Components/ConfirmationModal";

const App = () => {
  // State to keep track of the selected room
  const [selectedRoom, setSelectedRoom] = useState(null);

  // State to control the visibility of the sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State to control the visibility of the confirmation modal
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // Handler for selecting a room from the sidebar
  const handleRoomSelect = (room) => {
    if (room.status === "Private") {
      // If the room is private, open the confirmation modal
      setSelectedRoom(room);
      setConfirmationModalOpen(true);
    } else {
      // If the room is public, simply select it and close the sidebar on mobile
      setSelectedRoom(room);
      if (window.innerWidth <= 768) setSidebarOpen(false);
    }
  };

  // Handler for confirming to join a private room
  const handleConfirmJoin = () => {
    setConfirmationModalOpen(false);
    // Close the sidebar on mobile after joining the room
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  // Handler for exiting the currently selected room
  const handleExitRoom = () => {
    setSelectedRoom(null);
    // Show the sidebar on mobile when exiting the room
    if (window.innerWidth <= 768) setSidebarOpen(true);
  };

  // Handler for going back to the sidebar from the chat section
  const handleBackToSidebar = () => setSidebarOpen(true);

  return (
    <div className="flex h-screen bg-[#000e2d]">
      {/* Sidebar is conditionally rendered based on sidebarOpen state */}
      {sidebarOpen && (
        <Sidebar
          onRoomSelect={handleRoomSelect}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      {/* Main chat section or a placeholder when no room is selected */}
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

      {/* Confirmation modal is conditionally rendered */}
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmJoin}
      />
    </div>
  );
};

export default App;
