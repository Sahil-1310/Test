import mongoose, { Schema } from "mongoose";
const LikeSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);
LikeSchema.static('countLikes', async(post_id) =>{
  return await mongoose.model("Like").countDocuments(post_id);
})
module.exports = mongoose.model("Like", LikeSchema);
