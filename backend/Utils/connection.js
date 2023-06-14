import mongoose from "mongoose";

const Connection = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("CONNECTED TO DB");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export default Connection;
