const express = require("express");
const app = express();
// const server = require("http").Server(app);
// const io = require("socket.io")(server, {
//     allowRequest: (req, callback) =>
//         callback(null, req.headers.referer.startsWith("http://localhost:3000")),
// });
const compression = require("compression");
const path = require("path");
app.use(compression());
const cookieSession = require("cookie-session");
const logAndReg = require("./routes/logReg");
const resetPassword = require("./routes/resetPass");
const friends = require("./routes/friends");
const users = require("./routes/users");
const {
    getUserById,
    uploadProfilePic,
    createArtistProfile,
    newArtistRequest,
    getAllMessages,
    getAllConversations,
    createNewMsg,
    createNewMsgArtist,
    isArtist,
} = require("../database/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("../s3");
const secrets = require("../secrets");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((randomId) => {
            callback(null, `${randomId}${path.extname(file.originalname)}`);
        });
    },
});
const uploader = multer({
    storage: storage,
    // dest: "uploads",
});

const cookieSessionMiddleware = cookieSession({
    secret: secrets.COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(cookieSessionMiddleware);
app.use(express.json());

app.use(logAndReg);
app.use(resetPassword);
app.use(friends);
app.use(users);

app.get("/user/id.json", (req, res) => {
    res.json({ userId: req.session.userId });
});

app.get("/user/me.json", (req, res) => {
    const { userId } = req.session;

    getUserById(userId).then((results) => {
        res.json(results);
    });
});

app.post(
    "/user/profile_picture",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        const { userId } = req.session;
        const { filename } = req.file;
        let url = `https://s3.amazonaws.com/spicedling/${filename}`;

        if (req.file) {
            uploadProfilePic(url, userId)
                .then((results) => {
                    console.log("results of upload: ", results);
                    res.json(results);
                })
                .catch((e) => console.log("error uploading: ", e));
        } else {
            res.json({
                succes: false,
            });
        }
    }
);

app.post("/users/artist/new", (req, res) => {
    const { userId } = req.session;

    const { bio, spotify, youtube } = req.body;

    // if (!email || !password) {
    //     res.json({ succes: false });
    //     return;
    // }
    createArtistProfile(userId, bio, spotify || null, youtube || null)
        .then(() => {
            res.json({ message: "ok" });
        })
        .catch(() => res.json({ message: "error" }));
});

app.post("/users/request/:otherUserId", (req, res) => {
    const { text } = req.body;
    const { otherUserId } = req.params;
    const { userId } = req.session;
    newArtistRequest(otherUserId, userId, text).then((data) => {
        console.log(data);
        res.json({ message: "ok" });
    });
});

app.get("/users/conversation/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    const { userId } = req.session;
    getAllMessages(userId, parseInt(otherUserId)).then((data) => {
        res.json(data);
    });
});

app.post("/users/newMsg/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    const { userId } = req.session;
    const { msg } = req.body;
    isArtist(userId).then((data) => {
        if (!data) {
            createNewMsg(userId, parseInt(otherUserId), msg).then((data) => {
                console.log(data);
                res.json(data);
            });
            return;
        }else{
            createNewMsgArtist(userId, parseInt(otherUserId), msg).then((data) => {
                console.log(data);
                res.json(data);
            });
        }
    });
});

app.get("/users/conversations/all", (req, res) => {
    const { userId } = req.session;
    getAllConversations(userId).then((data) => {
        console.log('all conversations:', data);
        res.json(data);
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
