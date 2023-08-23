import React, { useEffect, useState } from "react";
import User from "./User";
import ChatInput from "./ChatInput";
import { useUserContext } from "../context/userContext";

export default function Chat({
  socket,
  chatWithUser,
  setChatWithUser,
  userList,
}) {
  const { username } = useUserContext();

  const obj = userList.find((u) => u.username === chatWithUser);

  const [message, setMessage] = useState([]);

  function sendMsg(content) {
    socket.emit("send-msg", {
      content,
      sender: username,
      recipient: chatWithUser,
    });
    const msg = { fromSelf: true, content };
    setMessage((prev) => [...prev, msg]);
  }

  useEffect(() => {
    if (socket) {
      socket.on("receive-msg", ({ content, sender, recipient }) => {
        if (chatWithUser === sender) {
          const msg = { fromSelf: false, content };
          setMessage((prev) => [...prev, msg]);
        }
      });
    }
  }, [socket, chatWithUser]);

  useEffect(() => {
    setMessage([]);
  }, [chatWithUser]);

  return (
    <>
      {chatWithUser ? (
        <>
          <div className="bg-slate-200 w-[32rem] flex flex-col justify-between max-md:w-fit">
            {" "}
            <div className="flex justify-between p-4 items-center">
              <User
                username={chatWithUser}
                setChatWithUser={setChatWithUser}
                online={obj.online}
              />
              <div
                onClick={() => setChatWithUser(null)}
                className="h-10 w-10 inline-flex justify-center items-center rounded-lg bg-green-300 p-3 cursor-pointer hover:bg-green-400"
              >
                X
              </div>
            </div>
            <div className="border h-[30rem]  max-h-[30rem] overflow-y-scroll flex flex-col">
              {message.map((m, index) => {
                return (
                  <div
                    key={index}
                    className={`mb-4 border w-max-sm w-fit h-auto rounded-lg p-2 ${
                      m.fromSelf
                        ? "bg-blue-400 self-end mr-4"
                        : "bg-gray-400 ml-4"
                    } `}
                  >
                    {m.content}
                  </div>
                );
              })}
            </div>
            <ChatInput socket={socket} sendMsg={sendMsg} />
          </div>
        </>
      ) : (
        <div className="bg-slate-200 w-[32rem] flex flex-col justify-center items-center max-md:w-fit">
          Hello! Choose someone to chat with!
        </div>
      )}
    </>
  );
}
