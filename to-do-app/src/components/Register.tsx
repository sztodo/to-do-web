import { useContext, useEffect, useState } from "react";
import { RegisterData } from "../types/interfaces";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [formError, setFormError] = useState<string>('');
  
  const { register, currentUser, error, clearError } = useContext(AuthContext);
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
    
    // Validate form
    if (!formData.username.trim() || !formData.email.trim() || !formData.password || !formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    const { username, email, password, firstName, lastName } = formData;
    const { success, error } = await register({
      username,
      email,
      password,
      firstName,
      lastName
    });
    
    if (success) {
      navigate('/login');
    } else if (error) {
      setFormError(error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      
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
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
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
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" className="btn-primary">Register</button>
      </form>
      
      <p className="auth-redirect">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;