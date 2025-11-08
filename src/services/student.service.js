import storageService from './storage.service';
import { STORAGE_KEYS, REQUEST_STATUS } from '../utils/constants';

class StudentService {
  /**
   * Create a join request
   */
  async createJoinRequest(requestData) {
    try {
      const { classId, studentId, studentName, studentEmail, registrationNumber } = requestData;

      if (!classId || !studentId || !studentName) {
        throw new Error('Missing required fields for join request');
      }

      const requestId = `${STORAGE_KEYS.REQUEST_PREFIX}${classId}:${studentId}`;

      console.log('Creating join request with ID:', requestId);

      // Check if request already exists
      try {
        const existingRequest = await storageService.get(requestId, true);
        if (existingRequest && existingRequest.value) {
          throw new Error('You have already requested to join this class');
        }
      } catch (error) {
        if (error.message.includes('already requested')) {
          throw error;
        }
        // Continue if it's just a "not found" error
      }

      const request = {
        id: requestId,
        classId,
        studentId,
        studentName,
        studentEmail: studentEmail || `${registrationNumber}@university.edu.pk`,
        registrationNumber,
        status: REQUEST_STATUS.PENDING,
        createdAt: new Date().toISOString()
      };

      console.log('Saving join request:', request);

      // Save as shared (visible to teacher)
      const result = await storageService.set(
        requestId,
        JSON.stringify(request),
        true // shared
      );

      if (!result) {
        throw new Error('Failed to create join request');
      }

      console.log('Join request created successfully');

      return request;
    } catch (error) {
      console.error('Create join request error:', error);
      throw error;
    }
  }

  /**
   * Get all requests for a class
   */
  async getClassRequests(classId) {
    try {
      const requests = await storageService.getAllWithPrefix(
        `${STORAGE_KEYS.REQUEST_PREFIX}${classId}:`,
        true
      );
      
      // Filter only pending requests
      return requests.filter(r => r.status === REQUEST_STATUS.PENDING);
    } catch (error) {
      console.error('Get class requests error:', error);
      return [];
    }
  }

  /**
   * Get all requests by a student
   */
  async getStudentRequests(studentId) {
    try {
      const allRequests = await storageService.getAllWithPrefix(
        STORAGE_KEYS.REQUEST_PREFIX,
        true
      );
      
      return allRequests.filter(r => r.studentId === studentId);
    } catch (error) {
      console.error('Get student requests error:', error);
      return [];
    }
  }

  /**
   * Update request status
   */
  async updateRequestStatus(requestId, status) {
    try {
      const result = await storageService.get(requestId, true);
      
      if (!result || !result.value) {
        throw new Error('Request not found');
      }

      const request = JSON.parse(result.value);
      const updatedRequest = {
        ...request,
        status,
        updatedAt: new Date().toISOString()
      };

      await storageService.set(
        requestId,
        JSON.stringify(updatedRequest),
        true
      );

      return updatedRequest;
    } catch (error) {
      console.error('Update request status error:', error);
      throw error;
    }
  }

  /**
   * Delete/reject a request
   */
  async deleteRequest(requestId) {
    try {
      const result = await storageService.delete(requestId, true);
      return result !== null;
    } catch (error) {
      console.error('Delete request error:', error);
      throw error;
    }
  }

  /**
   * Approve a join request
   */
  async approveRequest(requestId) {
    try {
      await this.updateRequestStatus(requestId, REQUEST_STATUS.APPROVED);
      return true;
    } catch (error) {
      console.error('Approve request error:', error);
      throw error;
    }
  }

  /**
   * Reject a join request
   */
  async rejectRequest(requestId) {
    try {
      await this.updateRequestStatus(requestId, REQUEST_STATUS.REJECTED);
      // Optionally delete the request after rejection
      await this.deleteRequest(requestId);
      return true;
    } catch (error) {
      console.error('Reject request error:', error);
      throw error;
    }
  }

  /**
   * Get pending requests count for a class
   */
  async getPendingRequestsCount(classId) {
    try {
      const requests = await this.getClassRequests(classId);
      return requests.length;
    } catch (error) {
      console.error('Get pending requests count error:', error);
      return 0;
    }
  }

  /**
   * Check if student has pending request for a class
   */
  async hasPendingRequest(classId, studentId) {
    try {
      const requestId = `${STORAGE_KEYS.REQUEST_PREFIX}${classId}:${studentId}`;
      const result = await storageService.get(requestId, true);
      
      if (result && result.value) {
        const request = JSON.parse(result.value);
        return request.status === REQUEST_STATUS.PENDING;
      }
      return false;
    } catch (error) {
      console.error('Check pending request error:', error);
      return false;
    }
  }
}

export default new StudentService();