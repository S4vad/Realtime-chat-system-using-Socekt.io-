import mongoose from "mongoose";

 const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MOnGODB_URL);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log("mongodb connection error", error);
  }
};


export default mongoConnect;