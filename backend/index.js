const express = require("express");
const dotenv = require("dotenv").config();
const { Pool } = require('pg');
const codeExecutionRouter = require("./routes/code-execution");
const app = express();

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD} = process.env;
console.log(PGHOST, PGDATABASE, PGUSER, PGPASSWORD);


const pool = new Pool({ 
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432, // neons postgres port
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 15000, 
  idleTimeoutMillis: 15000,
})

app.use(express.json());
app.use("/code-execution", codeExecutionRouter);
app.get("/", async (req, res) => {
  try {
    console.log("Attempting to connect to the database...");
    const result = await pool.query("SELECT version(), current_setting('server_version'), current_setting('server_version_num')");
    // const result = await pool.query("SELECT * FROM accounts");
    console.log("Query successful, returning rows:", result.rows);
    return res.json(result.rows); // Return data if query succeeds
  } catch (errors) {
    console.error("Error during database query:", errors);
    return res.status(500).json("Database query failed"); // Provide a 500 status if query fails
  } 
});

app.listen(3001, console.log("Server Running"));
