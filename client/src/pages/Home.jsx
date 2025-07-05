import React, { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { SenderMessage } from "../components/SenderMessage";
import { ReceiverMessage } from "../components/receiverMessage";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import io from "socket.io-client";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontEndImage, setFrontEndImage] = useState(null);
  const [backEndImage, setBackEndImage] = useState(null);
  const image = useRef();
  const {
    fetchMessages,
    messages,
    setMessages,
    userData,
    setSocket,
    setOnlineUsers,
    onlineUsers,
    socket,
  } = useContext(UserContext);

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackEndImage(file);
    setFrontEndImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !backEndImage) return;
    try {
      let formData = new FormData();
      if (input.trim()) {
        formData.append("message", input);
      }
      if (backEndImage) {
        formData.append("image", backEndImage);
      }
      await axios.post("/send/" + chatUser._id, formData);
      setInput("");
      setFrontEndImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = () => {
    fetch(`http://localhost:3000/get-users/${userData._id}`, {
      method: "GET",
      credentials: "include", // if cookies are needed
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        console.log(data.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (userData) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: userData?._id,
        },
      });
      setSocket(socketio);
      socketio.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage",(msg)=>{
      setMessages((prev) => [...prev, msg]);

    })
    return ()=>socket.off("newMessage") 
  }, [messages,setMessages]);

  return (
    <div className="w-full min-h-screen  ">
      <nav className="w-full h-[50px] flex justify-end items-center p-8  text-2xl  font-semibold bg-slate-100 ">
        {userData.firstName} {userData.lastName}
      </nav>

      <main className="flex gap-6 p-10 ">
        <div className="lg:w-[30%] w-full min-h-full ">
          <ul className="flex flex-col justify-center gap-3">
            {users?.map((user, index) => (
              <li
                key={index}
                className="p-3 bg-slate-100  text-xl rounded-lg pl-15 relative"
                onClick={async () => {
                  setChatUser(user);
                  await fetchMessages(user._id);
                }}
              >
                {onlineUsers?.includes(user._id) && (
                  <span className="text-green-500 ml-2 absolute right-2 top-0">●</span>
                )}
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
        </div>

        {chatUser ? (
          <>
            {/* chatbox */}
            <div className="lg:w-[70%] w-full min-h-screen bg-slate-100 rounded-xl px-6">
              <div className="w-full h-15 font-semibold flex p-5 items-center text-3xl">
                {chatUser.firstName} {chatUser.lastName}
              </div>

              {/* chats  */}
              <div className="w-full h-[550px] flex flex-col p-6 gap-3 overflow-auto">
                {showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
                {messages?.map((msg) =>
                  msg.sender === userData._id ? (
                    <SenderMessage image={msg.image} message={msg.message} />
                  ) : (
                    <ReceiverMessage image={msg.image} message={msg.message} />
                  )
                )}
              </div>

              {/* for showing selected image */}
              {frontEndImage && (
                <img
                  src={frontEndImage}
                  alt=""
                  className="absolute size-40 rounded-lg right-56 bottom-25"
                />
              )}

              {/* message send input area */}
              <div className="w-full lg:w-[70%] h-[100px] fixed bottom-5 flex items-center justify-center">
                <form
                  className="w-[95%] max-w-[60%] h-[60px] bg-[#1797c2] rounded-full flex items-center gap-3"
                  onSubmit={handleSendMessage}
                >
                  <button
                    className="p-2 bg-slate-100 rounded-full ml-2"
                    type="button"
                    onClick={() => setShowPicker((prev) => !prev)}
                  >
                    emoji
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={image}
                    hidden
                    onChange={handleImage}
                  />

                  <input
                    type="text"
                    placeholder="Message"
                    className="w-full h-full outline-none border-0 text-5 px-10 text-white"
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                  />

                  <button
                    className="p-2 bg-slate-100 rounded-full ml-2"
                    onClick={() => image.current.click()}
                    type="button"
                  >
                    image
                  </button>

                  <button
                    className="p-2 bg-slate-100 rounded-full mr-2"
                    type="submit"
                  >
                    send
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-[100vh-60px] text-4xl text-blue-400 font">
            Welcome to chat app
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
