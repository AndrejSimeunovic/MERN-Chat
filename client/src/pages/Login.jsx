import axios from "axios";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../context/userContext";

export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { setUsername } = useUserContext();

  async function loginUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://mern-chat-wheat.vercel.app/login",
        {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        },
        { withCredentials: true }
      );
      setUsername(usernameRef.current.value);
      navigate("/");
      toast.success("Login successfull!");
    } catch (error) {
      toast.error(error.response.data);
    }
  }
  return (
    <div className="flex flex-col gap-2 justify-center items-center border-solid border shadow">
      <form onSubmit={loginUser} className="flex flex-col gap-3 p-20">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold "
        >
          Username
        </label>
        <input
          ref={usernameRef}
          id="username"
          type="text"
          placeholder="Username"
          className="shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline "
        />
        <label htmlFor="pwd" className="block text-gray-700 text-sm font-bold">
          Password
        </label>
        <input
          ref={passwordRef}
          id="pwd"
          type="password"
          placeholder="********"
          className="shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline "
        />
        <button
          type="submit"
          className="border-none rounded bg-blue-600 text-white my-5 py-1 hover:bg-stone-500"
        >
          Login
        </button>
        <Link
          className="text-indigo-500 underline text-center hover:text-indigo-400"
          to={"/register"}
        >
          Create an account
        </Link>
      </form>
    </div>
  );
}
