import express from "express";
import session from "express-session";
import rootRouter from "./Router/rootRouter";
import postingRouter from "./Router/postingRouter";
import userRouter from "./Router/userRouter";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + '/src/views');

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 315360000000,
    },
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
}));
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/postings", postingRouter);
app.use("/users", userRouter);

export default app;
