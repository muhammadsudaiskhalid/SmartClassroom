import React, { useState } from 'react';
import { BookOpen, Tag, AlertCircle, Building2, GraduationCap, X } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { isValidClassName, isValidSubject } from '../../utils/validators';
import { SEMESTERS, DEPARTMENTS } from '../../utils/constants';

const CreateClass = ({ isOpen, onClose, onCreate, userUniversity, userDepartment }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    semester: '',
    departments: [userDepartment] // Default to teacher's department
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDepartmentToggle = (dept) => {
    setFormData(prev => {
      const departments = prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept];
      return { ...prev, departments };
    });
    if (errors.departments) {
      setErrors(prev => ({ ...prev, departments: '' }));
    }
  };

  const removeDepartment = (dept) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== dept)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!isValidClassName(formData.name)) {
      newErrors.name = 'Class name must be between 3-50 characters';
    }

    if (!isValidSubject(formData.subject)) {
      newErrors.subject = 'Subject must be between 2-30 characters';
    }

    if (!formData.semester) {
      newErrors.semester = 'Please select a semester';
    }

    if (formData.departments.length === 0) {
      newErrors.departments = 'Please select at least one department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onCreate(formData.name, formData.subject, formData.semester, formData.departments);
      setFormData({ 
        name: '', 
        subject: '', 
        semester: '',
        departments: [userDepartment]
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create class' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
      subject: '', 
      semester: '',
      departments: [userDepartment]
    });
    setErrors({});
    setShowDepartmentDropdown(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Class"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* University Info (Read-only) */}
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Building2 size={16} className="text-accent-600" />
            <span className="font-medium text-accent-900">University:</span>
            <span className="text-accent-700">{userUniversity}</span>
          </div>
          <p className="text-xs text-accent-600">
            This class will be visible to students from the selected departments and semester.
          </p>
        </div>

        {/* Class Name */}
        <div>
          <label className="label">Class Name</label>
          <div className="relative">
            <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Object Oriented Programming"
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

        {/* Subject/Course Code */}
        <div>
          <label className="label">Subject / Course Code</label>
          <div className="relative">
            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., CS-201"
              className={`input pl-10 ${errors.subject ? 'input-error' : ''}`}
            />
          </div>
          {errors.subject && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Departments - Multi-select */}
        <div>
          <label className="label">Departments (Multiple Selection)</label>
          
          {/* Selected Departments */}
          <div className="mb-2 flex flex-wrap gap-2">
            {formData.departments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm"
              >
                {dept}
                <button
                  type="button"
                  onClick={() => removeDepartment(dept)}
                  className="hover:bg-accent-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
              className={`input text-left ${errors.departments ? 'input-error' : ''}`}
            >
              {formData.departments.length === 0 
                ? 'Select departments...' 
                : `${formData.departments.length} department(s) selected`}
            </button>

            {showDepartmentDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDepartmentDropdown(false)}
                />
                <div className="absolute z-20 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {DEPARTMENTS.map((dept) => (
                    <label
                      key={dept}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.departments.includes(dept)}
                        onChange={() => handleDepartmentToggle(dept)}
                        className="w-4 h-4 text-accent-600 rounded focus:ring-accent-500"
                      />
                      <span className="text-sm text-neutral-700">{dept}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {errors.departments && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.departments}
            </p>
          )}
          <p className="text-xs text-neutral-500 mt-1">
            Select all departments that can take this class
          </p>
        </div>

        {/* Semester */}
        <div>
          <label className="label">Semester</label>
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

        {/* Info message */}
        {formData.departments.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                This class will be available to students from <strong>{formData.departments.length} departments</strong> in {formData.semester || 'the selected semester'}.
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
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Class'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClass;