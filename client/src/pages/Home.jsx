import React, { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chatUser,setChatUser]=useState("")

  const getUsers = () => {
    fetch("http://localhost:3000/get-users", {
      method: "GET",
      credentials: "include", // if cookies are needed
    })
      .then((response) => response.json())
      .then((data) => {setUsers(data.data) ; console.log(data.data)})
      .catch((error) => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="w-full min-h-screen p-10 flex  gap-5">
      <div className="lg:w-[30%] w-full min-h-full ">
        <ul className="flex flex-col justify-center gap-3">
          {users?.map((user, index) => (
            <li
              key={index}
              className="p-3 bg-slate-100  text-xl rounded-lg pl-15"
              onClick={()=>setChatUser(user)}
            >
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      </div>

      {/* chatbox */}
      <div className="lg:w-[70%] w-full min-h-screen bg-slate-100 rounded-xl">
        <div className="w-full h-15 font-semibold flex p-5 items-center text-3xl">{chatUser.firstName } {chatUser.lastName}</div>
      </div>
    </div>
  );
};

export default Home;
