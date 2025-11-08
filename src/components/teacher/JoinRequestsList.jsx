import React from 'react';
import { UserPlus, Check, X, Mail } from 'lucide-react';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';

const JoinRequestsList = ({ requests, onApprove, onReject, loading }) => {
  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon={UserPlus}
        title="No Join Requests"
        description="There are no pending join requests for this class."
      />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <UserPlus size={20} className="text-accent-600" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">{request.studentName}</h4>
                <p className="text-sm text-neutral-600 flex items-center gap-1">
                  <Mail size={14} />
                  {request.studentEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="success"
                size="sm"
                icon={Check}
                onClick={() => onApprove(request)}
                disabled={loading}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={X}
                onClick={() => onReject(request)}
                disabled={loading}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequestsList;