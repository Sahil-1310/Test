import Model from './index';
import CommonFunction from '../utils/commonFunction';
class BaseModel {
   static async create(requestBody, otp) {
        return await Model.User.create(requestBody).then(async res => {
          const token = await CommonFunction.jwtIssue(res._id);
          await Model.otp.create({ user: res._id, phone: res.phone || res.email, otp: otp });
          return {
            otp: otp,
            token: `Bareer ${token}`
          }
        }).catch(err => { throw err })
    }

}

export default BaseModel;