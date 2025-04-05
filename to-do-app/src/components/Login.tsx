import { useContext, useEffect, useState } from "react";
import { LoginCredentials } from "../types/interfaces";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginCredentials>({
      username: '',
      password: ''
    });
    const [formError, setFormError] = useState<string>('');
    
    const { login, currentUser, error, clearError } = useContext(AuthContext);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (currentUser) {
        navigate('/dashboard');
      }
      
      if (error) {
        setFormError(error);
        clearError();
      }
    }, [currentUser, navigate, error, clearError]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      setFormError('');
      
      if (!formData.username.trim() || !formData.password) {
        setFormError('All fields are required');
        return;
      }
      
      const { success, error } = await login(formData);
      if (success) {
        navigate('/dashboard');
      } else if (error) {
        setFormError(error);
      }
    };
  
    return (
      <div className="auth-container">
        <h2>Login</h2>
        
        {formError && <div className="error-message">{formError}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="btn-primary">Login</button>
        </form>
        
        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    );
  };
  
  export default Login;