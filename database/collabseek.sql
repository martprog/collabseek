DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS gencodes;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS favorites;




CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL CHECK (first != ''),
     last VARCHAR NOT NULL CHECK (last != ''),
     email VARCHAR(50) NOT NULL UNIQUE,
     profile_picture_url VARCHAR,
     password_hash   VARCHAR NOT NULL,
     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE gencodes (
     id SERIAL PRIMARY KEY,
     email VARCHAR(50) NOT NULL,
     code VARCHAR(6) NOT NULL,
     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
     id SERIAL PRIMARY KEY,
     artist_id INT REFERENCES users(id) UNIQUE NOT NULL,
     bio TEXT,
     youtube_link VARCHAR,
     spotify_link VARCHAR,
     instagram_link VARCHAR,
     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tags (
     id SERIAL PRIMARY KEY,
     artist_id INT REFERENCES artists(artist_id) NOT NULL,
     tag text
);

CREATE TABLE messages (
     id SERIAL PRIMARY KEY,
     artist INT REFERENCES artists(artist_id) NOT NULL,
     sender_id INT REFERENCES users(id) NOT NULL,
     recipient_id INT REFERENCES users(id) NOT NULL,
     text TEXT,
     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
     id SERIAL PRIMARY KEY,
     sender_id INT REFERENCES users(id) NOT NULL,
     artist INT REFERENCES artists(artist_id) NOT NULL,
     is_favorite BOOLEAN 
);

CREATE TABLE ratings (
     id SERIAL PRIMARY KEY,
     rater_id INT REFERENCES users(id) NOT NULL, 
     artist INT REFERENCES artists(artist_id) NOT NULL,
     comments TEXT,
     rating INT  
);

