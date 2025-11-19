import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import chatService from '../../services/chat.service';

const ChatMessage = ({ message, isOwn, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message);
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!editedMessage.trim() || editedMessage === message.message) {
      setIsEditing(false);
      setEditedMessage(message.message);
      return;
    }

    setLoading(true);
    try {
      await chatService.editMessage(message._id, editedMessage.trim());
      setIsEditing(false);
      // The message will be updated via socket in real-time
    } catch (error) {
      console.error('Error editing message:', error);
      setEditedMessage(message.message);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setLoading(true);
    try {
      await chatService.deleteMessage(message._id);
      // The message will be updated via socket in real-time
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const getSenderColor = (senderType) => {
    return senderType === 'Teacher' ? 'text-accent-600' : 'text-blue-600';
  };

  const getMessageBubbleStyle = () => {
    if (isOwn) {
      return 'bg-accent-500 text-white ml-8';
    }
    return 'bg-neutral-100 text-neutral-900 mr-8';
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-xs">
        {/* Sender info (only for others' messages) */}
        {!isOwn && (
          <div className="flex items-center gap-1 mb-1">
            <span className={`text-xs font-medium ${getSenderColor(message.sender.type)}`}>
              {message.sender.name}
            </span>
            <span className="text-xs text-neutral-400">
              ({message.sender.type})
            </span>
          </div>
        )}

        <div 
          className={`relative group ${getMessageBubbleStyle()} rounded-lg px-3 py-2`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Message Actions */}
          {showActions && isOwn && !isEditing && (
            <div className="absolute -top-8 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50 w-full"
              >
                <Edit2 size={12} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 w-full"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}

          {/* Message Content */}
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-accent-500"
                maxLength={1000}
                autoFocus
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedMessage(message.message);
                  }}
                  disabled={loading}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm break-words">{message.message}</p>
              {message.editedAt && (
                <p className={`text-xs mt-1 ${isOwn ? 'text-accent-200' : 'text-neutral-500'}`}>
                  (edited)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-neutral-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;