import React from 'react';
import { BookOpen, Users, Send, GraduationCap, Building2 } from 'lucide-react';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';
import { formatDateShort } from '../../utils/dateFormatter';

const AvailableClasses = ({ 
  classes, 
  enrolledClassIds = [],
  pendingRequestIds = [],
  onRequestJoin,
  loading 
}) => {
  const availableClasses = classes.filter(
    c => !enrolledClassIds.includes(c.id) && !pendingRequestIds.includes(c.id)
  );

  if (availableClasses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Available Classes"
        description="There are no classes available in your university and department at the moment. Check back later!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableClasses.map((classData) => (
        <div key={classData.id} className="card card-hover">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen size={24} className="text-accent-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate">
                  {classData.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-2">{classData.subject}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <GraduationCap size={14} />
                  <span>{classData.semester}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-neutral-700">
                Teacher: <span className="font-medium">{classData.teacherName}</span>
              </p>
              
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <Users size={16} />
                  <span>{classData.students?.length || 0} Students</span>
                </div>
                <span className="text-xs">
                  {formatDateShort(classData.createdAt)}
                </span>
              </div>
            </div>
            {/* University Info */}
            <div className="mb-4 p-2 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 flex items-center gap-1 mb-1">
                <Building2 size={12} />
                <span className="truncate">{classData.university}</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(classData.departments) ? (
                  classData.departments.map((dept, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded">
                      {dept}
                    </span>
                  ))
                ) : (
                  <span className="text-xs px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded">
                    {classData.department || classData.departments}
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="sm"
              icon={Send}
              onClick={() => onRequestJoin(classData)}
              disabled={loading}
            >
              Request to Join
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableClasses;