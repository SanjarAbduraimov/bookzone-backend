import "express-async-errors";
import express from "express";
const app = express();
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mainRoutes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./config/swagger_output.json" assert { type: 'json' };

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
app.use(morgan("tiny"));
app.use("/", mainRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "./public/uploads"))
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
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`App is listening on Port ${port}`)
    });
    console.log("MongoDB ga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.log("MongoDBga ulanishda xatolik yuz berdi...", err);
  });

