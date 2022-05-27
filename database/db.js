const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/collabseek");
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
        return db.query(query, params).then((results) => {
            return results.rows[0];
        });
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
    console.log("prueba:", email, password);
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

const updateBio = (bio, id) => {
    const query = `
        UPDATE users
        SET bio=$1
        WHERE id=$2
        RETURNING *
    `;

    return db.query(query, [bio, id]).then((results) => {
        return results.rows[0];
    });
};

const createArtistProfile = (artist_id, bio, youtube_link, spotify_link) => {
    const query = `
            INSERT INTO artists (artist_id, bio, youtube_link, spotify_link)
            VALUES($1, $2, $3, $4)
            RETURNING *
            `;
    const params = [artist_id, bio, youtube_link, spotify_link];
    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const getLatestUsers = () => {
    const query = `
        SELECT users.id, users.first, users.last, users.profile_picture_url FROM artists
        JOIN users
        ON (artists.artist_id=users.id)
        ORDER BY artists.created_at DESC
        LIMIT 3
    `;

    return db.query(query).then((results) => {
        return results.rows;
    });
};

const getUsersByQuery = (search) => {
    const query = `
        SELECT * FROM  USERS
        WHERE first ILIKE $1 
    `;
        // AND id not in($2)

    return db.query(query, [search + "%"]).then((results) => {
        return results.rows;
    });
};

const getOtherUserProfile = (id) => {
    const query = `
        SELECT * FROM users
        WHERE id=$1
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

const getAllMessages = (userId, otherUserId) => {
    const query = `
        SELECT users.id as userid, users.first, users.last, users.profile_picture_url,  messages.id, messages.sender_id, messages.recipient_id, messages.text, messages.created_at FROM messages
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

const getTagsBySearch = (search) =>{
    const query = `
    SELECT * from TAGS 
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

    return db.query(query, [tag]).then((results) => {
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
    addTagInTagsTable
};
