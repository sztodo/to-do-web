import { describe, it, expect, vi, beforeEach } from 'vitest';
import taskService from './taskService';
import type { Task } from '../types/interfaces';

// Mock api
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe('taskService', () => {
  let api: any;
  
  beforeEach(async () => {
    api = (await import('./api')).default;
    vi.resetAllMocks();
  });
  
  it('getAllTasks fetches tasks with no filters', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        isCompleted: false,
        tags: ['test'],
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    api.get.mockResolvedValueOnce({ data: mockTasks });
    
    const result = await taskService.getAllTasks();
    
    expect(api.get).toHaveBeenCalledWith('/api/tasks');
    expect(result.data).toEqual(mockTasks);
  });
  
  it('getAllTasks applies filters correctly', async () => {
    const filters = {
      status: 'active',
      tag: 'important',
      sortBy: 'dueDate',
      order: 'desc'
    };
    
    api.get.mockResolvedValueOnce({ data: [] });
    
    await taskService.getAllTasks(filters);
    
    expect(api.get).toHaveBeenCalledWith('/api/tasks?status=active&tag=important&sortBy=dueDate&order=desc');
  });
  
  it('createTask sends correct data', async () => {
    const taskData = {
      title: 'New Task',
      description: 'Test Description',
      dueDate: new Date(),
      tags: ['test']
    };
    
    const mockResponse = { 
      data: { ...taskData, id: '1', isCompleted: false } 
    };
    
    api.post.mockResolvedValueOnce(mockResponse);
    
    const result = await taskService.createTask(taskData);
    
    expect(api.post).toHaveBeenCalledWith('/api/tasks', taskData);
    expect(result).toEqual(mockResponse);
  });
});