const express = require('express');
const router = express.Router();
const { getProblemById, getProblemIdByDifficulty, getSolutionsByProblemId } = require('../problems/manager');

router.get("/:level", async(req, res) => {
  const problemIds = getProblemIdByDifficulty(req.params.level);
  const problems = await Promise.all(problemIds.map((problemId) => getProblemById(problemId)));
  return res.json({ problems });
});

router.get("/:problemId/solutions", async(req, res) => {
  const solutions = await getSolutionsByProblemId(req.params.problemId);
  return res.json({
    solutions
  })
})

module.exports = router;