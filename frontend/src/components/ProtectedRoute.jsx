import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.role || user.role !== role) {
      navigate("/", { replace: true });
    }
  }, [user, role, navigate]);

  if (!user?.role || user.role !== role) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
