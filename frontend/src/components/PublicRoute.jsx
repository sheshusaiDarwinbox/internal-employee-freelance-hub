import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (location.pathname.includes("reset-password")) {
    return children;
  }
  console.log("hello world");
  if (!user || !user.role) return children;
  if (user.role === "Employee") {
    return <Navigate to="/user" />;
  } else if (user.role === "Admin") {
    return <Navigate to="/admin" />;
  } else if (user.role === "Manager") {
    return <Navigate to="/manager" />;
  } else if (user.role === "Other") {
    return <Navigate to="external" />;
  }
};

export default PublicRoute;
