import { useEffect, useState } from "react";
import taskService from "../services/taskService";
import { Task, FilterOptions, TaskFormData } from "../types/interfaces";
import FilterBar from "./FitlterBar";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

import "../App.css";

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [filters, setFilters] = useState<FilterOptions>({});
  
    const fetchTasks = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await taskService.getAllTasks(filters);
        setTasks(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchTasks();
    }, [filters]);
  
    const handleAddTask = async (taskData: TaskFormData): Promise<void> => {
      try {
        await taskService.createTask(taskData);
        fetchTasks();
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to add task');
      }
    };
  
    const handleCompleteTask = async (taskId: string): Promise<void> => {
      try {
        await taskService.completeTask(taskId);
        fetchTasks();
      } catch (err) {
        setError('Failed to update task');
      }
    };
  
    const handleReopenTask = async (taskId: string): Promise<void> => {
      try {
        await taskService.reopenTask(taskId);
        fetchTasks();
      } catch (err) {
        setError('Failed to update task');
      }
    };
  
    const handleDeleteTask = async (taskId: string): Promise<void> => {
      if (window.confirm('Are you sure you want to delete this task?')) {
        try {
          await taskService.deleteTask(taskId);
          fetchTasks();
        } catch (err) {
          setError('Failed to delete task');
        }
      }
    };
  
    const handleFilterChange = (newFilters: FilterOptions): void => {
      // Remove empty filters
      const filteredObject = Object.fromEntries(
        Object.entries(newFilters).filter(([_, value]) => value !== '')
      );
      setFilters(filteredObject);
    };
  
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>My Tasks</h1>
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Task'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {showAddForm && (
          <div className="add-task-section">
            <h2>Add New Task</h2>
            <TaskForm 
              onSubmit={handleAddTask}
              buttonText="Create Task"
            />
          </div>
        )}
        
        <div className="filter-section">
          <h3>Filter Tasks</h3>
          <FilterBar onFilterChange={handleFilterChange} />
        </div>
        
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onComplete={handleCompleteTask}
            onReopen={handleReopenTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    );
  };
  
  export default Dashboard;