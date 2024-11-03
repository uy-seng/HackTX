const express = require("express");
const router = express.Router();
const { Pool } = require("pg"); //postgres library
const dotenv = require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const {
  writeCodeToFile,
  getTestCaseNames,
  compileSolution,
  runTestCase,
  cleanUpSubmissionFile,
} = require("../code-execution-engine/runner");

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432, // neon postgres port
  ssl: {
    rejectUnauthorized: false,
  },

  connectionTimeoutMillis: 15000, // wait 15 seconds before timeout error
  idleTimeoutMillis: 15000,
});

router.get("/", (req, res) => { // welcome message route
  return res.json({
    msg: "Welcome to code execution engine",
  });
});


/*
 *
 * body {
 *   userId: string;
 *   lang: string;
 *   code: string;
 *   problemId: string;
 * }
 * */
router.post("/submit", async (req, res) => {
  const filename = await writeCodeToFile(
    req.body.problemId,
    req.body.userId,
    req.body.lang,
    req.body.code,
  );
  const executableFileName = await compileSolution(filename, req.body.lang);
  // run code against test cases sequentially
  const testCaseNames = await getTestCaseNames(req.body.problemId);
  for (const testCaseName of testCaseNames) {
    const verdict = await runTestCase(
      req.body.lang,
      req.body.problemId,
      testCaseName,
      executableFileName,
    );
    // if encounter non AC, return code
    if (verdict !== "AC") {
      await cleanUpSubmissionFile(req.body.lang, executableFileName, filename);
      return res.json({
        verdict,
      });
    }
  }
  await cleanUpSubmissionFile(req.body.lang, executableFileName, filename);
  return res.json({
    verdict: "AC",
  });
});

module.exports = router;
