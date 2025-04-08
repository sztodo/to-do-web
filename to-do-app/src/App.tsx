import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import TaskDetail from "./components/TaskDetails";
import Calendar from "./components/Calendar";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><Calendar /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;