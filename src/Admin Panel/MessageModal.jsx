import React from "react";
import { X, User, Mail } from "lucide-react";

const MessageModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div
        className="bg-slate-900 max-w-xl w-full rounded-2xl p-6 relative
                      border border-purple-500/30 shadow-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-2 text-purple-400">
            <User size={18} />
            <span className="font-semibold">{message.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Mail size={16} />
            {message.email}
          </div>
        </div>

        {/* Message body */}
        <div className="max-h-[60vh] overflow-y-auto text-gray-300 leading-relaxed">
          {message.message}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
