import React from 'react';
import { BookOpen, Users, Calendar, ChevronRight, GraduationCap } from 'lucide-react';
import { formatDateShort } from '../../utils/dateFormatter';

const ClassCard = ({ classData, onClick }) => {
  // Get departments string
  const departmentsText = Array.isArray(classData.departments)
    ? classData.departments.length > 2
      ? `${classData.departments.slice(0, 2).join(', ')} +${classData.departments.length - 2} more`
      : classData.departments.join(', ')
    : classData.department || classData.departments;

  return (
    <div
      onClick={onClick}
      className="card card-hover cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center group-hover:bg-accent-200 transition-colors">
              <BookOpen size={24} className="text-accent-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-accent-600 transition-colors">
                {classData.name}
              </h3>
              <p className="text-sm text-neutral-600">{classData.subject}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-neutral-400 group-hover:text-accent-600 transition-colors" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <GraduationCap size={16} className="text-accent-600" />
            <span className="font-medium">{classData.semester}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Users size={16} />
              <span>{classData.students?.length || 0} Students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{formatDateShort(classData.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* University & Departments Badge */}
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 truncate">
            {classData.university}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {Array.isArray(classData.departments) ? (
              classData.departments.map((dept, index) => (
                <span key={index} className="badge badge-neutral text-xs">
                  {dept}
                </span>
              ))
            ) : (
              <span className="badge badge-neutral text-xs">
                {classData.department || classData.departments}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;