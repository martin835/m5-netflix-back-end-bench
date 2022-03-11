import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mediaRouter from "./services/media/index.js";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import { join } from "path";

const server = express();

/* const port = process.env.PORT; */
const port = 3001;

// *********************************** MIDDLEWARES ***********************************

/* server.use(express.static(publicFolderPath));
server.use(
  cors({
    origin: function (origin, next) {
      //cors is a global middleware - for each request
      console.log("ORIGIN: ", origin);
      // 0 \\ 0
      if (origin === undefined || whitelist.indexOf(origin) !== -1) {
        console.log("ORIGIN ALLOWED");
        next(null, true);
      } else {
        console.log("ORIGIN NOT ALLOWED");
        next(new Error("CORS ERROR!"));
      }
    },
  })
); */
server.use(express.json());

// *********************************** ENDPOINTS *************************************
server.use("/media", mediaRouter);
//server.use("/reviews", reviewsRouter);

// ********************************** ERROR HANDLERS *********************************

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
