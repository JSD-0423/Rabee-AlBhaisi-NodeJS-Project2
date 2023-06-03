const { existsSync, appendFileSync, readFileSync } = require("fs-extra");

const setHeader = (res, statusCode) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.statusCode = statusCode;
};

const databaseCheck = (res) => {
  try {
    const fileExists = existsSync("./books.json");
    if (!fileExists) {
      appendFileSync("./books.json", "[]", "utf8");
      return "created!";
    }
    return "The file exist";
  } catch (error) {
    console.error("error file existence or create the json file");
    console.error("error message : " + error.message);
    setHeader(res, 500);
    res.end("Something went wrong!!");
  }
};

const readDataBase = (res) => {
  try {
    const data = readFileSync("./books.json").toString();
    return JSON.parse(data);
  } catch (error) {
    setHeader(res, 500);
    res.end("Something went wrong!!");
  }
};

module.exports = { setHeader, databaseCheck, readDataBase };
