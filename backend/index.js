const express = require("express");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken"); //jwt token library
const bcrypt = require("bcrypt"); // library for hashing passwords
const codeExecutionRouter = require("./routes/code-execution");
const problemsRouter = require("./routes/problems");
const leaderboardRouter = require("./routes/leaderboard");
const db = require("./utils/db");
const app = express();
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Adjust this for your frontend's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));

const JWT_SECRET = process.env.JWT_SECRET;


app.use(express.json());
app.use("/code-execution", codeExecutionRouter);
app.use("/problems", problemsRouter);
app.use("/leaderboard", leaderboardRouter);
app.get("/", async (req, res) => {
  try {
    console.log("Attempting to connect to the database...");
    const result = await db.query(
      "SELECT version(), current_setting('server_version'), current_setting('server_version_num')",
    );
    // const result = await pool.query("SELECT * FROM accounts");
    console.log("Query successful, returning rows:", result.rows);
    return res.json(result.rows); // Return data if query succeeds
  } catch (errors) {
    console.error("Error during database query:", errors);
    return res.status(500).json("Database query failed"); // Provide a 500 status if query fails
  }
});


app.post("/register", async(req, res) => {
  const { username, password } = req.body;

  try {
    //hash password using bcrypt library
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );

    return res.status(201).json({ id: result.rows[0].id, username});

  } catch (error) {
    console.error("Error with Registration:", error);
    return res.status(500).json({error: "Registration FAILED!!!"});
  }
});

app.post("/login", async(req, res) => {
  const { username, password } = req.body; //extract body information

  try {
    const result = await db.query (
      "SELECT * FROM users WHERE username = $1", [username]
    ); //checking if user exists in db

    if (result.rows.length === 0) {
      return res.status(404). json({ error: "User not found"});
    } //if user doesn't appear throw error

    const user = result.rows[0]; //set user with the account info from db
    const hashedPassword = user.password;

    const isPasswordValid = await bcrypt.compare(password, hashedPassword)
    //makes bcrypt compare the 2 and return boolean value

    if (!isPasswordValid) { // exit loop with error
      return res.status(401).json({error: "invalid password"});
    }
    //make jwt token
    const token = jwt.sign({username: user.username, id:user.id}, JWT_SECRET, {expiresIn: "1h"});
    
    return res.json({
      message: "Login successful", 
      token,
    });


  } catch (error) {
    console.error("error with login", error);
    return res.status(500).json({error:"login fail....."});
  }
});

app.listen(3001, console.log("Server Running"));
