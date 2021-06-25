import { sign, verify } from 'jsonwebtoken';
import responseMessages from '../Responses/messages';
import status from '../Responses/statusCode';
import responseHandling from '../Responses/responseHandling';
import sgMail from '@sendgrid/mail';
import multer from 'multer'
sgMail.setApiKey(process.env.API_KEY);

class commonFunction {
    static otpGenerate() {
        let value = ''
        for (var i = 0; i < 4; i++) {
            const randValue = Math.floor((Math.random() * 10) % 10);
            value += randValue;
        }
        return value;
    }
    static async jwtIssue(payload) {
        return await sign({ _id: payload._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    }
    static async jwtVerify(token) {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    };
    static authentication(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return responseHandling.sendError(res, responseMessages.messages.Authorization, status.statusCode.Success.Non_AuthoritativeInformation, null)

        verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return responseHandling.sendError(res, responseMessages.messages.InValidToken, status.statusCode.BadRequest.Forbidden, null)
            req.decoded = decoded;
        })
        next();
    }
    static sendEmail(payload) {
        const message = {
            to: payload.email,
            from: "sahilkumar@apptunix.com",
            subject: "OTP",
            html: `<div><h2>Hey, ${payload.otp}</h2><p>Don't share with anyone </strong></p></div>`
        }
        sgMail.send(message).then(() => { console.log("Email Sent") }).catch(error => {
            console.log(error)
        });
    }

    static storage() {
        return storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './upload/image')
            }, filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname)
            }
        });
    }

    static store(){
        multer({ storage: storage() })
    }
}
export default commonFunction

