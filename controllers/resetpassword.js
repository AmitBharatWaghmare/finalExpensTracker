const Sib = require(`sib-api-v3-sdk`);
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../moduls/Signup');
const ForgotPassword = require("../moduls/forgotpassword");
async function forgotpassword(req, res, next) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        try {
            if (user) {
                const id = uuid.v4();
                user.createForgotpassword({ id, active: true })
                    .catch(err => {
                        throw new Error(err);
                    });
                const client = Sib.ApiClient.instance;
                const apiKey = client.authentications['api-key'];
                apiKey.apiKey = process.env.EMAIL_API_KEY;
                const apiInstance = new Sib.TransactionalEmailsApi();

                const sender = {
                    email: 'waghmare738@gmail.com'
                };

                // Send transactional email
                await apiInstance.sendTransacEmail({
                    sender,
                    to: [{ email: email }],
                    subject: "Reset your password",
                    textContent: "Click here to reset your password",
                    htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
                });

                // Send success response
                return res.status(200).json({ message: 'Link to reset password sent', success: true });
            }
            else {
                throw new Error('User doesnt exist');
            }
        }
        catch (err) {
            throw new Error(err);
        }

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to send reset password email', success: false });
    }
}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    ForgotPassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpassword){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="http://localhost:3000/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}


const updatepassword  = async(req , res , next) =>{
    try{
        const {newpassword} = req.query;
        const {resetpasswordid} = req.params;
        let forgotpasswordrequests = await ForgotPassword.findOne({where:{id:resetpasswordid}});
        let user = await User.findOne({where:{id : forgotpasswordrequests.SignUpUserId}});
        const saltRounds =10;
        const hashedPassword = await bcrypt.hash(newpassword,saltRounds);
        await user.update({password:hashedPassword});
        console.log("Succesfully updated")
        return res.status(201).json({ message: 'Successfully updated the new password', success: true });
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
    }

    module.exports = {
        forgotpassword,
        updatepassword,
        resetpassword
    }