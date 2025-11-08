import React, { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import Header from '../layout/Header';
import MyClasses from './MyClasses';
import AvailableClasses from './AvailableClasses';

const StudentDashboard = ({ 
  user,
  myClasses,
  availableClasses,
  enrolledClassIds,
  pendingRequestIds,
  onRequestJoin,
  onSelectClass,
  onLeaveClass, // Add this prop
  loading 
}) => {
  const [activeTab, setActiveTab] = useState('my-classes');

  const tabs = [
    { id: 'my-classes', label: 'My Classes', count: myClasses.length },
    { id: 'available', label: 'Available Classes', count: availableClasses.length }
  ];

  return (
    <>
      <Header
        title="Student Dashboard"
        subtitle={`${user.university} • ${user.department} • ${user.semester} • Enrolled in ${myClasses.length} ${myClasses.length === 1 ? 'class' : 'classes'}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.id === 'my-classes' ? (
                <BookOpen size={18} />
              ) : (
                <Search size={18} />
              )}
              <span className="font-medium">{tab.label}</span>
              <span className={`badge ${
                activeTab === tab.id ? 'badge-primary' : 'badge-neutral'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'my-classes' && (
          <MyClasses
            classes={myClasses}
            onSelectClass={onSelectClass}
            onLeaveClass={onLeaveClass}
          />
        )}

        {activeTab === 'available' && (
          <AvailableClasses
            classes={availableClasses}
            enrolledClassIds={enrolledClassIds}
            pendingRequestIds={pendingRequestIds}
            onRequestJoin={onRequestJoin}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default StudentDashboard;