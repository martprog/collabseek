const { Router } = require("express");
const router = Router();
const {
    getOtherUserProfile,
    getLatestUsers,
    getUsersByQuery,
    updateBio,
    deleteTagsByUpdate,
    getFavoriteState,
    insertTags
} = require("../../database/db");

router.put("/user/profile_bio", (req, res) => {
    const { bio, tags, newTube, newSpot } = req.body;
    const { userId } = req.session;

    // console.log('body', req.body);

    updateBio(bio, tags, newTube, newSpot, userId).then((results) => {
                

        if(!results){
            console.log('updateed, ', results);
            res.json(results);
            return
        }else{
            results.tags.forEach((element) => {
                insertTags(userId, element).then((data) =>
                    console.log("tag updated", data)
                );
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
        getUsersByQuery(search).then((users) => {
            const filteredId = users.filter((user) => user.id !== userId);
            res.json(filteredId);
        });
    }
});

router.get("/users/newartists", (req, res) => {
    const { userId } = req.session;

    getLatestUsers().then((users) => {
        let newMapped = [];
        users.forEach((item) => {
            let usuario = item;
            getFavoriteState(userId, item.id).then((data) => {
                
                if (data.length >= 1) {
                    newMapped.push({ ...item, isFavorite: true });
                } else {
                    newMapped.push(usuario);
                }
                console.log("mapa", newMapped);
            });
            return newMapped
        });
        
        res.json(users);
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
