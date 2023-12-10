import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${nanoid()}${path.extname(file.originalname)}`);
  },
});

var upload = multer({ storage: storage });

export default upload;
