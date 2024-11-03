const fs = require('fs');
const db = require('../utils/db');

const getProblemIdByDifficulty = (level) => {
  if (level === "easy") {
    return ["two-sum", "search-insert-position", "container-with-most-water"];
  }
  if (level === "medium") {
    return ["search-insert-position", "container-with-most-water", "jump-game-ii"]
  }
  return ["container-with-most-water", "jump-game-ii", "trapping-rain-water"];
}

const getProblemStatementByProblemId = async(problemId) => {
  const templateFilename = `testcases/${problemId}/statement/statement.md`;
  return new Promise((resolve, reject) => {
    fs.readFile(templateFilename, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    })
  })
}

const getCodeTemplatesByProblemId = async(problemId) => {
  const templatePrefix = `testcases/${problemId}/templates/`;
  const codeTemplateFilenames = [
    {lang: "java", filename: templatePrefix + 'Main.java'},
    {lang: "cpp", filename: templatePrefix + 'template.cpp'},
    {lang: "py", filename: templatePrefix + 'template.py'}
  ];
  return Promise.all(codeTemplateFilenames.map(({ lang, filename }) => new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve({ lang, code: data });
    })
  })));
}

const getProblemById = async (problemId) => {
  const statement = await getProblemStatementByProblemId(problemId);
  const templates = await getCodeTemplatesByProblemId(problemId);
  return {
    statement,
    templates
  }
}

const getSolutionsByProblemId = async(problemId) => {
  const results = await db.query("SELECT * from editorials WHERE problem_id = $1", [problemId]);
  return results.rows.map((obj) => obj.code);
}

module.exports = {
  getProblemById,
  getProblemIdByDifficulty,
  getSolutionsByProblemId
}