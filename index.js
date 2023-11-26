import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import dotenv from "dotenv";
import { bootstrap } from "./src/bootstrap.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
const app = express();

dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("uploads"));
dbConnection();
bootstrap(app);
app.use(
  cookieSession({
    name: "session",
    keys: ["openreplay"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.listen(process.env.SERVER_PORT, () =>
  console.log(
    `Server is running on http://localhost:${process.env.SERVER_PORT}/ `
  )
);
