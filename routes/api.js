const express = require('express')
const router = express.Router()
const uploadController = require("../controller/upload");
const auth = require('../controller/user')

// Add User into Database
router.post('/registration', auth.addUser)

// Sign in Request
router.post('/signin', auth.signin)

// Upload Image
router.post("/upload", uploadController.uploadFile);

// delete files
router.post("/delete", uploadController.deleteFile);

// Get Images
router.post("/images", uploadController.getImages);

// Reset password Request
router.post('/resetPassword', auth.resetPassword)
router.post('/:userId/:token', auth.resetPasswordlink)


module.exports = router