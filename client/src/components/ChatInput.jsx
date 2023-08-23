import React, { useRef } from "react";

export default function ChatInput({ sendMsg }) {
  const messageRef = useRef();

  function sendChat(e) {
    e.preventDefault();
    if (messageRef.current.value) {
      sendMsg(messageRef.current.value);
    }

    messageRef.current.value = "";
  }

  return (
    <div className=" border bg-slate-300 p-2 max-md:pr-1">
      <form
        onSubmit={sendChat}
        className="flex justify-center items-center max-md:pr-1"
      >
        <input
          ref={messageRef}
          type="text"
          placeholder="type message..."
          className="border outline-none rounded-full w-60 pl-2 max-md:w-fit"
        />
        <button
          type="submit"
          className="border rounded-full px-3 bg-blue-500 text-white hover:bg-blue-400 max-md:p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 max-md:w-fit"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
