import { useState, useEffect } from 'react';
import minutesService from '../services/minutes.service';

export const useMinutes = (classId) => {
  const [minutes, setMinutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (classId) {
      loadMinutes();
    }
  }, [classId]);

  const loadMinutes = async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError(null);

      const loadedMinutes = await minutesService.getClassMinutes(classId);
      setMinutes(loadedMinutes);
    } catch (err) {
      console.error('Load minutes error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveMinutes = async (minutesData) => {
    try {
      setLoading(true);
      setError(null);

      const savedMinutes = await minutesService.saveMinutes({
        ...minutesData,
        classId
      });

      // Update or add to the list
      setMinutes(prev => {
        const existing = prev.find(m => m.id === savedMinutes.id);
        if (existing) {
          return prev.map(m => (m.id === savedMinutes.id ? savedMinutes : m));
        }
        return [savedMinutes, ...prev];
      });

      return savedMinutes;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMinutesByDate = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const minute = await minutesService.getMinutesByDate(classId, date);
      return minute;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMinutes = async (minuteId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const updatedMinutes = await minutesService.updateMinutes(minuteId, updates);
      setMinutes(prev =>
        prev.map(m => (m.id === minuteId ? updatedMinutes : m))
      );

      return updatedMinutes;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMinutes = async (minuteId) => {
    try {
      setLoading(true);
      setError(null);

      await minutesService.deleteMinutes(minuteId);
      setMinutes(prev => prev.filter(m => m.id !== minuteId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMinutesByDateRange = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const rangeMinutes = await minutesService.getMinutesByDateRange(
        classId,
        startDate,
        endDate
      );
      return rangeMinutes;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshMinutes = () => {
    loadMinutes();
  };

  return {
    minutes,
    loading,
    error,
    saveMinutes,
    getMinutesByDate,
    updateMinutes,
    deleteMinutes,
    getMinutesByDateRange,
    refreshMinutes
  };
};