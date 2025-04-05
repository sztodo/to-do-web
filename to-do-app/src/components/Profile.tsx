import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

interface ProfileFormData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  
  const Profile: React.FC = () => {
    const { currentUser, updateProfile, error } = useContext(AuthContext);
    const [formData, setFormData] = useState<ProfileFormData>({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || ''
    });
    const [formError, setFormError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
  
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
      setSuccessMessage('');
      
      // Validate form
      if (!formData.username.trim() || !formData.email.trim() || !formData.firstName.trim() || !formData.lastName.trim()) {
        setFormError('All fields are required');
        return;
      }
      
      const { success, error } = await updateProfile(formData);
      
      if (success) {
        setSuccessMessage('Profile updated successfully');
      } else if (error) {
        setFormError(error);
      }
    };
  
    if (!currentUser) {
      return <div className="loading">Loading profile...</div>;
    }
  
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        
        {formError && <div className="error-message">{formError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form className="profile-form" onSubmit={handleSubmit}>
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
          
          <button type="submit" className="btn-primary">Update Profile</button>
        </form>
        
        <div className="profile-info">
          <h3>Account Information</h3>
          <p><strong>Account Created:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          <p><strong>Last Updated:</strong> {new Date(currentUser.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    );
  };
  
  export default Profile;