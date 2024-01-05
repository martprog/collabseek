const aws = require("aws-sdk");
const fs = require("fs");
let secrets, s3_options;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
    s3_options = {
        accessKeyId: secrets.AWS_KEY,
        secretAccessKey: secrets.AWS_SECRET,
    };
} else if (process.env.MINIO_ROOT_USER) {
    //secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
    s3_options = {
        endpoint: "http://s3mock:9000", // Use MinIO endpoint
        accessKeyId: process.env.MINIO_ROOT_USER, //secrets.AWS_KEY,
        secretAccessKey: process.env.MINIO_ROOT_PASSWORD, //secrets.AWS_SECRET,
        s3ForcePathStyle: true, // Required for MinIO
        signatureVersion: "v4", // Required for MinIO
        region: "localhost",
    };
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
    s3_options = {
        accessKeyId: secrets.AWS_KEY,
        secretAccessKey: secrets.AWS_SECRET,
    };
}

const s3 = new aws.S3(s3_options);
console.log("credentials:");
console.log(process.env.MINIO_ROOT_PASSWORD);
module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file received");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("image is in the cloud!");
            next();
            fs.unlink(path, () => {});
        })
        .catch((e) => console.log("unable to delete file: ", e));
};
