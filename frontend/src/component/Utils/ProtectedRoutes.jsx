/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Loader/Loader";

export function RequireAuth({ children }) {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  if (loading) return <Loader />;

  if (isAuthenticated !== undefined) {
    if (isAuthenticated === false) {
      return <Navigate to="/login" />;
    } else if (isAuthenticated === true) {
      return children;
    }
  }
}

export function RequireAuthAdmin({ children }) {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  if (isAuthenticated !== undefined) {
    if (isAuthenticated === false) {
      return <Navigate to="/login" />;
    } else if (isAuthenticated === true && user?.role === "admin") {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  }
}
