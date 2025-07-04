import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/current-user");
      setUserData(response.data.data);
    } catch (error) {
      console.log(error);
      setUserData(null)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
