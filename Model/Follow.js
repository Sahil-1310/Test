import mongoose, { Schema } from "mongoose";

const followSchema = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        follower: { type: Schema.Types.ObjectId, ref: "user" },
        status: { type: Boolean, default: true },
        isAccept: { type: Boolean, default: false }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = mongoose.model("Follow", followSchema);