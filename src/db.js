import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const connection = mongoose.connection;

connection.on("error", (error) => console.log("⛔ DB has a problem"));
connection.once("open", () => console.log("✅ Connected to DB"));