const http = require("http");
const fs = require("fs-extra");
const { setHeader, databaseCheck, readDataBase } = require("./utils");

const host = "localhost";
const port = 3000;

const requestListener = (req, res) => {
  const method = req.method;
  const endpoint = req.url;

  databaseCheck(res);

  const books = readDataBase(res);

  try {
    switch (method) {
      case "GET":
        getHandler(endpoint, books, res);
        break;
      case "POST":
        postReqHandler(books, req, res);
        break;
      default:
        setHeader(res, 400);
        res.end(JSON.stringify({ error: "This is a bad request" }));
        break;
    }
  } catch (error) {
    setHeader(res, 500);
    res.end(error.message);
  }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`the server is at http://${host}:${port}`);
});

function getHandler(endpoint, books, res) {
  setHeader(res, 200);
  if (endpoint.startsWith("/books")) {
    const id = Number(endpoint.slice(7));
    if (id) {
      const result = books.filter((book) => book.id == id)[0];
      if (!result) {
        throw Error("The books does not exist!.");
      }
      res.end(JSON.stringify(result));
      return;
    }
    books.length === 0
      ? res.end("No Books to show")
      : res.end(JSON.stringify(books));
    return;
  }
  throw Error("This request is not defined");
}

function postReqHandler(arr, request, response) {
  const data = [];
  const id = arr[arr.length - 1].id + 1;
  request
    .on("data", (chunk) => {
      data.push(chunk);
    })
    .on("end", () => {
      const bodyString = Buffer.concat(data).toString();
      const body = Object.fromEntries(new URLSearchParams(bodyString));
      const keys = Object.keys(body);
      if (keys.length === 1 && keys[0] === "name") {
        arr.push({ id, ...body });
        fs.appendFileSync("./books.json", JSON.stringify(arr), { flag: "w" });
        setHeader(response, 201);
        response.end("Created successfully " + id);
      } else {
        setHeader(response, 400);
        response.end("Wrong Credentials");
      }
    });
}
