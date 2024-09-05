import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { cloudinaryDelete, cloudinaryUploader } from "../lib/cloudinary/index.js";

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
      trim: true,
    },
    country: { type: String, default: "" },
    image: { type: String },
    imageId: { type: String },
    pdfLink: { type: String },
    language: { type: String, default: "" },
    link: { type: String, default: "" },
    pages: { type: String, default: "" },
    year: { type: Date, default: "" },
    views: { type: Number, default: 0 },
    rate: { type: Number, min: 0, max: 5, default: 0 },
    price: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["classic", "biography", "science"],
      lowercase: true,
      default: "classic",
    },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("image") && !this.newImage) {
      return next()
    }
    if (this.imageId) {
      const deletedImage = await cloudinaryDelete(this.imageId);
      console.log(deletedImage, "deletedImage");

    }
    const result = await cloudinaryUploader(this.newImage.buffer)
    // const hashedPassword = await bcrypt.hash(this.password, 10);
    if (!result.url || !result.public_id) {
      throw new Error("Something went wrong")
    }
    this.image = result.url
    this.imageId = result.public_id
    next()
  } catch (err) {
    return next(err);
  }
})
// bookSchema.pre("remove", async function (next) {
//   console.log("pre delete hook");
//   try {
//     // Delete the associated image from Cloudinary before the book is removed
//     if (this.imageId) {
//       await cloudinaryDelete(this.imageId);
//     }
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model("Book", bookSchema);

export default Book;
