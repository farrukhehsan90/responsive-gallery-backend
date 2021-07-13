const Image = require('../models/image')

const uploadFile = async (req, res) => {
    let file = req.files.file
    const filename = `${Date.now()}-assignment-${file.name}`;
    // let ext = req.files.file.name.split(".")[((req.files.file.name.split(".")).length)-1]
    req.files.file.mv(`./images/${filename}`)
    const image = new Image({fileName: filename})
    image.save()
    .then((files) => {
        return res.status(200).send({status: true, message: "Image Uploaded!", data: files})
    })
    .catch((err) => {
        return res.status(403).send({status: false, message: err})
    })
};


const deleteFile = async (req, res) => {

    const { id } = req.body
    if (!id) res.send({status: false, message: "Id is required"}) 

    Image.findByIdAndRemove(id)
    .then(result => {
        console.log("result removeUserById", result)
        if(!result) return res.send({status: false, message: "Image not found!"})
        return res.send({status: true, message: "Image Deleted!", data: "deleted"})
    })
    .catch(err => {
        console.log("err removeUserById")
        return res.send({status: false, data: err.message})
    })

};

const getImages = async (req, res) => {
    Image.find()
    .then(result => {
        console.log("get images result", result)
        res.status(200).send({status: true, data: result})
        res.end()
    })
    .catch(err => {
        console.log("err", err)
        res.status(403).send({status: false, data: err.message})
        res.end()
    })
};

module.exports = {
  uploadFile: uploadFile,
  getImages: getImages,
  deleteFile:deleteFile
};