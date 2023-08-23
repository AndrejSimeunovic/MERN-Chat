import { createContext, useContext, useState } from "react";

const userContext = createContext({});

export default function UserProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [chatWithUser, setChatWithUser] = useState(null);

  return (
    <userContext.Provider
      value={{ username, setUsername, chatWithUser, setChatWithUser }}
    >
      {children}
    </userContext.Provider>
  );
}
export function useUserContext() {
  return useContext(userContext);
}
