const fs = require("fs");
const cp = require("child_process");
const readline = require("readline");

const writeCodeToFile = (problemId, userId, lang, code) => {
  const codeFileName = `${problemId}-${userId}.${lang}`;
  return new Promise((resolve, reject) => {
    fs.writeFile(`tmp/${codeFileName}`, code, "utf-8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(codeFileName);
      }
    });
  });
};

const getTestCaseNames = async (problemId) => {
  // TODO:: connect to database to get test case names
  // TODO: remove hardcoded string
  return ["sample-1"];
};

const compileSolution = async (codeFileName, lang) => {
  // NOTE: only supports cpp, java, and python for now
  const executableFileName = codeFileName.split(".")[0];
  if (lang === "cpp") {
    return new Promise((resolve, reject) => {
      cp.exec(
        `g++ -std=c++20 -O3 tmp/${codeFileName} -o tmp/${executableFileName}`,
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve(executableFileName);
        },
      );
    });
  } else if (lang === "java") {
    return new Promise((resolve, reject) => {
      cp.exec(`javac tmp/${codeFileName}`, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(executableFileName);
      });
    });
  } else {
    return executableFileName;
  }
};

const readFile = async (fileName) => {
  const fileStream = fs.createReadStream(fileName);
  const lines = [];
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
};

const compareOutput = async (userOutputFile, judgeOutputFile) => {
  const userOutputLines = await readFile(userOutputFile);
  const judgeOutputLines = await readFile(judgeOutputFile);
  if (userOutputLines.length !== judgeOutputLines.length) {
    return "WA";
  }
  for (let i = 0; i < userOutputLines.length; i++) {
    if (userOutputLines[i].trim() !== judgeOutputLines[i].trim()) {
      return "WA";
    }
  }
  return "AC";
};

const runTestCase = async (
  lang,
  problemId,
  testCaseName,
  executableFileName,
) => {
  // load test case input file
  const inputFilePath = `testcases/${problemId}/data/${testCaseName}.in`;
  // run executable against test case input file and get output
  if (lang === "cpp") {
    await new Promise((resolve, reject) => {
      cp.exec(
        `./tmp/${executableFileName} < ./${inputFilePath} > ./tmp/${executableFileName}-${testCaseName}.out`,
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve();
        },
      );
    });
  } else if (lang === "java") {
    await new Promise((resolve, reject) => {
      cp.exec(
        `java ./tmp/${executableFileName} < ./${inputFilePath} > ./tmp/${executableFileName}-${testCaseName}.out`,
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve();
        },
      );
    });
  } else {
    await new Promise((resolve, reject) => {
      cp.exec(
        `python3 ./tmp/${executableFileName}.py < ./${inputFilePath} > ./tmp/${executableFileName}-${testCaseName}.out`,
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve();
        },
      );
    });
  }
  // do comparison against judge output file
  const verdict = await compareOutput(
    `tmp/${executableFileName}-${testCaseName}.out`,
    `testcases/${problemId}/data/${testCaseName}.ans`,
  );
  // return verdict
  return verdict;
};

const deleteFile = async (fileName) => {
  return new Promise((resolve, reject) => {
    fs.unlink(fileName, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const cleanUpSubmissionFile = async (
  lang,
  executableFileName,
  solutionFileName,
) => {
  if (lang === "cpp") {
    // delete executable file
    await deleteFile(`tmp/${executableFileName}`);
  }
  // delete solution file name
  await deleteFile(`tmp/${solutionFileName}`);
};

module.exports = {
  writeCodeToFile,
  getTestCaseNames,
  compileSolution,
  runTestCase,
  cleanUpSubmissionFile,
};
