//importing http
const http = require("http");
//importing app
const app = require("./app");
const port = 3000;

const server = http.createServer(app);

server.listen(port);
