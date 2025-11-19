import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ChatService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/chat`,
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Get chat messages for a class
  async getChatMessages(classId, page = 1, limit = 50) {
    try {
      const response = await this.api.get(`/${classId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await this.api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Edit a message
  async editMessage(messageId, newMessage) {
    try {
      const response = await this.api.put(`/messages/${messageId}`, {
        message: newMessage
      });
      return response.data;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Get chat statistics
  async getChatStats(classId) {
    try {
      const response = await this.api.get(`/${classId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  }
}

const chatService = new ChatService();
export default chatService;