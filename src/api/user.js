const express = require('express');
const User = require('../model/user');
const UserInfo = require('../model/userInfo');

const router = express.Router();

router.post('/register', async (req, res) => {
    const userId = req.headers.authorization.slice(0, Math.ceil(req.headers.authorization.length / 2));
    const user = req.body.user;
    const existingUser = await User.findOne({id: userId}).catch((err) => {
        console.log("Error: ", err);
    });
    if(!existingUser) return res.status(409).json({message: "Token invalid"});
    const userInfo = new UserInfo(user);
    const savedUserInfo = await userInfo.save((err, u) => {
        if(err) res.status(500).json({error: "Cannot save user info at the moment!", err});
        existingUser.user_info = u.userinfo_id;
        existingUser.save();
        res.redirect('/me');
    });

    if(savedUserInfo) res.status(200).json({...user, email: existingUser.email, username: existingUser.username});
});

module.exports = router;