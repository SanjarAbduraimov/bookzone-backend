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
import session from "express-session";
import mongodbSession from 'connect-mongodb-session';
import setupPassport from "./lib/passport/index.js";

const MongoDBStore = mongodbSession(session)
const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'sessions', // Collection name to store sessions in the database
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  },
});

// Catch errors in MongoDB connection
store.on('error', function (error) {
  console.error('Session store error:', error);
});
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

app.use(session({
  secret: process.env.SESSION_SECRET, // Change this to a secret key for session encryption
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Session expiration time in milliseconds (e.g., 1 day)
    // secure: false, // Set it to true if using HTTPS
    httpOnly: true,
    secure: false, // Ensure this is set when using HTTPS
  }
}))

const passport = setupPassport()
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next()
})

app.use("/", mainRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "./public/uploads"))
);
app.get("/", (req, res, next) => {
  res.send(`<h1>Home page</h1>`)
})
app.get("/protected", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send("<h1>you made it</h1>")
  } else {
    res.status(401).json("not authenticated")
  }
})
app.get("/login", (req, res, next) => {
  res.send(`<h1>login page</h1>
  <form action="/api/login" method="post">
    <p>
      <label for="email">email</label>
      <input type="email" id="email" name="email" placeholder="johndoe@gmail.com">
    </p>
    <p>
      <label for="password">password</label>
      <input type="password" id="password" name="password" placeholder="your password">
    </p>
    <button>login</button>
  </form>`)
})
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

