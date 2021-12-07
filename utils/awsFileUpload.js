const AWS = require("aws-sdk");
const fs = require("fs");
const config=require("../awsConfig.json")
const {  AWSDomain } = process.env;
const AWSSignedUrl = async (file) => {
  try {
    const { mimetype, originalname, buffer, fieldname } = file;
    AWS.config.update(config);
    let s3bucket = new AWS.S3();
    var params = {
      Bucket: "web-design-project",
      Key: `${fieldname}/${originalname}`,
      Body: buffer,
      ContentType: mimetype,
      ACL: "public-read",
    };
    await s3bucket.upload(params, async function (err, data) {
      if (err) {
        console.log(err);
      } else {
        await console.log(data);
        const filelink = `${AWSDomain}/${data.Key}`;
        console.log(filelink);
      }
    });
    return `${AWSDomain}/${params.Key}`;
  } catch (err) {
    console.log(err);
  }
};
module.exports = AWSSignedUrl;
