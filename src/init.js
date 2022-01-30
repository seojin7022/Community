import "dotenv/config";
import "./db";
import app from "./server";

app.listen(2022, () => console.log("✅ Server is successfully started 🚀 http://localhost:2022/"));

