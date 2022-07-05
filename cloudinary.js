const config = require('./config');
const cloudinary = require('cloudinary')
const dbConfig = config.cloudinary;

cloudinary.config({
    cloud_name : dbConfig.cloud_name,
    api_key : dbConfig.api_key,
    api_secret : dbConfig.api_secret
})

exports.upload = (file,folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url : result.url,
                id : result.public_id
            })
        },{
            folder : folder,
            resource_type : "auto"
        })
    })
}