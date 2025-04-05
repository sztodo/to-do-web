import { Link } from "react-router-dom";
import { Task } from "../types/interfaces";
import "./TaskList.css";

interface TaskListProps {
    tasks: Task[];
    onComplete: (id: string) => void;
    onReopen: (id: string) => void;
    onDelete: (id: string) => void;
  }
  
  const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete, onReopen, onDelete }) => {
    const formatDate = (dateString: string | null): string => {
      if (!dateString) return 'No deadline';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };
    
    const isPastDue = (dateString: string | null): boolean => {
      if (!dateString) return false;
      const dueDate = new Date(dateString);
      const today = new Date();
      return dueDate < today;
    };
  
    if (tasks.length === 0) {
      return <div className="no-tasks">No tasks found.</div>;
    }
  
    return (
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <div className="task-header">
              <h3>
                <Link to={`/tasks/${task.id}`}>{task.title}</Link>
              </h3>
              <div className="task-actions">
                {task.isCompleted ? (
                  <button onClick={() => onReopen(task.id)} className="btn-text">Reopen</button>
                ) : (
                  <button onClick={() => onComplete(task.id)} className="btn-text">Complete</button>
                )}
                <button onClick={() => onDelete(task.id)} className="btn-text delete">Delete</button>
              </div>
            </div>
            
            <div className="task-details">
              <p>{task.description}</p>
              
              <div className="task-meta">
                <span className={`due-date ${isPastDue(task.dueDate) && !task.isCompleted ? 'past-due' : ''}`}>
                  Due: {formatDate(task.dueDate)}
                </span>
                
                {task.tags && task.tags.length > 0 && (
                  <div className="tags">
                    {task.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default TaskList;