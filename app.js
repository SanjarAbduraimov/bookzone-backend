require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mainRoutes = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./config/swagger_output.json");
const bodyParser = require("body-parser");
const envVariables =
  process.env.NODE_ENV === "development" ? "./.env.development" : "./.env";

dotenv.config({ path: path.resolve(__dirname, envVariables) });

const port = process.env.PORT || 8000;


process.on("uncaughtException", (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1)
})
process.on("unhandledRejection", ex => {
  throw ex
})

app.use(compression());
app.use("*", cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded())
// app.use(bodyParser())
app.use(morgan("tiny"));
app.use("/", mainRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "./public/uploads"))
);

app.use((err, req, res, next) => {
  let statusCode = err.status || 500;

  // Set the status code based on the error type or use 500 for unhandled errors
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request for validation errors
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401; // Unauthorized access
  }
  return res.status(statusCode).json({ success: false, msg: err.message || 'Internal Server Error', })
})

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useFindAndModify: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`App is listening on Port ${port}`)
    });
    console.log("MongoDB ga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.log("MongoDBga ulanishda xatolik yuz berdi...", err);
  });

