import userService from '../Services/userService';
import responseHandling from '../../Responses/responseHandling'
const userService__ = new userService();
class userController {
    async signUp(req, res) {
        try {
            const result = await userService__.SignUp(req, res);
            if (result.success == false)
                return responseHandling.sendError(res, result.message, result.status || null, null)

            return responseHandling.sendSuccess(res, null, 201, result);
        } catch (error) {
            return responseHandling.sendError(res, error.message, error.status, null)
        }
    }
    async otp(req, res) {
        try {
            if (req.decoded) {
                const result = await userService__.opt(req, res);
                if (result.success == false)
                    return responseHandling.sendError(res, result.message, result.status, null)
                console.log(result);

                return responseHandling.sendSuccess(res, result.message, null, null);
            }
        } catch (error) {
            return responseHandling.sendError(res, error.message, error.status || 500, null)
        }
    }
    async login(req, res) {
        try {
            const result = await userService__.login(req, res);
            if (result.success == false)
                return responseHandling.sendError(res, result.message, result.status, null)

            return responseHandling.sendSuccess(res, result.message, null, null);
        } catch (error) {
            return responseHandling.sendError(res, error.message, error.status || 500, null)
        }
    }

    async uploadPost(req, res) {
        try {
            const result = await userService__.uploadPost(req, res);
            if (result.success == false)
                return responseHandling.sendError(res, result.message, result.status, null)

            return responseHandling.sendSuccess(res, result.message, null, null);
        } catch (error) {
            return responseHandling.sendError(res, error.message, error.status || 500, null)
        }
    }

    async Like(req, res) {
        try {
            const result = await userService__.Like(req, res);
            if (result.success == false)
                return responseHandling.sendError(res, result.message, result.status, null)

            return responseHandling.sendSuccess(res, result.message, null, null);
        } catch (error) {
            return responseHandling.sendError(res, error.message, error.status || 500, null)
        }
    }
    async Comment(req, res) {
        try {
            const result = await userService__.Comment(req, res);
            if (result.success == false)
                return responseHandling.sendError(res, result.message, result.status, null)

            return responseHandling.sendSuccess(res, result.message, null, null);
        } catch (error) {
            return responseHandling.sendError(res, error.message, error.status || 500, null)
        }
    }

}
export default userController