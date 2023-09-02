import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import multer from "multer";
import { fileURLToPath } from "url";
import connectDB from "./connect/connect.js";
import authroute from "./route/auth.js";
import { userRegister } from "./controllers/registerFunc.js";
import userRoute from "./route/user.js";
import postRoute from "./route/post.js";
import { isAuthenticated } from "./middleware/auth.js";
import { createPost } from "./controllers/postFunc.js";
import cookieParser from "cookie-parser";
import chatRouter from "./route/chat.js";
import { Server } from "socket.io";



dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); //current Directory


const app = express();
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URI,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//FileStorge

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage: storage });
connectDB();
app.get('/', (req, res) => {
  res.send("Hello, world!");

});

app.post("/auth/register", upload.single("picture"), userRegister);

app.post("/post", isAuthenticated, upload.single("picture"), createPost);



app.use("/auth", authroute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/chat", chatRouter);

const server = app.listen(process.env.PORT, () => {
  console.log('Server Started on port ' + process.env.PORT);
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
