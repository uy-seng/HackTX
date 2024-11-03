const express = require('express');
const db = require('../utils/db');
const { getDelta } = require('../leaderboard/utils');
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await db.query("SELECT users.username, leaderboard.score from leaderboard INNER JOIN users ON users.id = leaderboard.user_id");
  return res.json({
    data: result.rows
  })
});

router.post("/update", async(req, res) => {
/**
 * body {
 *   userId: string;
 *   difficulty: string;
 * }
 * 
 */
  const result = await db.query("SELECT leaderboard.score from leaderboard WHERE user_id = $1", [req.body.userId]);
  await db.query("UPDATE leaderboard SET score = $1 WHERE user_id = $2", [result.rows[0].score + getDelta(req.body.difficulty), req.body.userId]);
  return res.json({
    status: "ok"
  })
})

module.exports = router;