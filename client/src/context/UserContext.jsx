import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages,setMessages]=useState([]);
  const [socket,setSocket]=useState(null);
  const [onlineUsers,setOnlineUsers]=useState(null);



  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/current-user");
      setUserData(response.data.data);
    } catch (error) {
      console.log(error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (receiverId) => {
    try {
      const response = await axios.get("/get-messages/" + receiverId);
      setMessages(response.data);
    } catch (error) {
      console.log(error);
      setMessages(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading,fetchMessages ,messages ,setSocket,setOnlineUsers ,socket,onlineUsers,setMessages}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
