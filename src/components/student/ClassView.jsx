import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import Button from '../shared/Button';
import MinuteCard from '../shared/MinuteCard';
import DatePicker from '../shared/DatePicker';
import EmptyState from '../shared/EmptyState';
import { getCurrentDate } from '../../utils/dateFormatter';

const ClassView = ({ 
  classData, 
  minutes,
  onBack 
}) => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [expandedMinute, setExpandedMinute] = useState(null);
  const [filteredMinutes, setFilteredMinutes] = useState([]);

  useEffect(() => {
    const filtered = minutes.filter(m => m.date === selectedDate);
    setFilteredMinutes(filtered);
  }, [selectedDate, minutes]);

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
          
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{classData.name}</h1>
            <div className="flex items-center gap-4 text-neutral-600">
              <p>{classData.subject}</p>
              <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
              <p>Teacher: {classData.teacherName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No Minutes for This Date"
              description={`No class minutes have been posted for ${selectedDate}.`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassView;