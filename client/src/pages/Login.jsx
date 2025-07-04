import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Signup = () => {
  let [formData, setFormData] = useState({

    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", formData);

      if (response.status === 200) {
        setFormData({

          email: "",
          password: "",
        });
        toast.success("login successfully");
      }
    } catch (error) {
      toast.error("please signup again");
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="w-110 bg-white h-85 shadow-lg rounded-xl flex flex-col gap-3 p-3">
        <div className="text-3xl w-full flex justify-center items-center h-14  font-semibold ">
          Sign In
        </div>
        <div>
          <form
            className="flex flex-col justify-center items-center p-4 gap-3 "
            onSubmit={handleSubmit}
          >
            <input
              placeholder="Email.."
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 bg-gray-50 rounded-sm outline-none text-lg w-full"
            />
            <input
              placeholder="password.."
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 bg-gray-50 rounded-sm outline-none text-lg w-full"
            />
            <button className="w-full bg-green-600 h-[40px] text-white text-xl font-semibold">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
