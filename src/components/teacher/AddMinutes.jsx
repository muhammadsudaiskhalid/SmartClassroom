import React, { useState } from 'react';
import { FileText, Megaphone, CheckSquare, AlertCircle } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import DatePicker from '../shared/DatePicker';
import { isValidMinutesContent, isEmpty } from '../../utils/validators';
import { getCurrentDate } from '../../utils/dateFormatter';

const AddMinutes = ({ isOpen, onClose, onAdd, classData, editMode = false, existingMinute = null }) => {
  const [formData, setFormData] = useState({
    date: existingMinute?.date || getCurrentDate(),
    title: existingMinute?.title || '',
    content: existingMinute?.content || '',
    announcements: existingMinute?.announcements || '',
    tasks: existingMinute?.tasks || ''
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

    if (isEmpty(formData.date)) {
      newErrors.date = 'Date is required';
    }

    if (isEmpty(formData.title)) {
      newErrors.title = 'Title is required';
    }

    if (!isValidMinutesContent(formData.content)) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onAdd(formData);
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save class minutes' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!editMode) {
      setFormData({
        date: getCurrentDate(),
        title: '',
        content: '',
        announcements: '',
        tasks: ''
      });
    }
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editMode ? 'Edit Class Minutes' : 'Add Class Minutes'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <DatePicker
          label="Date"
          value={formData.date}
          onChange={(value) => {
            setFormData(prev => ({ ...prev, date: value }));
            if (errors.date) {
              setErrors(prev => ({ ...prev, date: '' }));
            }
          }}
        />
        {errors.date && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.date}
          </p>
        )}

        {/* Title */}
        <div>
          <label className="label">Title</label>
          <div className="relative">
            <FileText size={18} className="absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to React Hooks"
              className={`input pl-10 ${errors.title ? 'input-error' : ''}`}
            />
          </div>
          {errors.title && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="label">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="What was covered in today's class..."
            rows={5}
            className={`input resize-none ${errors.content ? 'input-error' : ''}`}
          />
          {errors.content && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.content}
            </p>
          )}
        </div>

        {/* Announcements */}
        <div>
          <label className="label flex items-center gap-2">
            <Megaphone size={16} className="text-accent-600" />
            Announcements (Optional)
          </label>
          <textarea
            name="announcements"
            value={formData.announcements}
            onChange={handleChange}
            placeholder="Any important announcements..."
            rows={3}
            className="input resize-none"
          />
        </div>

        {/* Tasks */}
        <div>
          <label className="label flex items-center gap-2">
            <CheckSquare size={16} className="text-green-600" />
            Tasks/Homework (Optional)
          </label>
          <textarea
            name="tasks"
            value={formData.tasks}
            onChange={handleChange}
            placeholder="Tasks for students to complete..."
            rows={3}
            className="input resize-none"
          />
        </div>

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
            {loading ? 'Saving...' : editMode ? 'Update Minutes' : 'Add Minutes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMinutes;