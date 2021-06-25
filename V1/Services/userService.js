import ResponsesMessage from '../../Responses/messages'
import CommonFunction from '../../utils/commonFunction'
import BaseModel from '../../Model/BaseModel'
import bycrpt from 'bcryptjs'
import status from '../../Responses/statusCode'
import Model from '../../Model/index'
import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
class userService {

  async SignUp(req, res) {
    try {
      let requestBody = req.body;
      if (!requestBody.phone && !requestBody.email || !requestBody) {
        return {
          success: false,
          message: ResponsesMessage.messages.Missing_parameter1
        }
      }
      let otp = await CommonFunction.otpGenerate();

      if (requestBody.phone && requestBody.countrycode) {
        const isExist = await Model.User.findByPhone(requestBody);
        if (isExist == true) throw new Error(ResponsesMessage.messages.AlreadyExistNumber)
        return await BaseModel.create(requestBody, otp)
      }
      else {
        const isExist = await Model.User.findByEmail(requestBody);
        if (isExist == true) throw new Error(ResponsesMessage.messages.AlreadyExistEmail)
        await CommonFunction.sendEmail({ email: requestBody.email, otp: otp });
        return await BaseModel.create(requestBody, otp)
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  async opt(req, res) {
    try {
      let requestBody = req.body
      if (!requestBody.otp)
        return {
          success: false,
          message: ResponsesMessage.messages.Missing_parameter1
        }
      if (requestBody.otp) {
        const result = await Model.otp.find({ user: req.decoded._id });
        if (result[0].isVerified == true) {
          return {
            message: "User Already Verified"
          }
        }
        console.log(result);
        if (result[0].otp == requestBody.otp) {
          await Model.User.findByIdAndUpdate(ObjectId(result[0].user), { $set: { isVerified: true } }, { new: true }).then(async res => {
            console.log(res, "kfyhuerijkghgui");
            if (res.isVerified == true) {
              await Model.otp.findByIdAndUpdate({ user: result[0]._id }, { $set: { isVerified: true } });
              return {
                message: ResponsesMessage.messages.Verified
              }
            }
          }).catch(err => { throw err })
        }
        return { success: false, message: ResponsesMessage.messages.InvalidOTP, status: status.statusCode.Success.No_Content }
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  async login(req, res) {
    try {
      let requestBody = req.body
      console.log(requestBody);
      if (Object.keys(requestBody).length == 0) {
        return {
          success: false,
          message: ResponsesMessage.messages.Missing_parameter1
        }
      }
      const responseDetails = await Model.User.find({
        $or: [
          {
            "phone": requestBody.username, "isVerified": true
          }, {
            "email": requestBody.username, "isVerified": true
          }]
      })

      console.log(responseDetails);
      if (responseDetails.length == 0) {
        return {
          success: false,
          status: status.statusCode.BadRequest.NotFound,
          message: ResponsesMessage.messages.User_Not_Registered
        }
      }

      if (await bycrpt.compare(requestBody.password, responseDetails.password)) {
        const token = await CommonFunction.jwtIssue(responseDetails.id);
        return {
          token: `Bareer ${token}`
        }
      }
      return {
        status: status.statusCode.BadRequest.NotFound,
        message: ResponsesMessage.messages.Password_Not_Correct
      }
    } catch (error) {
      throw error
    }
  }
  async uploadPost(req, res) {
    try {
      const user = await Model.User.findById(req.decoded._id);
      if (!user) {
        return {
          success: false,
          message: ResponsesMessage.messages.User_Not_Registered
        }
      }
      req.body.author = req.decoded._id;
      const s1 = await Model.Post.create(req.body);
      if (!s1) {
        return {
          success: false,
          message: "Not posted your post"
        }
      }
      return {
        success: true,
        message: "your post successfully posted"
      }
    } catch (error) {
      throw error;
    }
  }

  async Like(req, res) {
    try {
      if (req.params.id) {
        return {
          success: false,
          message: ResponsesMessage.messages.Missing_parameter1
        }
      }
      const likeDetails = await Model.Like.find({ "post": req.params.id }).populate("user");
      if (!likeDetails) {
        return {
          success: false,
          message: "No Post Found"
        }
      }
      return {
        success: true,
        data: likeDetails
      }
    } catch (error) {
      throw error;
    }
  }
  async Comment(req, res) {
    try {
      if (req.params.id) {
        return {
          success: false,
          message: ResponsesMessage.messages.Missing_parameter1
        }
      }
      const likeDetails = await Model.Comment.find({"post": req.params.id }).populate("user","_id fname lname");
      if (!likeDetails) {
        return {
          success: false,
          message: "No Post Found"
        }
      }
      return {
        success: true,
        data: likeDetails
      }
    } catch (error) {
      throw error;
    }
  }

}

export default userService;