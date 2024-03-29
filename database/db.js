const spicedPg = require("./spiced-pg/index");

let dbUrl;
if (process.env.DATABASE_URL) {
    // Use the provided DATABASE_URL if it exists (Docker Compose case)
    dbUrl = process.env.DATABASE_URL;
} else {
    // Use local connection parameters if DATABASE_URL is not provided
    //const db = spicedPg("postgres:postgres:postgres@localhost:5432/collabseek");
    dbUrl = "postgres:postgres:postgres@localhost:5432/collabseek";
}

const db = spicedPg(dbUrl);

const bcrypt = require("bcryptjs");

function hashPassword(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
}

const createUser = (first, last, email, password) => {
    return hashPassword(password).then((hashed) => {
        const query = `
            INSERT INTO users (first, last, email, password_hash)
            VALUES($1, $2, $3, $4)
            RETURNING *
            `;
        const params = [first, last, email, hashed];
        return db
            .query(query, params)
            .then((results) => {
                return results.rows[0];
            })
            .catch((e) => console.log(e));
    });
};

function getUserByEmail(email) {
    const query = `
            SELECT * FROM users
            WHERE email=$1
            `;
    const params = [email];
    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
}

const login = (email, password) => {
    return getUserByEmail(email)
        .then((results) => {
            if (!results) {
                return null;
            }
            return bcrypt
                .compare(password, results.password_hash)
                .then((value) => {
                    if (!value) {
                        return null;
                    }
                    return results;
                })
                .catch(() => console.log("false credeeentials!"));
        })
        .catch(() => console.log("inexistent email"));
};

const reset = (email, code) => {
    const query = `
        INSERT INTO gencodes (email, code)
        VALUES ($1, $2)
        RETURNING *
    `;

    const params = [email, code];

    return getUserByEmail(email)
        .then((results) => {
            if (!results) {
                return null;
            }
            return db.query(query, params).then((results) => {
                return results.rows[0];
            });
        })
        .catch(() => console.log("inexistent email"));
};

const getUserByCode = (code) => {
    const query = `
        SELECT * FROM gencodes
        WHERE code=$1
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    `;

    return db.query(query, [code]).then((results) => {
        return results.rows[0];
    });
};

const setNewPass = (password, email) => {
    return hashPassword(password).then((hashed) => {
        const query = `
            UPDATE users
            SET password_hash=$1
            WHERE email=$2
            RETURNING *
        `;

        return db.query(query, [hashed, email]).then((results) => {
            return results.rows[0];
        });
    });
};

const getUserById = (id) => {
    const query = `SELECT * FROM users
        WHERE id=$1
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows[0];
    });
};

const getUserArtistById = (id) => {
    const query = `
        SELECT users.first, users.last, users.profile_picture_url, artists.artist_id, artists.bio,
        artists.youtube_link, artists.spotify_link, artists.tags  FROM users
        JOIN artists
        ON users.id= artists.artist_id
        WHERE users.id=$1
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows[0];
    });
};

const uploadProfilePic = (url, id) => {
    const query = `
        UPDATE users
        SET profile_picture_url=$1
        WHERE id=$2
        RETURNING *
    `;

    return db.query(query, [url, id]).then((results) => {
        return results.rows[0];
    });
};

const updateBio = (bio, tags, youtube, spotify, id) => {
    const query = `
        UPDATE artists
        SET bio=$1, tags=$2, youtube_link=$3, spotify_link=$4
        WHERE artist_id=$5
        RETURNING *
    `;

    return db
        .query(query, [bio, tags, youtube, spotify, id])
        .then((results) => {
            return results.rows[0];
        });
};

function selectTag(id, tag) {
    const query = `
        SELECT * FROM tags
        WHERE id = $1 AND tag = $2
    `;

    return db.query(query, [id, tag]).then((results) => {
        return results.rows[0];
    });
}

const deleteTagsByUpdate = (id) => {
    const query = `
        DELETE FROM tags
        WHERE artist_id=$1
        RETURNING *
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows[0];
    });
};

const insertTags = (id, tag) => {
    const query = `
            INSERT INTO tags (artist_id, tag)
            VALUES($1, $2)
            RETURNING *
        `;

    return db.query(query, [id, tag]).then((results) => {
        return results.rows[0];
    });
};

const createArtistProfile = (
    artist_id,
    bio,
    instrument,
    spotify_link,
    youtube_link,
    tags
) => {
    const query = `
            INSERT INTO artists (artist_id, bio, instrument, spotify_link, youtube_link, tags)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *
            `;
    const params = [
        artist_id,
        bio,
        instrument,
        spotify_link,
        youtube_link,
        tags,
    ];
    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const getLatestUsers = (id) => {
    const query = `
        SELECT  users.id, artists.artist_id, artists.instrument, ROUND(AVG(rating), 0) as art_rating, users.first, users.last, favorites.artist, favorites.sender_id, favorites.is_favorite, users.profile_picture_url
        FROM artists
        LEFT JOIN ratings
        ON artists.artist_id=ratings.artist
        JOIN users
        ON (artists.artist_id=users.id)
        LEFT JOIN favorites on favorites.artist=artists.artist_id and favorites.sender_id=$1
        group by users.id, artists.artist_id, artists.instrument, favorites.artist, favorites.is_favorite, favorites.sender_id, artists.created_at
        ORDER BY artists.created_at DESC
        LIMIT 4
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows;
    });
};

const getFeaturedUsers = (id) => {
    const query = `
        SELECT  users.id, artists.artist_id, artists.instrument, ROUND(AVG(rating), 0) as art_rating, users.first, users.last, favorites.artist, favorites.sender_id, favorites.is_favorite, users.profile_picture_url
        FROM artists
        LEFT JOIN ratings
        ON artists.artist_id=ratings.artist
        JOIN users
        ON (artists.artist_id=users.id)
        LEFT JOIN favorites on favorites.artist=artists.artist_id and favorites.sender_id=$1
        WHERE users.id > 198 AND users.id < 209
        group by users.id, artists.artist_id, artists.instrument, favorites.artist, favorites.is_favorite, favorites.sender_id, artists.created_at

        `;
    // ORDER BY RANDOM()

    return db.query(query, [id]).then((results) => {
        return results.rows;
    });
};

const getUsersByQuery = (id, search) => {
    const query = `
        SELECT  users.id, artists.artist_id, artists.instrument, ROUND(AVG(rating), 0) as art_rating, users.first, users.last, favorites.artist, favorites.sender_id, favorites.is_favorite, users.profile_picture_url
        FROM artists
        LEFT JOIN ratings
        on artists.artist_id=ratings.artist
        JOIN users
        ON (artists.artist_id=users.id)
        LEFT JOIN favorites on favorites.artist=artists.artist_id and favorites.sender_id=$1
        WHERE users.first ILIKE $2
        group by users.id, artists.artist_id, artists.instrument, favorites.artist, favorites.is_favorite, favorites.sender_id, artists.created_at
    `;
    // AND id not in($2)

    return db.query(query, [id, search + "%"]).then((results) => {
        return results.rows;
    });
};

const getOtherUserProfile = (id) => {
    const query = `
        SELECT users.first, users.last, users.profile_picture_url, artists.artist_id, artists.bio, artists.instrument,
        artists.youtube_link, artists.spotify_link, artists.tags  FROM users
        JOIN ARTISTS
        ON users.id= artists.artist_id
        WHERE users.id=$1
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows[0];
    });
};

const getFriendship = (userId, otherUserId) => {
    const query = `
        SELECT * FROM friendships
        WHERE (sender_id=$1 AND recipient_id=$2)
        OR (sender_id=$2 AND recipient_id=$1)
    `;

    const params = [userId, otherUserId];

    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const sendFriendship = (userId, otherUserId) => {
    const query = `
        INSERT INTO friendships(sender_id, recipient_id)
        VALUES ($1, $2)
        RETURNING *
    `;

    const params = [userId, otherUserId];

    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const getAllConversations = (id) => {
    const query = `
        SELECT users.id as userid, users.first, users.last, users.profile_picture_url,  messages.id, messages.sender_id, messages.recipient_id, messages.text, messages.created_at FROM messages
         JOIN users
        ON messages.sender_id=users.id or messages.recipient_id=users.id
         JOIN artists
        ON artists.artist_id=messages.recipient_id
        where (messages.sender_id=$1 or messages.recipient_id=$1)
        ORDER BY created_at DESC

    `;
    return db.query(query, [id]).then((results) => {
        const otherUsers = results.rows.filter((element) => {
            if (element.userid !== id) {
                return element;
            }
        });
        const uniqueIds = [];

        const unique = otherUsers.filter((element) => {
            const isDuplicate = uniqueIds.includes(element.userid);

            if (!isDuplicate) {
                uniqueIds.push(element.userid);

                return true;
            }

            return false;
        });
        return unique;
    });
};
// users.profile_picture_url, users.first, users.last,
const getAllMessages = (userId, otherUserId) => {
    const query = `
        SELECT users.id as userid,  messages.id, messages.sender_id, messages.recipient_id, messages.text, messages.created_at FROM messages
         JOIN users
        ON messages.sender_id=users.id or messages.recipient_id=users.id

        where (messages.sender_id=$1 and messages.recipient_id=$2) or (messages.sender_id=$2 and messages.recipient_id=$1)
        ORDER BY created_at DESC

    `;
    return db.query(query, [userId, otherUserId]).then((results) => {
        const uniqueIds = [];

        const unique = results.rows.filter((element) => {
            const isDuplicate = uniqueIds.includes(element.id);

            if (!isDuplicate) {
                uniqueIds.push(element.id);

                return true;
            }

            return false;
        });
        const reversedResults = [...unique].reverse();
        return reversedResults;
    });
};

// users.profile_picture_url,
const createNewMsg = (id, otherUserId, text) => {
    const query = `
        INSERT INTO messages(artist, sender_id, recipient_id, text)
        VALUES($2, $1, $2, $3)
        RETURNING *
    `;

    const params = [id, otherUserId, text];

    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const createNewMsgArtist = (id, otherUserId, text) => {
    const query = `
        INSERT INTO messages(artist, sender_id, recipient_id, text)
        VALUES($1, $1, $2, $3)
        RETURNING *
    `;

    const params = [id, otherUserId, text];

    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const isArtist = (id) => {
    const query = `
        SELECT * FROM artists
        WHERE artist_id=$1
    `;

    const params = [id];

    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const getUsersByIds = (ids) => {
    return db
        .query(`SELECT * FROM users WHERE id = ANY($1)`, [ids])
        .then((results) => {
            return results.rows;
        });
};

const newArtistRequest = (otherUserId, userId, text) => {
    const query = `
    INSERT INTO messages(artist, sender_id, recipient_id, text)
    VALUES ($1, $2, $1, $3)
    RETURNING *
`;

    const params = [otherUserId, userId, text];

    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const getTagsBySearch = (search) => {
    const query = `
    SELECT DISTINCT ON (tag) * from TAGS
    WHERE tag ILIKE $1`;

    return db.query(query, [search + "%"]).then((results) => {
        return results.rows;
    });
};

const addTagInTagsTable = (id, tag) => {
    const query = `
    INSERT INTO tags (artist_id, tag)
    VALUES ($1, $2)
    RETURNING *
    `;

    return db.query(query, [id, tag]).then((results) => {
        return results.rows;
    });
};

const getAllTags = () => {
    const query = `
    SELECT  tag, count(tag) AS amount_tags
    FROM tags
    GROUP BY tag
    ORDER BY amount_tags DESC;

    `;

    return db.query(query).then((results) => {
        return results.rows;
    });
};

const getArtistsByTag = (userId, tag) => {
    const query = `
    SELECT  tags.tag, tags.artist_id, users.id, artists.artist_id, artists.instrument, ROUND(AVG(rating), 0) as art_rating, users.first, users.last, favorites.artist, favorites.sender_id, favorites.is_favorite, users.profile_picture_url
        FROM tags
        JOIN artists
        ON artists.artist_id = tags.artist_id
        JOIN users
        ON (artists.artist_id=users.id)
        LEFT JOIN ratings
        ON artists.artist_id=ratings.artist
        LEFT JOIN favorites on favorites.artist=artists.artist_id and favorites.sender_id=$1
        WHERE tag=$2
        group by  tags.id, users.id,  artists.artist_id, artists.instrument, favorites.artist, favorites.is_favorite, favorites.sender_id
    `;

    return db.query(query, [userId, tag]).then((results) => {
        return results.rows;
    });
};

const getArtistsBySimilarTag = (userId, tag) => {
    const query = `
    SELECT  tags.tag, tags.artist_id, users.id, artists.artist_id, artists.instrument, ROUND(AVG(rating), 0) as art_rating, users.first, users.last, favorites.artist, favorites.sender_id, favorites.is_favorite, users.profile_picture_url
        FROM tags
        JOIN artists
        ON artists.artist_id = tags.artist_id
        JOIN users
        ON (artists.artist_id=users.id)
        LEFT JOIN ratings
        ON artists.artist_id=ratings.artist
        LEFT JOIN favorites on favorites.artist=artists.artist_id and favorites.sender_id=$1
        WHERE tag=any(array$2)
        group by  tags.id, users.id,  artists.artist_id, artists.instrument, favorites.artist, favorites.is_favorite, favorites.sender_id
    `;

    return db.query(query, [userId, tag]).then((results) => {
        return results.rows;
    });
};

const requestSent = (id, otherUserId) => {
    const query = `
    SELECT  DISTINCT ON (sender_id) * FROM messages
    WHERE sender_id=$1 AND recipient_id=$2
    `;

    return db.query(query, [id, otherUserId]).then((results) => {
        return results.rows;
    });
};

const getFavorites = (id) => {
    const query = `
    SELECT users.first, users.last, favorites.sender_id,  favorites.is_favorite, artists.instrument, ROUND(AVG(rating), 0) as art_rating, users.profile_picture_url, artists.artist_id as id, artists.tags FROM favorites
    JOIN artists
    ON artists.artist_id = favorites.artist
    LEFT JOIN ratings
        ON artists.artist_id=ratings.artist
    JOIN users
    ON artists.artist_id = users.id
    WHERE sender_id=$1
     group by users.id, artists.artist_id, favorites.artist, artists.tags, favorites.is_favorite, favorites.sender_id, artists.instrument
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows;
    });
};

const getFavoriteState = (id, otherUserId) => {
    const query = `
    SELECT * FROM favorites
    WHERE sender_id=$1 AND artist=$2
    `;

    return db.query(query, [id, otherUserId]).then((results) => {
        return results.rows;
    });
};

const addFavorite = (id, otherUserId) => {
    const query = `
    INSERT INTO favorites (sender_id, artist, is_favorite)
    VALUES ($1, $2, true)
    RETURNING *
    `;

    return db.query(query, [id, otherUserId]).then((results) => {
        return results.rows;
    });
};

const removeFavorite = (id, otherUserId) => {
    const query = `
    DELETE FROM favorites
    WHERE sender_id=$1 AND artist=$2
    RETURNING *
    `;

    return db.query(query, [id, otherUserId]).then((results) => {
        return results.rows;
    });
};

const getRatingById = (id) => {
    const query = `
        SELECT artist, ROUND(AVG(rating), 0) FROM ratings
        WHERE artist=$1
        GROUP BY artist
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows[0];
    });
};

const addRatingById = (id, otherUserId, text, rating) => {
    const query = `
        INSERT INTO ratings(rater_id, artist, comments, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    return db.query(query, [id, otherUserId, text, rating]).then((results) => {
        return results.rows[0];
    });
};

const getUnreadMsgs = (id) => {
    const query = `
        SELECT COUNT(*) FROM messages
        WHERE recipient_id=$1 AND is_read is not true
    `;

    return db.query(query, [id]).then((results) => {
        console.log("resultadinhos", results.rows);
        return results.rows;
    });
};

const setReadMsgs = (id, otherUserId) => {
    const query = `
        UPDATE messages
        SET is_read=true
        WHERE recipient_id=$1 AND sender_id=$2
        RETURNING *
    `;

    return db.query(query, [id, otherUserId]).then((results) => {
        return results.rows;
    });
};

module.exports = {
    createUser,
    login,
    reset,
    setNewPass,
    getUserByCode,
    getUserById,
    uploadProfilePic,
    updateBio,
    getLatestUsers,
    getUsersByQuery,
    getOtherUserProfile,
    getFriendship,
    sendFriendship,
    createArtistProfile,
    getAllConversations,
    getAllMessages,
    createNewMsg,
    createNewMsgArtist,
    getUsersByIds,
    newArtistRequest,
    isArtist,
    getTagsBySearch,
    addTagInTagsTable,
    getUserArtistById,
    deleteTagsByUpdate,
    getAllTags,
    getArtistsByTag,
    requestSent,
    addFavorite,
    getFavoriteState,
    removeFavorite,
    getFavorites,
    insertTags,
    getRatingById,
    addRatingById,
    getUnreadMsgs,
    setReadMsgs,
    getFeaturedUsers,
    getArtistsBySimilarTag,
};
