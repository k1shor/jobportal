'use client';
import React from 'react';
import PropTypes from 'prop-types';

const MessagesPage = ({ conversations }) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h1>
      
      {/* Conversation List */}
      <div className="bg-white shadow-md rounded-lg">
        {conversations.length > 0 ? (
          conversations.map((conversation, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              {/* Sender Info */}
              <div className="flex items-center gap-4">
                <img
                  src={conversation.senderAvatar || '/default-avatar.png'}
                  alt={`${conversation.senderName}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-800 font-medium">{conversation.senderName}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>

              {/* Time */}
              <p className="text-sm text-gray-400">
                {conversation.timeAgo || 'Just now'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No messages yet</p>
        )}
      </div>
    </div>
  );
};



export default MessagesPage;
