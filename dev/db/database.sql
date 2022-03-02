CREATE TABLE language(
  ISO639_1 VARCHAR(2) PRIMARY KEY,
  language_name VARCHAR(50) NOT NULL
);

CREATE TABLE movie (
  movie_id BIGINT PRIMARY KEY UNIQUE,
  title VARCHAR(255) NOT NULL,
  overview VARCHAR(1000),
  runtime INT, -- lets keep it Timestamp atm, we can later change it to something else in the future
  popularity float8,
  adult BOOLEAN,
  status VARCHAR(50), -- remove it later
  release_date TIMESTAMP, -- same, might chage the datatype later
  budget BIGINT,
  revenue BIGINT,
  ISO639_1 VARCHAR(2) REFERENCES language(ISO639_1), -- can we use a dash in the field name?
  poster_path VARCHAR(100),
  backdrop_path VARCHAR(100)
);

CREATE TABLE movieTag (
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY(movie_id, tag)
);

CREATE TABLE movieTmdb(
  movie_id BIGINT REFERENCES movie(movie_id) PRIMARY KEY,
  tmdb_id INT
);

CREATE TABLE movieTranslation(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  ISO639_1 VARCHAR(2) REFERENCES language(ISO639_1) NOT NULL,
  PRIMARY KEY(movie_id, ISO639_1)
);

CREATE TABLE personalityData(
  user_id VARCHAR(100) PRIMARY KEY,
  openness float8 NOT NULL,
  agreeableness float8 NOT NULL,
  emotional_stability float8 NOT NULL,
  consientiousness float8 NOT NULL,
  extraversion float8 NOT NULL
);

CREATE TABLE rating(
  user_id VARCHAR(100) REFERENCES personalityData(user_id) NOT NULL,
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  rating float8 NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY(user_id, movie_id)
);

CREATE TABLE actor(
  actor_id INT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50)
);

CREATE TABLE movieActor(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  actor_id INT REFERENCES actor(actor_id) NOT NULL,
  PRIMARY KEY(movie_id, actor_id)
);

CREATE TABLE publisher(
  publisher_id INT PRIMARY KEY,
  publishing_company VARCHAR(100) NOT NULL,
  publishing_country VARCHAR(100)
);

CREATE TABLE moviePublisher(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  publisher_id INT REFERENCES publisher(publisher_id) NOT NULL,
  PRIMARY KEY(movie_id, publisher_id)
);

CREATE TABLE movieGenre(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  PRIMARY KEY(movie_id, genre)
);

