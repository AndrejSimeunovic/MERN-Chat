import React from "react";
import Avatar from "./Avatar";

export default function User({ username, setChatWithUser, online }) {
  function changeChatRoom() {
    setChatWithUser(username);
  }

  return (
    <div
      onClick={changeChatRoom}
      className="flex gap-2 items-center max-md:gap-0"
    >
      <Avatar username={username} online={online} />
      {username}
    </div>
  );
}
