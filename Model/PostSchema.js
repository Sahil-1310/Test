import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema(
    {
        title: {
            type: String
        },
        body: {
            type: String
        },
        image: { type: String },
        thumbnail: { type: String },
        author: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    },
    {
        versionKey: false,
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    })

module.exports = mongoose.model("Post", PostSchema);
