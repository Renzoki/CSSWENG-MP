const User = require('../models/user')


//TODO: Login logic
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
            return res.status(200).json({ message: "Login successful!", redirect: "drafts" }) 
        }
    
    }catch (error){
        console.error("Login error: ",error);
        return res.status(500).json({ message: "Server Error!"})

    }
};

exports.forgot_password = (req,res) => {
    res.send("Forgot password");
};