import React, { useState } from 'react';
import { X, Plus, AlertCircle, User, GraduationCap } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS } from '../../utils/constants';

const AddUserModal = ({ type: initialType = 'teacher', onClose, onCreate }) => {
  const [activeTab, setActiveTab] = useState(initialType);
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    employeeId: '',
    department: '',
    email: '',
    semester: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset form when switching tabs
    setFormData({
      name: '',
      registrationNumber: '',
      employeeId: '',
      department: '',
      email: '',
      semester: '',
      password: ''
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // For students, registrationNumber is the same as their ID
      const payload = {
        ...formData,
        type: activeTab
      };
      
      await onCreate(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Add User</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Slider */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="bg-white rounded-lg p-1 flex gap-1 shadow-sm">
            <button
              type="button"
              onClick={() => handleTabChange('teacher')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all ${
                activeTab === 'teacher'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={18} />
              Teacher
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all ${
                activeTab === 'student'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <GraduationCap size={18} />
              Student
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                placeholder="Enter full name" 
              />
            </div>

            {activeTab === 'teacher' ? (
              <>
                {/* Teacher Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="employeeId" 
                    required 
                    value={formData.employeeId} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    placeholder="e.g., EMP-001" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique employee identifier</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="registrationNumber" 
                    required 
                    value={formData.registrationNumber} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    placeholder="e.g., TEACH-001" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for login</p>
                </div>
              </>
            ) : (
              <>
                {/* Student Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID / Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="registrationNumber" 
                    required 
                    value={formData.registrationNumber} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    placeholder="e.g., STU-2024-001" 
                  />
                  <p className="text-xs text-gray-500 mt-1">This serves as both Student ID and Registration Number (used for login)</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={formData.email} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                placeholder="email@university.edu" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select 
                name="department" 
                required 
                value={formData.department} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {activeTab === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select 
                  name="semester" 
                  required 
                  value={formData.semester} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Semester</option>
                  {SEMESTERS.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temporary Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                minLength={6} 
                value={formData.password} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                placeholder="Min 6 characters" 
              />
              <p className="text-xs text-gray-500 mt-1">User will be able to change this password after first login</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-red-800">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-medium shadow-sm"
              >
                <Plus className="w-5 h-5" />
                {loading ? 'Creating...' : `Create ${activeTab === 'teacher' ? 'Teacher' : 'Student'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
