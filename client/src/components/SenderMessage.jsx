import React from "react";

export const SenderMessage = ({ image, message }) => {
  
  return (
    <div
      className=" w-fit max-w-[500px]  px-5 py-2 text-white text-5 bg-[#1797c2] rounded-tr-none
     rounded-2xl relative right-0 ml-auto shadow-lg "
    >
      {" "}
      {image && <img src={image} alt="" className="size-20 rounded-lg" />}
      {message && <span>{message}</span>}
    </div>
  );
};
