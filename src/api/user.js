const express = require('express');
const User = require('../model/user');
const UserInfo = require('../model/userInfo');

const router = express.Router();

router.post('/register', async (req, res) => {
    const userId = req.body.token.slice(0, Math.ceil(req.body.token.length / 2));
    const user = req.body.user;
    const existingUser = await User.findOne({id: userId}).catch((err) => {
        console.log("Error: ", err);
    });
    if(!existingUser) return res.status(409).json({message: "Token invalid"});
    const userInfo = new UserInfo({...user, userId: userId});
    const savedUserInfo = await userInfo.save().catch((err) => {
        console.log("Error: ", err);
        res.status(500).json({error: "Cannot save user info at the moment!"});
    });

    if(savedUserInfo) res.status(200).json({...user, email: existingUser.email, username: existingUser.username});
});

module.exports = router;