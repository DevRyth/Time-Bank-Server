const express = require('express');
const User = require('../model/user');

const router = express.Router();

router.post('/register', (req, res) => {
    const userId = req.body.token.slice(0, Math.ceil(req.body.token.length / 2));
    const user = req.body.user;
    User.findOneAndUpdate({id: userId}, user, (err) => {
        if(err) {
            console.log("error occured ", err);
            res.status(407).json({error: err});
        }
        console.log("successfully updated");
        res.status(200).json({message: "successfully registered"});
    })
});

module.exports = router;