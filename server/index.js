const express = require("express");
const cors = require("cors");
const { connectDB, authenticateToken } = require("./utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");

const PORT = process.env.PORT;
const salt = bcrypt.genSaltSync(10);

const User = require("./models/user");

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(200).json("ok");
    console.log(user);
  } catch (error) {
    if (!username || !password) {
      return res.status(400).json("Fill in the empty field(s)");
    } else if (User.find({ username })) {
      return res.status(400).json("Username already exists!");
    } else {
      return res.status(500).json("internal server error");
    }
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, user.password);
    if (passOk) {
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json("OK");
      //res.cookie("token", accessToken).json("ok");
    } else {
      return res.status(400).json("Wrong credentials!");
    }
  } catch (error) {
    res.status(500).json("internal server error");
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.get("/profile", authenticateToken, (req, res) => {
  res.json(req.user);
});

app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
  }
});

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const usersOnline = new Map();

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("add-user", (username) => {
    usersOnline.set(username, socket.id);

    console.log(usersOnline);

    io.emit("online-users", Array.from(usersOnline.keys()));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const disconnectedUser = Array.from(usersOnline.entries()).find(
      ([username, id]) => id === socket.id
    );
    if (disconnectedUser) {
      const [username, _] = disconnectedUser;
      console.log("Disconnected user:", username);
      usersOnline.delete(username);
      console.log("Updated usersOnline:", usersOnline);
      io.emit("online-users", Array.from(usersOnline.keys()));
    }
  });

  socket.on("send-msg", ({ content, sender, recipient }) => {
    console.log("Message sent:", content, "from:", sender, "to:", recipient);
    const sendUserSocketID = usersOnline.get(recipient);
    if (sendUserSocketID) {
      socket
        .to(sendUserSocketID)
        .emit("receive-msg", { content, sender, recipient });
    }
  });
});

console.log(usersOnline);
