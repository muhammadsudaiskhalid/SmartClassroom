import React, { useState } from 'react';
import { Building2, Edit, Trash2, Power, AlertCircle } from 'lucide-react';
import Button from '../shared/Button';
import EditUniversityModal from './EditUniversityModal';

const UniversityList = ({ universities, onUpdate, onDelete, onToggleStatus, loading }) => {
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'suspended':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'expired':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  const getSubscriptionBadge = (type) => {
    const colors = {
      trial: 'bg-blue-500/10 text-blue-400',
      monthly: 'bg-purple-500/10 text-purple-400',
      quarterly: 'bg-indigo-500/10 text-indigo-400',
      yearly: 'bg-green-500/10 text-green-400',
      lifetime: 'bg-yellow-500/10 text-yellow-400'
    };
    return colors[type] || 'bg-neutral-500/10 text-neutral-400';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleEdit = (university) => {
    setEditingUniversity(university);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setEditingUniversity(null);
    setShowEditModal(false);
  };

  if (universities.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 size={48} className="mx-auto mb-4 text-neutral-600" />
        <p className="text-neutral-400">No universities added yet</p>
        <p className="text-sm text-neutral-500 mt-2">Click "Add University" to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {universities.map((university) => {
          const daysRemaining = getDaysRemaining(university.expiryDate);
          const isExpiringSoon = daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 0;
          const isExpired = daysRemaining !== null && daysRemaining <= 0;

          return (
            <div
              key={university.id}
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={24} className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2">{university.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(university.status)}`}>
                        {university.status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionBadge(university.subscriptionType)}`}>
                        {university.subscriptionType.toUpperCase()}
                      </span>
                      {isExpiringSoon && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Expiring in {daysRemaining} days
                        </span>
                      )}
                      {isExpired && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Expired
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500 mb-1">Users</p>
                        <p className="text-white font-medium">
                          {university.currentUsers || 0} / {university.maxUsers}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-1">Start Date</p>
                        <p className="text-white font-medium">{formatDate(university.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-1">Expiry Date</p>
                        <p className={`font-medium ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-white'}`}>
                          {formatDate(university.expiryDate)}
                        </p>
                      </div>
                    </div>

                    {university.contactEmail && (
                      <div className="mt-3 text-sm">
                        <p className="text-neutral-500">Contact: <span className="text-neutral-300">{university.contactEmail}</span></p>
                      </div>
                    )}

                    {university.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-neutral-400">{university.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Power}
                    onClick={() => onToggleStatus(university.id)}
                    className={university.status === 'active' ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}
                    disabled={loading}
                  >
                    {university.status === 'active' ? 'Active' : 'Inactive'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleEdit(university)}
                    className="text-blue-400 hover:bg-blue-500/10"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDelete(university.id)}
                    className="text-red-400 hover:bg-red-500/10"
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingUniversity && (
        <EditUniversityModal
          isOpen={showEditModal}
          onClose={handleCloseEdit}
          university={editingUniversity}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default UniversityList;