const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
}
if (process.env.MINIO_ROOT_USER) {
    //temporary patch so that wont throw error by startup. SES Feature is, without secrets, momentarily unavailable
    //NOTE: hasnt not been tested nor proved that the MINIO mockup could be also used for this scenario
    secrets = {
        AWS_KEY: process.env.AWS_KEY,
        AWS_SECRET: process.env.AWS_SECRET,
    };
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});

module.exports.sendMail = (email, code) => {
    const promise = ses
        .sendEmail({
            Source: "peanut inc <spotted.yam@spicedling.email>",
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Your new code to reset your password is: ${code}`,
                    },
                },
                Subject: {
                    Data: "Your Code",
                },
            },
        })
        .promise();

    promise
        .then(() => {
            console.log("it worked!");
        })
        .catch((err) => console.log(err));
};
