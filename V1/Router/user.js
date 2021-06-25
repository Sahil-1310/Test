import express from 'express';
import userController from '../controllers/user'
import commonFunction from '../../utils/commonFunction';

const userController__ = new userController();
const userRoutes = express.Router();

userRoutes.route("/signUp").post(userController__.signUp)
userRoutes.route("/verify").get(commonFunction.authentication, userController__.otp)
userRoutes.route("/login").post(userController__.login);
userRoutes.route("/uploadPost").post(commonFunction.storage.single('ImageUpload'), userController__.uploadPost)
userRoutes.route("/Like:id").get(userController__.Like)
userRoutes.route("/comment:id").get(userController__.Comment)

export default userRoutes