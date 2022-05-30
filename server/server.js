const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
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
    getTagsBySearch,
    addTagInTagsTable,
    getUserArtistById,
    getAllTags,
    getArtistsByTag,
    requestSent,
    addFavorite,
    getFavoriteState,
    removeFavorite,
    getFavorites,
    getRatingById,
    addRatingById,
    getUnreadMsgs,
    setReadMsgs,
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
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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

    isArtist(userId).then((data) => {
        if (!data) {
            getUserById(userId).then((results) => {
                res.json(results);
            });
            return;
        }
        getUserArtistById(userId).then((results) => {
            res.json(results);
        });
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

    const { bio, spotify, youtube, tagsList } = req.body;
    // console.log(req.body);

    // if (!email || !password) {
    //     res.json({ succes: false });
    //     return;
    // }
    createArtistProfile(userId, bio, spotify || null, youtube || null, tagsList)
        .then((data) => {
            data.tags.forEach((element) => {
                addTagInTagsTable(data.artist_id, element).then(() =>
                    console.log("it´s all good!")
                );
            });
            res.json({ message: "ok" });
        })
        .catch(() => res.json({ message: "error" }));
});

app.post("/users/request/:otherUserId", (req, res) => {
    const { text } = req.body;
    const { otherUserId } = req.params;
    const { userId } = req.session;
    newArtistRequest(otherUserId, userId, text).then((data) => {
        // console.log(data);
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
                res.json(data);
            });
            return;
        } else {
            createNewMsgArtist(userId, parseInt(otherUserId), msg).then(
                (data) => {
                    res.json(data);
                }
            );
        }
    });
});

app.get("/users/conversations/all", (req, res) => {
    const { userId } = req.session;
    getAllConversations(userId).then((data) => {
        // console.log('all conversations:', data);
        res.json(data);
    });
});

app.get("/users/tags", (req, res) => {
    const search = req.query.search;
    const { userId } = req.session;

    if (!search) {
        // getLatestUsers().then((users) => {
        //     res.json(users);
        // });
        return;
    } else if (search) {
        getTagsBySearch(search).then((users) => {
            const filteredId = users.filter((user) => user.id !== userId);
            res.json(filteredId);
        });
    }
});

app.get("/tags/all", (req, res) => {
    const search = req.query.search;
    const { userId } = req.session;

    getAllTags().then((data) => {
        res.json(data);
    });
});

app.get("/tags/:tags", (req, res) => {
    const { tags } = req.params;
    const { userId } = req.session;

    getArtistsByTag(tags).then((data) => {
        res.json(data);
    });
});

app.get("/hassentrequest/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    const { userId } = req.session;
    requestSent(userId, otherUserId).then((data) => {
        if (data.length < 1) {
            res.json({ message: "no-request" });
        } else {
            res.json({ message: "ok" });
        }
    });
});

app.get("/favorites/all", (req, res) => {
    const { userId } = req.session;
    getFavorites(userId).then((data) => {
        res.json(data);
    });
});

app.get("/favorites/add/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    const { userId } = req.session;
    getFavoriteState(userId, otherUserId).then((data) => {
        if (data.length >= 1) {
            res.json({ message: "friends" });
        } else {
            res.json({ message: "not friends" });
        }
    });
});

app.post("/favorites/add/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    const { userId } = req.session;
    addFavorite(userId, otherUserId).then((data) => {
        console.log("resultadossssss", data);
        res.json(data);
        // res.json({ message: "ok" });
    });
});

app.post("/favorites/remove/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    const { userId } = req.session;
    removeFavorite(userId, otherUserId).then((data) => {
        console.log("rremovidos", data);

        res.json(data);
        // res.json({ message: "removed" });
    });
});

app.get("/users/rating/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;
    getRatingById(otherUserId).then((data) => {
        res.json(data);
    });
});

app.post("/users/rating/post/:otherUserId", (req, res) => {
    const { userId } = req.session;
    const { otherUserId } = req.params;
    const { text, rating } = req.body;
    addRatingById(userId, otherUserId, text || null, rating).then((data) => {
        res.json(data);
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

io.on("connection", async function (socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    socket.on("message", function (data) {
        console.log("data message", data);
        socket.broadcast(socket.id).emit("notifications", data);
    });

    socket.on("readMsgs", async ({ sender_id, recipient_id }) => {
        let sender = sender_id !== userId ? sender_id : recipient_id;

        const readRes = await setReadMsgs(userId, sender);
        socket.emit("no-notifications", {message: 'ok'})
    });

    const userId = socket.request.session.userId;

    const unreadMsgs = await getUnreadMsgs(userId);
    console.log('lectureee,', unreadMsgs);

    if (unreadMsgs[0].count > 0) {
        socket.emit("notifications", unreadMsgs[0]);
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
