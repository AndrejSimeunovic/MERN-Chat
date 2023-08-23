import React from "react";

export default function Avatar({ username, online }) {
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <>
      <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-orange-300">
        {firstLetter}
      </div>
      {online ? (
        <div className="border rounded-full bg-green-500 h-3 w-3 relative top-3 right-5"></div>
      ) : (
        <div className="border rounded-full bg-gray-500 h-3 w-3 relative top-3 right-5"></div>
      )}
    </>
  );
}
