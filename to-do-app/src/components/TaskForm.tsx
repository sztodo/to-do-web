import { useState } from "react";
import { Task, TaskFormData } from "../types/interfaces";

interface TaskFormProps {
    onSubmit: (formData: TaskFormData) => void;
    initialData?: Partial<Task> | null;
    buttonText?: string;
  }
  
  interface FormErrors {
    title?: string;
  }
  
  const TaskForm: React.FC<TaskFormProps> = ({ 
    onSubmit, 
    initialData = null, 
    buttonText = 'Save' 
  }) => {
    const [formData, setFormData] = useState({
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      tags: initialData?.tags?.join(', ') || ''
    });
  
    const [errors, setErrors] = useState<FormErrors>({});
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const validate = (): { isValid: boolean; errors: FormErrors } => {
      const newErrors: FormErrors = {};
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      
      return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
      };
    };
  
    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      
      const { isValid, errors } = validate();
      if (!isValid) {
        setErrors(errors);
        return;
      }
      
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : [];
      
      onSubmit({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
        tags: tagsArray
      });
    };
  
    return (
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. work, important, urgent"
          />
        </div>
        
        <button type="submit" className="btn-primary">{buttonText}</button>
      </form>
    );
  };
  
  export default TaskForm;
  