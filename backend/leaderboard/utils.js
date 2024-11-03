const getDelta = (difficulty) => {
  if (difficulty === "easy") return 10;
  if (difficulty === "medium")return 20;
  return 30;
}

module.exports = { getDelta };