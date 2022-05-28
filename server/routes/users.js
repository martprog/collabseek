const { Router } = require("express");
const router = Router();
const {
    getOtherUserProfile,
    getLatestUsers,
    getUsersByQuery,
    updateBio,
    deleteTagsByUpdate,
    getFavoriteState,
} = require("../../database/db");

router.put("/user/profile_bio", (req, res) => {
    const { bio, newTags } = req.body;
    const { userId } = req.session;

    updateBio(bio, userId, newTags).then((results) => {
        results.tags.forEach((element) => {
            deleteTagsByUpdate(userId, element).then((data) =>
                console.log("tag erased", data)
            );
        });
        res.json(results);
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
        getUsersByQuery(search).then((users) => {
            const filteredId = users.filter((user) => user.id !== userId);
            res.json(filteredId);
        });
    }
});

router.get("/users/newartists", (req, res) => {
    const { userId } = req.session;

    let newMapped = [];
    getLatestUsers().then((users) => {
    users.forEach((item) => {
            let usuario = item
            console.log('iiiii', item);
             getFavoriteState(userId, item.id).then((data) => {
                // console.log(data);
                if (data.length >= 1) {
                    console.log("item, ", usuario);
                    newMapped.push({ ...item, isFavorite: true });
                }else{
                    newMapped.push(usuario)
                }
            });
        });
        console.log('mapa', newMapped);
        res.json(newMapped);
    });
});

router.get("/api/users/:otherUserId", (req, res) => {
    const { otherUserId } = req.params;

    const { userId } = req.session;

    if (otherUserId == userId) {
        res.json({ error: true });
        return;
    }
    console.log(otherUserId);
    getOtherUserProfile(otherUserId).then((data) => {
        if (!data) {
            res.json({ error: true });
            return;
        }
        res.json(data);
    });
});

module.exports = router;
