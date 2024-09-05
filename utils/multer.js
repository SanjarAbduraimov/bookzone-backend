import multer from "multer";
// import path from "path";
// import { nanoid } from "nanoid";
const storage = multer.memoryStorage()
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${nanoid()}${path.extname(file.originalname)}`);
//   },
// });

const upload = multer({ storage });

export default upload;
