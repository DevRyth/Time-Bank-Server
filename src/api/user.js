const express = require('express');
const User = require('../model/user');
const UserInfo = require('../model/userInfo');

const router = express.Router();

router.post('/register', async (req, res) => {
    const userId = req.headers.authorization.slice(0, Math.ceil(req.headers.authorization.length / 2));
    
    const userinfo = req.body.user;
    
    const existingUser = await User.findOne({_id: userId}).catch((err) => {
        return res.status(404).json("Invalid Token!!");
    });

    if(existingUser.user_info) return res.status(200).json(existingUser);

    const userInfo = new UserInfo(userinfo);
    
    const savedUserInfo = await userInfo.save(async (err, u) => {
        if(err) res.status(500).json({error: "Cannot save user info at the moment!", err});
        existingUser.user_info = u._id;
        await existingUser.save();
        const savedUser = await User.findOne({_id: userId}).populate(["user_info", "time_bank"]).then((u) => {
            return res.status(200).json(u);
        })
        // res.status(200).json({user: existingUser, userInfo: u});
    });

    // if(savedUserInfo) res.status(200).json({...user, email: existingUser.email, username: existingUser.username});
});

module.exports = router;