import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

const EditUniversityModal = ({ isOpen, onClose, university, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    subscriptionType: 'trial',
    startDate: '',
    expiryDate: '',
    maxUsers: 1000,
    contactEmail: '',
    contactPhone: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name || '',
        status: university.status || 'active',
        subscriptionType: university.subscriptionType || 'trial',
        startDate: university.startDate ? university.startDate.split('T')[0] : '',
        expiryDate: university.expiryDate ? university.expiryDate.split('T')[0] : '',
        maxUsers: university.maxUsers || 1000,
        contactEmail: university.contactEmail || '',
        contactPhone: university.contactPhone || '',
        notes: university.notes || ''
      });
    }
  }, [university]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'University name must be at least 3 characters';
    }

    if (formData.maxUsers < 1) {
      newErrors.maxUsers = 'Max users must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onUpdate(university.id, formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update university' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit University"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* University Name */}
        <div>
          <label className="label">University Name *</label>
          <div className="relative">
            <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Status and Subscription Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input appearance-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="label">Subscription Type *</label>
            <select
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleChange}
              className="input appearance-none"
            >
              <option value="trial">Trial</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              disabled={formData.subscriptionType === 'lifetime'}
              className="input"
            />
          </div>
        </div>

        {/* Max Users */}
        <div>
          <label className="label">Maximum Users *</label>
          <input
            type="number"
            name="maxUsers"
            value={formData.maxUsers}
            onChange={handleChange}
            min="1"
            className={`input ${errors.maxUsers ? 'input-error' : ''}`}
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input resize-none"
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Updating...' : 'Update University'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUniversityModal;