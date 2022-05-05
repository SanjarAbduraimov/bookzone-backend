const express = require("express");
const router = express.Router();
const controllers = require("../controller/files");
const multer = require("../utils/multer");
const { currentUser } = require("../utils/index");

/* GET home page. */
router.get("/", controllers.fetchAllFiles);
router.post("/", currentUser, multer.array("files"), controllers.createFiles);
router.post("/base64", currentUser, controllers.createBase64Files);
router.get("/:id", controllers.fetchFilesById);
router.patch("/delete", currentUser, controllers.deleteById);

module.exports = router;
