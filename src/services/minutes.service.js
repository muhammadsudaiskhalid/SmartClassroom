import storageService from './storage.service';
import { STORAGE_KEYS } from '../utils/constants';

class MinutesService {
  /**
   * Create or update class minutes for a specific date
   */
  async saveMinutes(minutesData) {
    try {
      const { classId, date, title, content, announcements, tasks } = minutesData;

      const minuteId = `${STORAGE_KEYS.MINUTES_PREFIX}${classId}:${date}`;
      
      const minutes = {
        id: minuteId,
        classId,
        date,
        title,
        content,
        announcements: announcements || '',
        tasks: tasks || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save as shared (visible to all enrolled students)
      const result = await storageService.set(
        minuteId,
        JSON.stringify(minutes),
        true
      );

      if (!result) {
        throw new Error('Failed to save class minutes');
      }

      return minutes;
    } catch (error) {
      console.error('Save minutes error:', error);
      throw error;
    }
  }

  /**
   * Get minutes for a specific class and date
   */
  async getMinutesByDate(classId, date) {
    try {
      const minuteId = `${STORAGE_KEYS.MINUTES_PREFIX}${classId}:${date}`;
      const result = await storageService.get(minuteId, true);
      
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error('Get minutes by date error:', error);
      return null;
    }
  }

  /**
   * Get all minutes for a class
   */
  async getClassMinutes(classId) {
    try {
      const minutes = await storageService.getAllWithPrefix(
        `${STORAGE_KEYS.MINUTES_PREFIX}${classId}:`,
        true
      );
      
      // Sort by date (newest first)
      return minutes.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Get class minutes error:', error);
      return [];
    }
  }

  /**
   * Update existing minutes
   */
  async updateMinutes(minuteId, updates) {
    try {
      const result = await storageService.get(minuteId, true);
      
      if (!result || !result.value) {
        throw new Error('Minutes not found');
      }

      const existingMinutes = JSON.parse(result.value);
      const updatedMinutes = {
        ...existingMinutes,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await storageService.set(
        minuteId,
        JSON.stringify(updatedMinutes),
        true
      );

      return updatedMinutes;
    } catch (error) {
      console.error('Update minutes error:', error);
      throw error;
    }
  }

  /**
   * Delete minutes
   */
  async deleteMinutes(minuteId) {
    try {
      const result = await storageService.delete(minuteId, true);
      return result !== null;
    } catch (error) {
      console.error('Delete minutes error:', error);
      throw error;
    }
  }

  /**
   * Get minutes for multiple classes
   */
  async getMinutesForClasses(classIds) {
    try {
      const allMinutes = await Promise.all(
        classIds.map(classId => this.getClassMinutes(classId))
      );
      
      // Flatten and sort
      return allMinutes
        .flat()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Get minutes for classes error:', error);
      return [];
    }
  }

  /**
   * Get minutes by date range
   */
  async getMinutesByDateRange(classId, startDate, endDate) {
    try {
      const allMinutes = await this.getClassMinutes(classId);
      
      return allMinutes.filter(m => {
        const minuteDate = new Date(m.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return minuteDate >= start && minuteDate <= end;
      });
    } catch (error) {
      console.error('Get minutes by date range error:', error);
      return [];
    }
  }
}

export default new MinutesService();