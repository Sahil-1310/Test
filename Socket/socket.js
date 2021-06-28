import socket from 'socket.io';
import commonFunction from '../utils/commonFunction';
import mongodblib from './mongodblib';
const io = socket();

io.use(function (socket, next) {                                                      /* TCP HandShacking*/
    if (socket.handshake.query && socket.handshake.query.authorization) {
        accessToken = socket.handshake.query.authorization;
        decodedToken = commonFunction.jwtIssue(accessToken);
        if (!decodedToken) {
            next(new Error('Authentication Error'));
        }
        next();
    } else {
        next(new Error('Authentication Error'));
    }
});

io.on('connection', (socket) => {

    socket.on("whoLikes", async (data) => {
        const data = await mongodblib.addLike(data)
        /**sending back to all users with updated likes*/
        socket.emit("likesCount", data);
    });
    socket.on("unlike", async (data) => {
        const data = await mongodblib.unlike(data)
        /**sending back to all users with updated liked*/
        socket.emit("likesCount", data);
    })

    socket.on("addComment", async (data) => {
        const addComment = await mongodblib.addComment(data);
        socket.emit("addedComment", addComment);
    });

    socket.on("editCmt", async (data) => {
        const edited = await mongodblib.editComment(payload);

        /** updated comment */
        socket.emit('updateComm',edited);
    })

    socket.on("DeleteComment",async (data) => {
        let deleteComment = await mongodblib.deleteComment(data);
        /**All upadted comment*/
        socket.emit("addedComment", deleteComment);
    });

    socket.on("deletedByAuthor", async (data) => {
        const edit = await mongodblib.deletedCommBYAuthor(data);
        /** updated comment when author deleted */
        socket.emit("updated", edit);
    });
   
   socket.on('disconnect', () => {
        console.log('A user disconnected: ', socket.id);
    });

})
