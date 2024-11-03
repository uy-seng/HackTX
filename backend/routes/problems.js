const express = require('express');
const router = express.Router();
const { getProblemById, getProblemIdByDifficulty } = require('../problems/manager');

router.get("/:level", async(req, res) => {
  const problemIds = getProblemIdByDifficulty(req.params.level);
  const problems = await Promise.all(problemIds.map((problemId) => getProblemById(problemId)));
  return res.json({ problems });
});

module.exports = router;