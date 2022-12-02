const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
const mainRoutes = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./config/swagger_output.json");
const envVariables =
  process.env.NODE_ENV === "development" ? "./.env.development" : "./.env";

dotenv.config({ path: path.resolve(__dirname, envVariables) });

app.use(compression());
app.use("*", cors());
app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
app.use(morgan("tiny"));
app.use("/", mainRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "./public/uploads"))
);
// app.use("*", function (req, res) {
//   res.sendFile(path.resolve(__dirname, "../frontend/views/index.html"));
// });

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
