import mongoose from "mongoose";

const { Schema } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

const filesSchema = Schema(
  {
    filename: String,
    url: { type: String, require: true },
    mimitype: String,
    mimetype: String,
    size: Number,
    isDeleted: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

filesSchema.plugin(mongoosePaginate);

const files = mongoose.model("File", filesSchema);

export default files;
