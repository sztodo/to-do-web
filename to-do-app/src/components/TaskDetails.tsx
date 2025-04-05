import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import taskService from "../services/taskService";
import { Task, TaskFormData, Comment } from "../types/interfaces";
import CommentList from "./CommentList";
import TaskForm from "./TaskForm";
import "./TaskDetails.css";

interface RouteParams {
  id: string;
  [key: string]: string | undefined;
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');

  const fetchTaskAndComments = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      
      const taskResponse = await taskService.getTask(id);
      setTask(taskResponse.data);
      
      const commentsResponse = await taskService.getComments(id);
      setComments(commentsResponse.data);
      
      setError('');
    } catch (err) {
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskAndComments();
  }, [id]);

  const handleUpdateTask = async (taskData: TaskFormData): Promise<void> => {
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      await taskService.updateTask(id, taskData);
      setIsEditing(false);
      fetchTaskAndComments();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleCompleteTask = async (): Promise<void> => {
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      await taskService.completeTask(id);
      fetchTaskAndComments();
    } catch (err) {
      setError('Failed to complete task');
    }
  };

  const handleReopenTask = async (): Promise<void> => {
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      await taskService.reopenTask(id);
      fetchTaskAndComments();
    } catch (err) {
      setError('Failed to reopen task');
    }
  };

  const handleDeleteTask = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (!id) {
          setError('Task ID is missing');
          return;
        }
        await taskService.deleteTask(id);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }
    
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      await taskService.addComment(id, commentText);
      setCommentText('');
      fetchTaskAndComments();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleExtendDeadline = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!newDueDate) {
      return;
    }
    
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      await taskService.extendDeadline(id, newDueDate);
      setNewDueDate('');
      fetchTaskAndComments();
    } catch (err) {
      setError('Failed to extend deadline');
    }
  };

  const handleAddTag = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!newTag.trim()) {
      return;
    }
    
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      await taskService.addTags(id, [newTag]);
      setNewTag('');
      fetchTaskAndComments();
    } catch (err) {
      setError('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tagName: string): Promise<void> => {
    try {
      if (!id) {
        setError('Task ID is missing');
        return;
      }
      await taskService.removeTag(id, tagName);
      fetchTaskAndComments();
    } catch (err) {
      setError('Failed to remove tag');
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  if (!task) {
    return <div className="error-message">Task not found</div>;
  }

  return (
    <div className="task-detail">
      {error && <div className="error-message">{error}</div>}
      
      {isEditing ? (
        <div className="edit-task-section">
          <h2>Edit Task</h2>
          <TaskForm 
            onSubmit={handleUpdateTask}
            initialData={task}
            buttonText="Update Task"
          />
          <button 
            className="btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="task-info">
          <div className="task-header">
            <h1>{task.title}</h1>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)} className="btn-secondary">Edit</button>
              {task.isCompleted ? (
                <button onClick={handleReopenTask} className="btn-secondary">Reopen</button>
              ) : (
                <button onClick={handleCompleteTask} className="btn-primary">Complete</button>
              )}
              <button onClick={handleDeleteTask} className="btn-danger">Delete</button>
            </div>
          </div>
          
          <div className="task-status">
            Status: <span className={task.isCompleted ? 'completed' : 'active'}>
              {task.isCompleted ? 'Completed' : 'Active'}
            </span>
          </div>
          
          <div className="task-dates">
            <p><strong>Due Date:</strong> {formatDate(task.dueDate)}</p>
            <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div className="task-description">
            <h3>Description</h3>
            <p>{task.description || 'No description provided.'}</p>
          </div>
          
          <div className="task-tags">
            <h3>Tags</h3>
            {task.tags && task.tags.length > 0 ? (
              <div className="tags">
                {task.tags.map(tag => (
                  <div key={tag} className="tag-with-action">
                    <span className="tag">{tag}</span>
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tags</p>
            )}
            
            <form onSubmit={handleAddTag} className="add-tag-form">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a new tag"
              />
              <button type="submit" className="btn-small">Add</button>
            </form>
          </div>
          
          {!task.isCompleted && (
            <div className="extend-deadline">
              <h3>Extend Deadline</h3>
              <form onSubmit={handleExtendDeadline} className="extend-deadline-form">
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <button type="submit" className="btn-small">Update Deadline</button>
              </form>
            </div>
          )}
        </div>
      )}
      
      <div className="comments-section">
        <h3>Comments</h3>
        <CommentList comments={comments} />
        
        <form onSubmit={handleAddComment} className="add-comment-form">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <button type="submit" className="btn-primary">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetail;