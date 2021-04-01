const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

module.exports.uploadS3 = async (fileStream) => {
    const params = {
        Bucket: 'test-vus',
        key: function (req, file, cb) {
            cb(null, 'images/origin/' + Date.now() + '.' + file.originalname.split('.').pop());
        },
        Body: fileStream,
        ACL: 'public-read',
    };

    try {
        const response = await s3.upload(params).promise();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};
