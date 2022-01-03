var http = require("http");
var app = require("./app");
var mongoose = require("mongoose");
require("dotenv/config");

var port = process.env.PORT || 3000;

var server = http.createServer(app);

// Mongoose Db Connection
mongoose.connect(process.env.MONGO_URL);
console.log("Mongo Db Connected.");

server.listen(port, null, () => {
  console.log("Server is running");
});
