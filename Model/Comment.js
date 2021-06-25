import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
CommentSchema.static('countComment', async(post_id) =>{
    return await mongoose.model("Comment").countDocuments(post_id);
  })

module.exports = mongoose.model("Comment", CommentSchema);
