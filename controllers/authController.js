const User = require('../models/user')
const nodemailer = require('nodemailer')



exports.login = async (req,res) => {
    const { email, password} = req.body;
    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({ message: "User not found!"})
        }

        const isEqual = await user.comparePassword(password)
        
        if(!isEqual){
            return res.status(401).json({ message: "Incorrect password!"})
        }else{
            req.session.userId = user._id;
            req.session.email = user.email;

            return res.status(200).json({ message: "Login successful!", redirect: "/drafts" }) 
        }
    
    }catch (error){
        console.error("Login error: ",error);
        return res.status(500).json({ message: "Server Error!"})

    }
};
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error: ", err);
            return res.redirect('/?message=' + encodeURIComponent("Logout failed, please try again"));
        }
        res.clearCookie('connect.sid');
        return res.redirect('/?message=' + encodeURIComponent("Logged out successfully"));
    });
};


exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        return res.redirect('/?message=' + encodeURIComponent("Please log in first"));
    }
};


exports.forgot_password = async (req,res) => {
    const { email } = req.body;
    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({ error: 'Email not found' });
        }

        const tempPassword = Math.random().toString(36).slice(-8) //random 8 characters
        // console.log(tempPassword);
        user.password = tempPassword;
        await user.save()
        // console.log("Passowrd after saviung", user.password)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Temporary Password',
            text: `Here is your temporary password: ${tempPassword}. Please log in and change it immediately.`
        }

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Temporary password sent to email.' });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });

    }
};