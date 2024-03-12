require("dotenv").config();
const express = require("express");
const dbConnect = require("./dbConnect");
const movieRoutes = require("./routes/movies");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

dbConnect();
app.use(express.json());
app.use(cors());

const User = require("./models/user.js");
const secretKey = process.env.SECRET_KEY || "fallback-secret-key";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized - No token provided" });
  }
  try {
    // Check if the token starts with "Bearer "
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized - Invalid token format" });
    }

    const decoded = jwt.verify(tokenParts[1], secretKey);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized - Invalid token" });
  }
};
// Login route to generate JWT
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user;
    if (username === "Kanchan" && password === "Kanchan@2024") {
      user = {
        id: 1,
        username: "Kanchan",
        role: "admin",
      };
    } else {
      // If not an admin
      user = await User.findOne({ username });
      if (!user || user.password !== password) {
        return res
          .status(401)
          .json({ error: true, message: "Invalid credentials" });
      }
      user.role = "user";
    }

    const payload = {
      user: { id: user.id, username: user.username, role: user.role },
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.use("/api", verifyToken, movieRoutes);
// app.use("/api", movieRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
