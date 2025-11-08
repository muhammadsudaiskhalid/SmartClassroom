import React from 'react';
import { Users, Mail, X } from 'lucide-react';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';

const StudentsList = ({ students, onRemove, loading }) => {
  if (!students || students.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Students Yet"
        description="Students will appear here once they join your class."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {students.map((student) => (
        <div key={student.id} className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">{student.name}</h4>
                <p className="text-sm text-neutral-600 flex items-center gap-1">
                  <Mail size={14} />
                  {student.email}
                </p>
              </div>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={() => onRemove(student.id)}
                disabled={loading}
                className="text-red-600 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentsList;