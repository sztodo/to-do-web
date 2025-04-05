import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = (): void => {
      logout();
      navigate('/login');
    };
  
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Task Manager</Link>
        </div>
        
        {currentUser ? (
          <div className="navbar-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </nav>
    );
  };
  
  export default Navbar;