import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/keys.js";
import Book from "../models/books.js";
import Comment from "../models/comments.js";
import Users from "../models/users.js";
import rateLimit from "express-rate-limit";
import MyError from "./error.js";
export const createToken = (user, options) => {
  return jwt.sign({ ...user }, SECRET_KEY, { expiresIn: "10h", ...options });
};

// Rate limiting middleware
export const sendVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Max 5 requests per hour
  message: 'Too many attempts to send verification email, please try again later.',
});
export const validateToken = (token, msg) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new MyError(msg || err.message, 500);
  }
};
export const isOwnComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      success: false,
      msg: "You are not authorized to delete this comment",
    });
  }
  next();
};

export const isOwnBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(400)
        .json({ success: false, error: "book id  is invalid" });
    }
    if (req.locals._id.toString() === book.author.toString()) {
      next();
    } else {
      res.status(401).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "book id  is invalid" });
  }
};
export const isAuthorized = async (req, res, next) => {
  try {
    const user = await Users.findById(req.locals._id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "user id  is invalid" });
    }
    if (user.role === "author") {
      next();
    } else {
      res.status(403).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    res.status(401).json({ success: false, error: "user id  is invalid" });
  }
};

export const currentUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  const validToken = token ? validateToken(token) : {};
  if (validToken._id) {
    try {
      const user = await Users.findById(validToken._id);
      if (user) {
        req.locals = { ...req.locals, _id: user._id, role: user.role };
        next();
      } else {
        res
          .status(403)
          .json({ success: false, error: "You are not authorized" });
      }
    } catch (error) {
      console.log(error, "error");
      res
        .status(401)
        .json({ success: false, error: "You are not authenticated" });
    }
  } else {
    res
      .status(401)
      .json({ success: false, error: "You are not authenticated" });
  }
};
export const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const validToken = token ? this.validateToken(token) : {};
  if (validToken._id) {
    try {
      const admin = await Users.findById(validToken._id);
      if (admin.isAdmin) {
        req.locals = { ...req.locals, _id: admin._id, role: "admin" };
        next();
      } else {
        res
          .status(403)
          .json({ success: false, error: "You are not authorized" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .json({ success: false, error: "You are not authenticated" });
    }
  } else {
    res
      .status(401)
      .json({ success: false, error: "You are not authenticated" });
  }
};
export const deleteImg = (img) => {
  let dir = `../public${img}`;
  if (process.env.NODE_ENV !== "development") {
    dir = `/var/www/${img}/`;
  }
  const imgPath = path.join(__dirname, dir);
  if (fs.existsSync(imgPath) && img) {
    fs.unlinkSync(imgPath);
  }
};

export const imgFileFromBase64 = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: mime,
  });
};
