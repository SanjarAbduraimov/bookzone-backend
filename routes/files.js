import express from "express";
const router = express.Router();
import * as fileController from "../controller/files.js";
import multer from "../utils/multer.js";
import { currentUser } from "../utils/index.js";

/* GET home page. */
router.get("/", fileController.fetchAllFiles);
router.post("/", currentUser, multer.array("files"), fileController.createFiles);
router.post("/base64", currentUser, fileController.createBase64Files);
router.get("/:id", fileController.fetchFilesById);
router.patch("/delete", currentUser, fileController.deleteById);

export default router;
