const User = require('../models/user')



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
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: "Logged out successfully", redirect: "/" });
    });
};

exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        return res.redirect('/?message=' + encodeURIComponent("Please log in first"));
    }
};


exports.forgot_password = (req,res) => {
    res.send("Forgot password");
};