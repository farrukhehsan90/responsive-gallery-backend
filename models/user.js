const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    displayName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    age: {
     
    },
    email: {
        type: String,
        required: true
    },   
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiration: {
        type: Date,
        default: null,
    } ,
}, {
    timestamps: true
  })

module.exports = mongoose.model("User", userSchema)

