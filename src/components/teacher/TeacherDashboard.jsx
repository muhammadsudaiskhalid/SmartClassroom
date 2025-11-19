import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Button from '../shared/Button';
import ClassCard from './ClassCard';
import CreateClass from './CreateClass';
import EmptyState from '../shared/EmptyState';
import Header from '../layout/Header';

const TeacherDashboard = ({ 
  user,
  classes, 
  onCreateClass, 
  onSelectClass,
  loading 
}) => {
  const [showCreateClass, setShowCreateClass] = useState(false);

  return (
    <>
      <Header
        title="My Classes"
        subtitle={`${user.university?.name || user.universityId?.name || 'University'} • ${user.department} • ${classes.length} ${classes.length === 1 ? 'class' : 'classes'}`}
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateClass(true)}
          >
            Create Class
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onClick={() => onSelectClass(classData)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No Classes Yet"
            description="Create your first class to start connecting with students and sharing class minutes."
            actionLabel="Create Your First Class"
            onAction={() => setShowCreateClass(true)}
          />
        )}
      </div>

      <CreateClass
        isOpen={showCreateClass}
        onClose={() => setShowCreateClass(false)}
        onCreate={onCreateClass}
        userUniversity={user.university?.name || user.universityId?.name || 'University'}
        userDepartment={user.department}
      />
    </>
  );
};

export default TeacherDashboard;