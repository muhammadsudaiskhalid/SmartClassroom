import React, { useState } from 'react';
import { User, Building2, BookOpen, GraduationCap, AlertCircle, Save } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { isValidName } from '../../utils/validators';
import { SEMESTERS, DEPARTMENTS } from '../../utils/constants';

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    semester: user?.semester || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!isValidName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    if (user?.type === 'student' && !formData.semester) {
      newErrors.semester = 'Please select a semester';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: user?.name || '',
      department: user?.department || '',
      semester: user?.semester || ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Profile"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only fields */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-xs text-neutral-600 mb-1">Registration Number</p>
            <p className="text-sm font-medium text-neutral-900">{user?.registrationNumber}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 mb-1">University</p>
            <p className="text-sm font-medium text-neutral-900">{user?.university}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 mb-1">Account Type</p>
            <span className="inline-flex items-center badge badge-primary capitalize">
              {user?.type}
            </span>
          </div>
        </div>

        {/* Editable Name */}
        <div>
          <label className="label">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Editable Department */}
        <div>
          <label className="label">Department</label>
          <div className="relative">
            <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`input pl-10 appearance-none ${errors.department ? 'input-error' : ''}`}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {errors.department && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.department}
            </p>
          )}
        </div>

        {/* Semester: students cannot edit this field */}
        {user?.type === 'student' ? (
          <div>
            <label className="label">Current Semester</label>
            <div className="relative">
              <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />
              <input
                type="text"
                name="semester"
                value={formData.semester || user?.semester || ''}
                readOnly
                className="input pl-10 bg-neutral-50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Semester changes must be performed by an administrator or instructor.</p>
          </div>
        ) : (
          <div>
            <label className="label">Current Semester</label>
            <div className="relative">
              <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`input pl-10 appearance-none ${errors.semester ? 'input-error' : ''}`}
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            {errors.semester && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.semester}
              </p>
            )}
          </div>
        )}

        {/* Info about semester change */}
        {user?.type !== 'student' && formData.semester !== user?.semester && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                Changing your semester will update the classes available to you. Your current enrolled classes will remain accessible.
              </span>
            </p>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
            <AlertCircle size={18} />
            <p className="text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileModal;