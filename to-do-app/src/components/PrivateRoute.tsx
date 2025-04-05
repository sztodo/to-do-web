import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { currentUser, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    
    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    
    return <>{children}</>;
};

export default PrivateRoute;
