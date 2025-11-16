import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

const ResetPasswordModal = ({ isOpen, onClose, onConfirm, userName }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await onConfirm(password);
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reset password ${userName ? `for ${userName}` : ''}`} size="sm">
      <form onSubmit={handleConfirm} className="space-y-4">
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password (min 6 chars)"
            className="input"
            minLength={6}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;
