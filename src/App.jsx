import React, { useState } from "react";
import ChatSection from "./Components/ChatSection";
import Sidebar from "./Components/Sidebar";

const App = () => {
  const [selectedRoom, setSelectedRoom] = useState(null); // State to manage selected room
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to manage sidebar visibility

  const handleRoomSelect = (room) => {
    setSelectedRoom(room); // Set the selected room when a room is clicked in the sidebar

    // Hide the sidebar on mobile devices
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleExitRoom = () => {
    setSelectedRoom(null); // Clear selected room when exiting the room in chat section

    // Show the sidebar again on mobile when exiting a room
    if (window.innerWidth <= 768) {
      setSidebarOpen(true);
    }
  };

  const handleBackToSidebar = () => {
    // Show the sidebar and hide the chat section on mobile devices
    setSidebarOpen(true);
  };

  return (
    <div className="flex">
      {/* Sidebar component visibility controlled by `sidebarOpen` state */}
      {sidebarOpen && (
        <Sidebar
          onRoomSelect={handleRoomSelect}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      {/* Conditionally render ChatSection or No Room Selected message */}
      <div className={`flex-1 ${sidebarOpen ? "hidden md:flex" : "flex"}`}>
        {selectedRoom ? (
          <ChatSection
            roomName={selectedRoom.name}
            onExit={handleExitRoom}
            onBack={handleBackToSidebar} // Pass handleBackToSidebar to ChatSection
          />
        ) : (
          <div className="flex-1 h-screen flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            No room selected
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
