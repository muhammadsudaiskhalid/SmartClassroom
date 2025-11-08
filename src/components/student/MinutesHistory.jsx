import React, { useState } from 'react';
import { Calendar, FileText } from 'lucide-react';
import MinuteCard from '../shared/MinuteCard';
import EmptyState from '../shared/EmptyState';
import { getRelativeDate } from '../../utils/dateFormatter';

const MinutesHistory = ({ minutes }) => {
  const [expandedMinute, setExpandedMinute] = useState(null);

  // Group minutes by date
  const groupedMinutes = minutes.reduce((acc, minute) => {
    if (!acc[minute.date]) {
      acc[minute.date] = [];
    }
    acc[minute.date].push(minute);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedMinutes).sort((a, b) => 
    new Date(b) - new Date(a)
  );

  if (minutes.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No History Yet"
        description="Class minutes will appear here as your teacher posts them."
      />
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className="text-accent-600" />
            <h3 className="text-lg font-semibold text-neutral-900">
              {getRelativeDate(date)}
            </h3>
            <span className="text-sm text-neutral-500">{date}</span>
          </div>
          <div className="space-y-4">
            {groupedMinutes[date].map((minute) => (
              <MinuteCard
                key={minute.id}
                minute={minute}
                isExpanded={expandedMinute === minute.id}
                onExpand={(id) => setExpandedMinute(expandedMinute === id ? null : id)}
                showActions={false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MinutesHistory;