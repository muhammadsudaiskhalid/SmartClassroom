// Storage Service - Wrapper for window.storage API with fallback
// This service provides a clean interface for all storage operations

class StorageService {
  constructor() {
    this.isStorageAvailable = typeof window !== 'undefined' && window.storage;
    this.localCache = new Map(); // Fallback for development
  }

  /**
   * Check if window.storage is available
   */
  checkStorage() {
    if (!this.isStorageAvailable) {
      console.warn('window.storage not available, using local cache fallback');
      return false;
    }
    return true;
  }

  /**
   * Get data from storage
   */
  async get(key, shared = false) {
    try {
      if (this.checkStorage()) {
        const result = await window.storage.get(key, shared);
        return result;
      } else {
        // Fallback to local cache
        const value = this.localCache.get(key);
        if (value) {
          return { key, value, shared };
        }
        return null;
      }
    } catch (error) {
      console.error(`Error getting key "${key}":`, error);
      // Try fallback
      const value = this.localCache.get(key);
      if (value) {
        return { key, value, shared };
      }
      return null;
    }
  }

  /**
   * Set data in storage
   */
  async set(key, value, shared = false) {
    try {
      if (this.checkStorage()) {
        const result = await window.storage.set(key, value, shared);
        // Also cache locally
        this.localCache.set(key, value);
        return result;
      } else {
        // Fallback to local cache
        this.localCache.set(key, value);
        // Also save to localStorage for persistence
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.warn('localStorage not available');
        }
        return { key, value, shared };
      }
    } catch (error) {
      console.error(`Error setting key "${key}":`, error);
      // Try fallback
      this.localCache.set(key, value);
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage not available');
      }
      return { key, value, shared };
    }
  }

  /**
   * Delete data from storage
   */
  async delete(key, shared = false) {
    try {
      if (this.checkStorage()) {
        const result = await window.storage.delete(key, shared);
        this.localCache.delete(key);
        return result;
      } else {
        // Fallback to local cache
        this.localCache.delete(key);
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('localStorage not available');
        }
        return { key, deleted: true, shared };
      }
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
      this.localCache.delete(key);
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage not available');
      }
      return { key, deleted: true, shared };
    }
  }

  /**
   * List keys with optional prefix
   */
  async list(prefix = '', shared = false) {
    try {
      if (this.checkStorage()) {
        const result = await window.storage.list(prefix, shared);
        return result;
      } else {
        // Fallback to local cache
        const keys = Array.from(this.localCache.keys()).filter(key =>
          key.startsWith(prefix)
        );
        
        // Also check localStorage
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix) && !keys.includes(key)) {
              keys.push(key);
            }
          }
        } catch (e) {
          console.warn('localStorage not available');
        }
        
        return { keys, prefix, shared };
      }
    } catch (error) {
      console.error(`Error listing keys with prefix "${prefix}":`, error);
      // Fallback
      const keys = Array.from(this.localCache.keys()).filter(key =>
        key.startsWith(prefix)
      );
      return { keys, prefix, shared };
    }
  }

  /**
   * Get multiple items by keys
   */
  async getMultiple(keys, shared = false) {
    try {
      const results = await Promise.all(
        keys.map(key => this.get(key, shared))
      );
      return results.filter(Boolean);
    } catch (error) {
      console.error('Error getting multiple keys:', error);
      return [];
    }
  }

  /**
   * Get all items with a prefix and parse as JSON
   */
  async getAllWithPrefix(prefix, shared = false) {
    try {
      const listResult = await this.list(prefix, shared);
      if (!listResult || !listResult.keys || listResult.keys.length === 0) {
        return [];
      }

      const results = await Promise.all(
        listResult.keys.map(async (key) => {
          const result = await this.get(key, shared);
          if (result && result.value) {
            try {
              return JSON.parse(result.value);
            } catch {
              return null;
            }
          }
          return null;
        })
      );

      return results.filter(Boolean);
    } catch (error) {
      console.error(`Error getting all with prefix "${prefix}":`, error);
      return [];
    }
  }

  /**
   * Initialize storage from localStorage (for development)
   */
  initializeFromLocalStorage() {
    if (typeof localStorage === 'undefined') return;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            this.localCache.set(key, value);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing from localStorage:', error);
    }
  }

  /**
   * Clear all storage (for testing)
   */
  async clearAll() {
    this.localCache.clear();
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('localStorage not available');
    }
  }
}

// Initialize storage service
const storageService = new StorageService();

// Initialize from localStorage on load
if (typeof window !== 'undefined') {
  storageService.initializeFromLocalStorage();
}

export default storageService;