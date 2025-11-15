import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const AddUserModal = ({ type = 'teacher', onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    employeeId: '',
    studentId: '',
    department: '',
    email: '',
    semester: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({ ...formData, type });
      onClose();
    } catch (err) {
      console.error('Failed to create user', err);
      alert('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-xl font-bold">Add {type === 'teacher' ? 'Teacher' : 'Student'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg" placeholder="Full name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
              <input name="registrationNumber" required value={formData.registrationNumber} onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg" placeholder="Registration number" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{type === 'teacher' ? 'Employee ID' : 'Student ID'}</label>
              <input name={type === 'teacher' ? 'employeeId' : 'studentId'}
                required value={type === 'teacher' ? formData.employeeId : formData.studentId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg" placeholder={`Enter ${type === 'teacher' ? 'employee' : 'student'} id`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg" placeholder="email@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input name="department" required value={formData.department} onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg" placeholder="Department" />
            </div>

            {type === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <input name="semester" required value={formData.semester} onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg" placeholder="e.g. 1st Semester" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input name="password" type="password" required minLength={6} value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg" placeholder="Temporary password" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg">
              <Plus className="w-5 h-5" />
              {loading ? 'Creating...' : `Create ${type === 'teacher' ? 'Teacher' : 'Student'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
