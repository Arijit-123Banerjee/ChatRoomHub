import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const ShowMembersModal = ({ isOpen, onClose, members }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#00112d] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-200">Room Members</h2>
          <button
            className="text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={onClose}
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {members.length > 0 ? (
            members.map((member) => (
              <div key={member.uid} className="bg-[#002244] p-3 rounded-lg">
                <p className="text-gray-200 font-medium">
                  {member.displayName}
                </p>
                <p className="text-gray-400 text-sm">{member.email}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No members found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowMembersModal;
