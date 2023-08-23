import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import User from "../components/User";
import Chat from "../components/Chat";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function Home() {
  const { setUsername, username } = useUserContext();
  const [chatWithUser, setChatWithUser] = useState("");
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const checkCookie = async () => {
      try {
        // const response = await axios.get("http://localhost:5000/profile", {
        //  withCredentials: true,
        // });
        //setUsername(response.data.user.username);
        setUsername(username);
      } catch (error) {
        navigate("/login");
      }
    };
    if (username == null) navigate("/login");
    checkCookie();
  }, []);

  useEffect(() => {
    const getAllusers = async () => {
      try {
        const response = await axios.get("https://mern-chat-wheat.vercel.app/users", {
          withCredentials: true,
        });

        const userArray = response.data;
        const filterList = userArray.filter(
          (user) => user.username !== username
        );
        setUserList(filterList);
      } catch (error) {}
    };

    getAllusers();
  }, [username]);

  useEffect(() => {
    if (username) {
      const newSocket = io("https://mern-chat-wheat.vercel.app");
      setSocket(newSocket);
      newSocket.emit("add-user", username);
    }
  }, [chatWithUser]);

  useEffect(() => {
    if (socket) {
      socket.on("online-users", (usersOnline) => {
        setUserList((users) =>
          users.map((user) =>
            usersOnline.includes(user.username)
              ? { ...user, online: true }
              : { ...user, online: false }
          )
        );
      });
    }
  }, [socket]);

  async function logout() {
    try {
      if (socket) socket.disconnect();
      await axios.get("https://mern-chat-wheat.vercel.app/logout", {
        withCredentials: true,
      });
      toast.success("Logged out!");
      setUsername(null);
    } catch (error) {}
  }

  return (
    <div className="flex border border-slate-500 max-md:w-full ">
      <div className="flex flex-col w-60  gap-3 max-md:w-fit">
        <div className="text-center w-full p-3 max-md:text-end max-md:text-sm">
          MERN-Chat
        </div>
        <div className="border overflow-y-scroll h-[30rem] max-h-[30rem] max-md:w-fit">
          {userList.map((user, index) => {
            return (
              <div
                key={index}
                className="border bg-slate-300 py-5 pl-2 mb-3 hover:border-l-blue-400 hover: border-l-4 hover:cursor-pointer"
              >
                <User
                  username={user.username}
                  online={user.online}
                  setChatWithUser={setChatWithUser}
                />
              </div>
            );
          })}
        </div>
        <Link
          onClick={logout}
          className="border-none text-center text-indigo-500 hover:text-indigo-400 max-md:text-center max-md:text-sm max-md:pl-3"
          to={"/login"}
        >
          Logout: {username}
        </Link>
      </div>
      <Chat
        socket={socket}
        chatWithUser={chatWithUser}
        setChatWithUser={setChatWithUser}
        userList={userList}
      />
    </div>
  );
}
