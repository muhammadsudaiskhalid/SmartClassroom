import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, UserPlus, FileText, Trash2, MessageSquare } from 'lucide-react';
import Button from '../shared/Button';
import MinuteCard from '../shared/MinuteCard';
import DatePicker from '../shared/DatePicker';
import EmptyState from '../shared/EmptyState';
import AddMinutes from './AddMinutes';
import JoinRequestsList from './JoinRequestsList';
import StudentsList from './StudentsList';
import ClassChat from '../shared/ClassChat';
import { getCurrentDate } from '../../utils/dateFormatter';

const ClassDetail = ({ 
  classData, 
  onBack, 
  minutes,
  requests,
  onAddMinutes,
  onEditMinutes,
  onDeleteMinutes,
  onApproveRequest,
  onRejectRequest,
  onRemoveStudent,
  onDeleteClass,
  loading
}) => {
  const [activeTab, setActiveTab] = useState('minutes');
  const [showAddMinutes, setShowAddMinutes] = useState(false);
  const [editingMinute, setEditingMinute] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [expandedMinute, setExpandedMinute] = useState(null);
  const [filteredMinutes, setFilteredMinutes] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (activeTab === 'minutes') {
      const filtered = minutes.filter(m => m.date === selectedDate);
      setFilteredMinutes(filtered);
    }
  }, [selectedDate, minutes, activeTab]);

  const tabs = [
    { id: 'minutes', label: 'Class Minutes', icon: FileText, count: minutes.length },
    { id: 'students', label: 'Students', icon: Users, count: classData.students?.length || 0 },
    { id: 'requests', label: 'Join Requests', icon: UserPlus, count: requests.length },
    { id: 'chat', label: 'Class Chat', icon: MessageSquare, count: 0 }
  ];

  const handleEditMinute = (minute) => {
    setEditingMinute(minute);
    setShowAddMinutes(true);
  };

  const handleDeleteMinute = async (minuteId) => {
    if (window.confirm('Are you sure you want to delete this class minute?')) {
      await onDeleteMinutes(minuteId);
    }
  };

  const handleCloseMinutesModal = () => {
    setShowAddMinutes(false);
    setEditingMinute(null);
  };

  const handleDeleteClass = async () => {
    if (window.confirm(`Are you sure you want to delete "${classData.name}"? This action cannot be undone and will remove all class minutes and student enrollments.`)) {
      await onDeleteClass(classData.id);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={onBack}
            >
              Back
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{classData.name}</h1>
              <p className="text-neutral-600">{classData.subject}</p>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'minutes' && (
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setShowAddMinutes(true)}
                >
                  Add Minutes
                </Button>
              )}
              <Button
                variant="danger"
                icon={Trash2}
                onClick={handleDeleteClass}
                disabled={loading}
              >
                Delete Class
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-neutral-200 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent-500 text-accent-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                  <span className={`badge ${
                    activeTab === tab.id ? 'badge-primary' : 'badge-neutral'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'minutes' && (
          <div className="space-y-6">
            {/* Date Filter */}
            <div className="flex items-center justify-between">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                label="Select Date"
                className="w-64"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDate(getCurrentDate())}
              >
                Today
              </Button>
            </div>

            {/* Minutes List */}
            {filteredMinutes.length > 0 ? (
              <div className="space-y-4">
                {filteredMinutes.map((minute) => (
                  <MinuteCard
                    key={minute.id}
                    minute={minute}
                    isExpanded={expandedMinute === minute.id}
                    onExpand={(id) => setExpandedMinute(expandedMinute === id ? null : id)}
                    showActions={true}
                    onEdit={handleEditMinute}
                    onDelete={handleDeleteMinute}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No Minutes for This Date"
                description={`No class minutes have been added for ${selectedDate}. Add minutes to keep track of what was covered.`}
                actionLabel="Add Minutes"
                onAction={() => setShowAddMinutes(true)}
              />
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <StudentsList
            students={classData.students || []}
            onRemove={onRemoveStudent}
            loading={loading}
          />
        )}

        {activeTab === 'requests' && (
          <JoinRequestsList
            requests={requests}
            onApprove={onApproveRequest}
            onReject={onRejectRequest}
            loading={loading}
          />
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-accent-500" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Class Chat</h3>
              <p className="text-neutral-600 mb-4">
                Real-time chat with your students. Use the floating chat button to start messaging.
              </p>
              <Button
                onClick={() => setShowChat(true)}
                variant="primary"
                icon={MessageSquare}
              >
                Open Class Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Component */}
      <ClassChat
        classId={classData.id}
        isOpen={showChat}
        onToggle={() => setShowChat(!showChat)}
      />

      {/* Add/Edit Minutes Modal */}
      <AddMinutes
        isOpen={showAddMinutes}
        onClose={handleCloseMinutesModal}
        onAdd={editingMinute ? onEditMinutes : onAddMinutes}
        classData={classData}
        editMode={!!editingMinute}
        existingMinute={editingMinute}
      />
    </div>
  );
};

export default ClassDetail;