import Model from '../Model/index';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class Mongodblib {

    static async addLike(payload) {
        const obj = {
            post: payload.post,
            user: payload.user
        }
        await Model.Like.create(obj);
        const count = await Model.Like.countLikes(obj.post);
        return count;
    }

    static async unlike(payload) {
        await Model.Like.deleteOne({ "user": payload.user })
        const count = await Model.Like.countLikes(obj.post);
        return count;
    }

    static async addComment(payload) {
        const obj = {
            post: payload.post,
            user: payload.user,
            text: payload.text
        }
        const comment = await Model.Comment.create(obj);
        const user = await Model.User.findById(post.user);
        count = await Model.Comment.countComment(payload.post)

        return {
            comment: comment,
            user: user,
            count: count
        }
    }

    static async deleteComment(payload) {
        await Model.Comment.deleteOne({ "user": payload.user });
        const comment = await Model.Comment.find({ "post": payload.poat });
        const count = await Model.Comment.countComment(payload.post)
        return {
            success: 200,
            comment: comment,
            count: count
        }
    }

    static async editComment(payload) {

        const pipeline = [{$match: {
            $expr: {
               $and: [ {post: ObjectId(payload.post) }, {user: ObjectId(payload.user)} ]
            }}
        }]

        let details = await Model.Comment.aggregate(pipeline);
        const updateComm = await Model.findByAndUpdate(details._id, {$set: {text: payload.text}});
        return updateComm;

    }

    static async deletedCommBYAuthor (payload) {
        const author = await Model.Post.find({"author": payload.user}); /** first author find if author match then in deleteComm function comment of them */
        if(author) {
           return deleteComment(payload);
        }
    }

}

export default Mongodblib

