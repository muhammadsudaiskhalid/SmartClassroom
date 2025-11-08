import React from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp, CheckCircle, Edit, Trash2 } from 'lucide-react';
import Button from './Button';

const MinuteCard = ({ 
  minute, 
  onExpand, 
  isExpanded = false,
  showActions = false,
  onEdit,
  onDelete 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(minute);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(minute.id);
    }
  };

  return (
    <div className="card card-hover">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {minute.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{formatDate(minute.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>{formatTime(minute.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onExpand(minute.id)}
            className="text-neutral-500 hover:text-neutral-700 transition-colors p-1"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Content Preview */}
        {!isExpanded && (
          <p className="text-neutral-700 line-clamp-2">
            {minute.content}
          </p>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 animate-slide-in">
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">Content</h4>
              <p className="text-neutral-700 whitespace-pre-wrap">{minute.content}</p>
            </div>

            {minute.announcements && (
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-accent-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                  Announcements
                </h4>
                <p className="text-accent-800 whitespace-pre-wrap">{minute.announcements}</p>
              </div>
            )}

            {minute.tasks && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Tasks
                </h4>
                <p className="text-green-800 whitespace-pre-wrap">{minute.tasks}</p>
              </div>
            )}

            {showActions && onEdit && onDelete && (
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                <Button 
                  variant="secondary" 
                  size="sm"
                  icon={Edit}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  icon={Trash2}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MinuteCard;