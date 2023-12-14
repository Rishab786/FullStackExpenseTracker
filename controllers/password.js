const User = require("../models/user");
const dotenv = require('dotenv');
dotenv.config();
const ForgotPasswords = require('../models/forgotPassword');
const bcrypt = require('bcrypt');
const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
client.authentications["api-key"].apiKey =process.env.SIB_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

//SENDING RESET PASSWORD LINK TO THEIR EMAIL
exports.requestResetPassword = async (request, response, next) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const sender = {
                email: 'rishab90@gmail.com',
                name: 'Rishab'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            const resetresponse = await user.createForgotpassword({});
            const { id } = resetresponse;
            await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Your password",
                htmlContent: `
              <!DOCTYPE html>
                <html>
                <head>
                    <title>Password Reset</title>
                </head>
                <body>
                    <h1>Reset Your Password</h1>
                    <p>Click the button below to reset your password:</p>
                    <button><a href="http://localhost:3000/password/reset/{{params.role}}">Reset Password</a></button>
                </body>
                </html>`,
                params: {
                    role: id
                }
            })
            response.status(200).json({ message: 'Password reset email sent' });
        } else {
            response.status(404).json({ message: 'User not found' });
        }


    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interenal Server Error' });
    }
  };

  //FORGOT PASSWORD PAGE
exports.forgotPassword = async (req, res, next) => {
  res.sendFile("forgotPassword.html", { root: "views" });
};

//SENDING RESET PASSWORD FORM
exports.resetpasswordform = async (request, response, next) => {
    try {
        const id = request.params.id;
        const passwordReset = await ForgotPasswords.findByPk(id);
        if (passwordReset.isactive) {
            passwordReset.isactive = false;
             await passwordReset.save();
            response.sendFile('resetPassword.html', { root: 'views' })
        } else {
            return response.status(401).json({ message: "Link has been expired" })
        }

    } catch (error) {
        console.log(error);

    }
}


//UPDATING NEW PASSWORD INTO DATABASE
exports.resetpassword = async (request, response, next) => {
    try {
        const { resetid, newpassword } = request.body;
        const passwordreset = await ForgotPasswords.findByPk(resetid);
         const hashedPassword = await bcrypt.hash(newpassword, 10);
         const p=passwordreset.UserEmail;
            await User.update(
                {
                    password: hashedPassword
                },
                {
                    where: { email: passwordreset.UserEmail }
                }
            );
            response.status(200).json({ message: "Password reset successful." });
        
} catch (error) {
        console.error("Error resetting password:", error);
        response.status(500).json({ message: "Internal server error" });
    }
};
