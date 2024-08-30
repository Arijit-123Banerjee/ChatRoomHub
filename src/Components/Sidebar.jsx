import React, { useState, useEffect } from "react";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
import ConfirmationModal from "./ConfirmationModal";
import { CiLock } from "react-icons/ci";
import { TfiWorld } from "react-icons/tfi";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import useAuth from "../hooks/useAuth";

const Sidebar = ({ onRoomSelect, setSidebarOpen }) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [expectedKey, setExpectedKey] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms"),
      (snapshot) => {
        const roomsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsList);
      },
      (error) => {
        console.error("Error fetching rooms: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoom = async (newRoom) => {
    try {
      await addDoc(collection(db, "rooms"), {
        name: newRoom.name,
        status: newRoom.status,
        roomKey: newRoom.roomKey,
        members: newRoom.members || 0,
        memberUIDs: [currentUser.uid], // Add creator's UID to room
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding room: ", error);
    }
  };

  const handleRoomSelect = (room) => {
    if (room.status === "Public") {
      setSelectedRoom(room);
      setConfirmationModalOpen(true);
    } else {
      setExpectedKey(room.roomKey);
      setSelectedRoom(room);
      setJoinModalOpen(true);
    }
  };

  const handleConfirmJoinRoom = async () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
    await updateRoom(selectedRoom.id, true);
    onRoomSelect(selectedRoom);
    setConfirmationModalOpen(false);
  };

  const handleCancelJoinRoom = () => {
    setConfirmationModalOpen(false);
  };

  const handleJoin = async () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
    await updateRoom(selectedRoom.id, true);
    onRoomSelect(selectedRoom);
    setJoinModalOpen(false);
  };

  const updateRoom = async (roomId, isJoining) => {
    const roomRef = doc(db, "rooms", roomId);

    try {
      await updateDoc(roomRef, (prevData) => {
        let updatedMembers = prevData.members;
        let updatedMemberUIDs = [...prevData.memberUIDs];

        if (isJoining) {
          if (!updatedMemberUIDs.includes(currentUser.uid)) {
            updatedMembers += 1;
            updatedMemberUIDs.push(currentUser.uid);
          }
        }

        return {
          members: updatedMembers,
          memberUIDs: updatedMemberUIDs,
        };
      });
    } catch (error) {
      console.error("Error updating room: ", error);
    }
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

      {selectedRoom && (
        <ConfirmationModal
          isOpen={confirmationModalOpen}
          onClose={handleCancelJoinRoom}
          onConfirm={handleConfirmJoinRoom}
        />
      )}

      {selectedRoom && (
        <JoinRoomModal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          onJoin={handleJoin}
          expectedKey={expectedKey}
        />
      )}
    </div>
  );
};

export default Sidebar;
