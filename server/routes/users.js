const { Router } = require("express");
const router = Router();
const {
    getOtherUserProfile,
    getLatestUsers,
    getUsersByQuery,
    updateBio,
    deleteTagsByUpdate,
    getFavoriteState,
    getFeaturedUsers,
    insertTags,
} = require("../../database/db");

router.post("/user/profile_bio", (req, res) => {
    const { bio, tags, newTube, newSpot } = req.body;
    const { userId } = req.session;

    updateBio(bio, tags, newTube, newSpot, userId).then((results) => {
        if (!results) {
            console.log("updateed, ", results);
            res.json(results);
            return;
        } else {
            deleteTagsByUpdate(userId).then(() => {
                results.tags.forEach((element) => {
                    insertTags(userId, element).then((data) =>
                        console.log("tag updated", data)
                    );
                });
            });

            res.json(results);
        }
    });
});

router.get("/users", (req, res) => {
    const search = req.query.search;
    const { userId } = req.session;

    if (!search) {
        // getLatestUsers().then((users) => {
        //     res.json(users);
        // });
        return;
    } else if (search) {
        getUsersByQuery(userId, search).then((users) => {
            const filteredId = users.filter((user) => user.id !== userId);
            res.json(filteredId);
        });
    }
});

let newMapped = [];
router.get("/users/newartists", async (req, res) => {
    const { userId } = req.session;
    const users = await getLatestUsers(userId);
    // users.forEach(async (item) => {
    //     let usuario = item;
    //     const data = await getFavoriteState(userId, item.id);
    //     data.length >= 1
    //         ? newMapped.push({ ...item, isFavorite: true })
    //         : newMapped.push(usuario);
    // });

    res.json(users);
});

router.get("/users/featuredartists", async (req, res) => {
    const { userId } = req.session;
    const users = await getFeaturedUsers(userId);

    res.json(users);
});

router.get("/api/users/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;

    const { userId } = req.session;

    if (otherUserId == userId) {
        res.json({ error: true });
        return;
    }
    getOtherUserProfile(otherUserId).then((data) => {
        if (!data) {
            res.json({ error: true });
            return;
        }
        res.json(data);
    });
});

module.exports = router;
