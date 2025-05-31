import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import TaskList from './TaskList';
import type { Task } from '../types/interfaces';

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test Description 1',
    dueDate: new Date('2023-12-31'),
    isCompleted: false,
    tags: ['test', 'important'],
    userId: 'user1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Test Description 2',
    dueDate: null,
    isCompleted: true,
    tags: ['completed'],
    userId: 'user1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

describe('TaskList Component', () => {
  const mockOnComplete = vi.fn();
  const mockOnReopen = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders tasks correctly', () => {
    render(
      <BrowserRouter>
        <TaskList 
          tasks={mockTasks}
          onComplete={mockOnComplete}
          onReopen={mockOnReopen}
          onDelete={mockOnDelete}
        />
      </BrowserRouter>
    );

    // Check if task titles are rendered
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    
    // Check if descriptions are rendered
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    
    // Check if tags are rendered
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('important')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('calls onComplete when Complete button is clicked', async () => {
    render(
      <BrowserRouter>
        <TaskList 
          tasks={[mockTasks[0]]}
          onComplete={mockOnComplete}
          onReopen={mockOnReopen}
          onDelete={mockOnDelete}
        />
      </BrowserRouter>
    );
    
    const user = userEvent.setup();
    const completeButton = screen.getByText('Complete');
    await user.click(completeButton);
    
    expect(mockOnComplete).toHaveBeenCalledWith('1');
  });

  it('calls onReopen when Reopen button is clicked', async () => {
    render(
      <BrowserRouter>
        <TaskList 
          tasks={[mockTasks[1]]}
          onComplete={mockOnComplete}
          onReopen={mockOnReopen}
          onDelete={mockOnDelete}
        />
      </BrowserRouter>
    );
    
    const user = userEvent.setup();
    const reopenButton = screen.getByText('Reopen');
    await user.click(reopenButton);
    
    expect(mockOnReopen).toHaveBeenCalledWith('2');
  });

  it('displays no tasks message when tasks array is empty', () => {
    render(
      <BrowserRouter>
        <TaskList 
          tasks={[]}
          onComplete={mockOnComplete}
          onReopen={mockOnReopen}
          onDelete={mockOnDelete}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('No tasks found.')).toBeInTheDocument();
  });
});