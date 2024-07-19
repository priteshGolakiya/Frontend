import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preloader from "./component/Preloader";

const AdminRoute = () => {
  const { user, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("Please log in to access this page.");
      } else if (user.role !== "admin") {
        toast.error("You do not have permission to access this page.");
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div>
        <Preloader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
