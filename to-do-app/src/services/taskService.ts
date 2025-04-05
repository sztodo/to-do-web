import { FilterOptions, Task, Comment } from '../types/interfaces';
import api from './api';

interface TaskResponse {
  data: Task;
}

interface TasksResponse {
  data: Task[];
}

interface CommentsResponse {
  data: Comment[];
}

const taskService = {
  getAllTasks: async (filters: FilterOptions = {}): Promise<TasksResponse> => {
    let queryString = '';
    if (Object.keys(filters).length > 0) {
      queryString = '?' + new URLSearchParams(filters as Record<string, string>).toString();
    }
    return api.get<Task[]>(`/api/tasks${queryString}`);
  },

  getTask: async (id: string): Promise<TaskResponse> => {
    return api.get<Task>(`/api/tasks/${id}`);
  },

  createTask: async (taskData: Partial<Task>): Promise<TaskResponse> => {
    return api.post<Task>('/api/tasks', taskData);
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<TaskResponse> => {
    return api.put<Task>(`/api/tasks/${id}`, taskData);
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },

  completeTask: async (id: string): Promise<TaskResponse> => {
    return api.patch<Task>(`/api/tasks/${id}/complete`);
  },

  reopenTask: async (id: string): Promise<TaskResponse> => {
    return api.patch<Task>(`/api/tasks/${id}/reopen`);
  },

  extendDeadline: async (id: string, newDueDate: string): Promise<TaskResponse> => {
    return api.patch<Task>(`/api/tasks/${id}/extend-deadline`, { newDueDate });
  },

  addTags: async (id: string, tags: string[]): Promise<TaskResponse> => {
    return api.post<Task>(`/api/tasks/${id}/tags`, { tags });
  },

  removeTag: async (id: string, tagName: string): Promise<TaskResponse> => {
    return api.delete<Task>(`/api/tasks/${id}/tags/${tagName}`);
  },

  getComments: async (id: string): Promise<CommentsResponse> => {
    return api.get<Comment[]>(`/api/tasks/${id}/comments`);
  },

  addComment: async (id: string, content: string): Promise<void> => {
    await api.post(`/api/tasks/${id}/comments`, { content });
  }
};

export default taskService;