const express = require("express");
const listEndpoints = require("express-list-endpoints");
const { join } = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const articlesRouter = require("./services/articles");
const reviewsRouter = require("./services/reviews");
const authorRouter = require("./services/authors");
const userRouter = require("./services/users");

const {
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
} = require("./errorHandling");

const server = express();
const port = process.env.PORT || 5001;
const staticFolderPath = join(__dirname, "../public");

var whitelist = ["http://localhost:3000"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

//MIDDLEWARES
server.use(cors());
//ROUTES
server.use(express.json());
server.use("/articles", articlesRouter);
server.use("/reviews", reviewsRouter);
server.use("/authors", authorRouter);
server.use("/users", userRouter);

//ERROR HANDLERS
server.use(notFoundErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(badRequestErrorHandler);
server.use(catchAllErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () =>
      console.log(`listen on port: http://localhost:${port}`)
    )
  )
  .catch(err => console.log(err));
