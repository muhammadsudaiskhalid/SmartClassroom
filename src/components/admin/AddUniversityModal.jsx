import React, { useState } from 'react';
import { Building2, Calendar, Users, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { UNIVERSITY_STATUS, SUBSCRIPTION_TYPES, UNIVERSITIES } from '../../utils/constants';

const AddUniversityModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    subscriptionType: 'trial',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    maxUsers: 1000,
    contactEmail: '',
    contactPhone: '',
    notes: ''
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

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'University name must be at least 3 characters';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.subscriptionType !== 'lifetime' && !formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required (unless lifetime)';
    }

    if (formData.expiryDate && formData.startDate) {
      const start = new Date(formData.startDate);
      const expiry = new Date(formData.expiryDate);
      if (expiry <= start) {
        newErrors.expiryDate = 'Expiry date must be after start date';
      }
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
      await onAdd(formData);
      setFormData({
        name: '',
        status: 'active',
        subscriptionType: 'trial',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        maxUsers: 1000,
        contactEmail: '',
        contactPhone: '',
        notes: ''
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to add university' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      status: 'active',
      subscriptionType: 'trial',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      maxUsers: 1000,
      contactEmail: '',
      contactPhone: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New University"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* University Name (choose from canonical list) */}
        <div>
          <label className="label">University Name *</label>
          <div className="relative">
            <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="name"
              list="universities-list"
              value={formData.name}
              onChange={handleChange}
              placeholder="Start typing or select a university"
              className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
            />
            <datalist id="universities-list">
              {UNIVERSITIES.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
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
            <label className="label">Start Date *</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`input pl-10 ${errors.startDate ? 'input-error' : ''}`}
              />
            </div>
            {errors.startDate && (
              <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="label">
              Expiry Date {formData.subscriptionType !== 'lifetime' && '*'}
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                disabled={formData.subscriptionType === 'lifetime'}
                className={`input pl-10 ${errors.expiryDate ? 'input-error' : ''}`}
              />
            </div>
            {errors.expiryDate && (
              <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>
        </div>

        {/* Max Users */}
        <div>
          <label className="label">Maximum Users *</label>
          <div className="relative">
            <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="number"
              name="maxUsers"
              value={formData.maxUsers}
              onChange={handleChange}
              min="1"
              className={`input pl-10 ${errors.maxUsers ? 'input-error' : ''}`}
            />
          </div>
          {errors.maxUsers && (
            <p className="text-red-600 text-sm mt-1">{errors.maxUsers}</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Contact Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="admin@university.edu.pk"
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Contact Phone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes (Optional)</label>
          <div className="relative">
            <FileText size={18} className="absolute left-3 top-3 text-neutral-400" />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows={3}
              className="input pl-10 resize-none"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              Once added, users from this university will be able to register and access the system based on the status and expiry date.
            </span>
          </p>
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
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Adding...' : 'Add University'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUniversityModal;