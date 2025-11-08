import React, { useState } from 'react';
import { BookOpen, Users, ChevronRight, GraduationCap, LogOut } from 'lucide-react';
import EmptyState from '../shared/EmptyState';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import { formatDateShort } from '../../utils/dateFormatter';

const MyClasses = ({ classes, onSelectClass, onLeaveClass }) => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedClassToLeave, setSelectedClassToLeave] = useState(null);
  const [loading, setLoading] = useState(false);

  if (classes.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Not Enrolled in Any Classes"
        description="Browse available classes from your university and department, then request to join to get started."
      />
    );
  }

  const handleLeaveClick = (e, classData) => {
    e.stopPropagation();
    setSelectedClassToLeave(classData);
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = async () => {
    if (!selectedClassToLeave) return;

    try {
      setLoading(true);
      await onLeaveClass(selectedClassToLeave.id);
      setShowLeaveModal(false);
      setSelectedClassToLeave(null);
    } catch (error) {
      console.error('Leave class error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classData) => (
          <div
            key={classData.id}
            className="card card-hover cursor-pointer group relative"
          >
            <div className="p-6" onClick={() => onSelectClass(classData)}>
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
                  <span>{classData.semester}</span>
                </div>

                <p className="text-sm text-neutral-600">
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

              {/* University Badge */}
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 truncate">
                  {classData.university} • {classData.department}
                </p>
              </div>
            </div>

            {/* Leave Button */}
            <div className="px-6 pb-4">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                icon={LogOut}
                onClick={(e) => handleLeaveClick(e, classData)}
                className="text-red-600 hover:bg-red-50 border border-red-200"
              >
                Leave Class
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Confirmation Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false);
          setSelectedClassToLeave(null);
        }}
        title="Leave Class"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            Are you sure you want to leave <span className="font-semibold">{selectedClassToLeave?.name}</span>?
          </p>
          <p className="text-sm text-neutral-600">
            You will no longer have access to class minutes and materials. You can request to join again later.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowLeaveModal(false);
                setSelectedClassToLeave(null);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmLeave}
              disabled={loading}
            >
              {loading ? 'Leaving...' : 'Leave Class'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MyClasses;