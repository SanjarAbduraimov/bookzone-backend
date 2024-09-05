import "express-async-errors";
import express from "express";
const app = express();
import mongoose from "mongoose";
// import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mainRoutes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./config/swagger_output.json" assert { type: 'json'};
import session from "express-session";
import mongodbSession from 'connect-mongodb-session';
import setupPassport from "./lib/passport/index.js";
import { auth } from "./utils/index.js";
import { SECRET_KEY } from "./config/keys.js";
import jwt from "jsonwebtoken";

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
app.use(express.urlencoded());
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
// app.use((req, res, next) => {
//   console.log(req.session, "req.session");
//   console.log(req.user, "req.user");
//   next()
// })

app.use("/", mainRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// app.use(
//   "/uploads",
//   express.static(path.resolve(process.cwd(), "./public/uploads"))
// );
app.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Log in failure",
  });
});
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
    // session: false // if you're not using sessions
  }), (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, SECRET_KEY, { expiresIn: '1h' });
    // Redirect to frontend with token or send token directly
    res.redirect(`http://127.0.0.1:3000/token.html?token=${token}`);
  }
)
app.get("/auth/google", passport.authenticate("google", { scope: ['profile', 'email'] }))
app.get("/api/protected", auth, (req, res, next) => {
  res.status(200).json("wooooow");
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

