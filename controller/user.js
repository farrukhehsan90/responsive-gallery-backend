const { json } = require('body-parser')
const User = require('../models/user')
const bcrypt = require('bcryptjs');
var validate = require("validate.js");
const Joi = require('joi');
const Token = require("../models/tokenScheme");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// SIGNUP
exports.addUser = (req, res, next) => {
    const { displayName, email, password, phone, userName, role } = req.body
    var constraints = {
        userName: {
            presence: true,
            length: {
                minimum: 6,
                message: "must be at least 6 characters"
            }
        },
        displayName: {
            presence: true,
            length: {
                minimum: 6,
                message: "must be at least 6 characters"
            }
        },
        age: {
           
           
        },
        email: {
            presence: true,
            email: true
        },
        password: {
            presence: true,
            length: {
              minimum: 6,
              message: "must be at least 6 characters"
            }
        }
    }
    const isValidate = validate(req.body, constraints)
    if(isValidate) return res.send({status: false, message: isValidate})
    User.findOne({email: email, userName: userName})
    .then((userObj) => {
        if(userObj) return res.status(200).send({status: false, message: "User already exist"})
        bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({userName: userName, email: email, password: hashedPassword, phone: phone, displayName: displayName, role: role})
            user.save()
            .then((userDoc) => {
                return res.status(200).send({status: true, message: "User Created Succesfully!", data: userDoc})
            })
        })
    })
}

// SIGN IN
exports.signin = (req, res, next) => {
    const { email, password } = req.body 
    if(!email || !password ) {
        return res.send({status: false, message: "Email & Password both are required"})
    }else {
        User.findOne({email: email})
        .then((userDoc) => {
            if(userDoc) {
                bcrypt.compare(password, userDoc.password)
                .then((isMatched) => {
                    if(isMatched) {
                        return res.status(200).send({status: true, data: userDoc, message: "Sign in Sucessfully"})
                    }else {
                        return res.send({status: false, message: "Email or Password is incorrect"})
                    }
                })
            }else {
                return res.send({status: false, message: "Email or Password is incorrect"})
            }

        })
        .catch(err => {
            return res.status(403).send({status: false, message: err.message})
        })
    }
}

// GET ALL USERS
exports.getUsers = (req, res, next) => {
    User.find()
    .then(result => {
        console.log("getUser result", result)
        res.status(200).send({status: true, data: result})
        res.end()
    })
    .catch(err => {
        console.log("err")
        res.status(403).send({status: false, data: err.message})
        res.end()
    })
}

// RESET PASSWORD REQUEST
exports.resetPassword = async (req, res, next) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send({status: false, message: error.details[0].message});

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.send({status: false, message: "user with given email doesn't exist"});

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `http://localhost:3000/api/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        res.send({status: true, message: "password reset link sent to your email account"});
    } catch (error) {
        res.send({status: false, message: "An error occured"});
        console.log(error);
    }
}

exports.resetPasswordlink = async (req, res, next) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send({status: false, message: "invalid link or expired"});

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({status: false, message: "Invalid link or expired"});

        user.password = await bcrypt.hash(req.body.password, 12);
        await user.save();
        await token.delete();

        res.send({status: true, message: "password reset sucessfully."});
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }

}

