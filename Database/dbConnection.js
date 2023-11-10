import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Database Connected");
    })
    .catch((err) => {
      console.log("MongoDB Database Failed To Connect", err);
    });
}
