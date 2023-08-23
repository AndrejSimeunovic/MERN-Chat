import "./index.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProvider from "./context/userContext";

function Root() {
  return (
    <div>
      <UserProvider>
        <ToastContainer autoClose={2000} />
        <Outlet />
      </UserProvider>
    </div>
  );
}

export default Root;
