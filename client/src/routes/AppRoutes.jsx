import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Home from "../pages/Home";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";


const AppRoutes = () => {
  const { userData, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        loading.....
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/signup",
      element: userData ? <Navigate to="/" /> : <Signup />,
    },
    {
      path: "/login",
      element: userData ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/",
      element: userData ? <Home /> : <Navigate to="/login" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
