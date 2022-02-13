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
// "mongodb+srv://codeAdmin:<password>@bookzone.bx1ep.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const envVariables =
  process.env.NODE_ENV === "development" ? "../.env.development" : "../.env";

dotenv.config({ path: path.resolve(__dirname, envVariables) });

app.use(compression());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../frontend")));
//form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use("*", cors());
// app.set("view engine", "pug");
app.use(morgan("tiny"));
app.use("/", mainRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../frontend/views/index.html"));
});

app.use(helmet());

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("MongoDB ga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.log("MongoDBga ulanishda xatolik yuz berdi...", err);
  });

const port = process.env.PORT || 8000;
console.log(port);

app.listen(port);
