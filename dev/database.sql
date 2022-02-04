CREATE TABLE movie (
  movie_id BIGINT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  overview VARCHAR(1000) NOT NULL,
  runtime TIMESTAMP NOT NULL, -- lets keep it Timestamp atm, we can later change it to something else in the future
  popularity float8 NOT NULL,
  adult BOOLEAN NOT NULL,
  status VARCHAR(10) NOT NULL,
  release_date TIMESTAMP NOT NULL, -- same, might chage the datatype later
  budget BIGINT NOT NULL,
  revenue BIGINT NOT NULL,
  ISO639_1 VARCHAR(2) REFERENCES language(ISO639_1) NOT NULL,-- can we use a dash in the field name?
  poster_path VARCHAR(100) NOT NULL
);


CREATE TABLE movie_tag (
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY(movie_id, tag)
);

CREATE TABLE movie_tmdb(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  tmdb_id INT NOT NULL,
  PRIMARY KEY(movie_id, tmdb_id)
);


CREATE TABLE movie_translation(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  ISO639_1 VARCHAR(2) NOT NULL,
  PRIMARY KEY(movie_id, ISO639_1)
);

CREATE TABLE language(
  ISO639_1 VARCHAR(2) REFERENCES movie_translation(ISO639_1) NOT NULL,
  language_name VARCHAR(20) NOT NULL,
  PRIMARY KEY(ISO639_1)
);


CREATE TABLE personality_data(
  user_id BIGINT PRIMARY KEY,
  openness float8 NOT NULL,
  agreeableness float8 NOT NULL,
  emotional_stability float8 NOT NULL,
  consientiousness float8 NOT NULL,
  extraversion float8 NOT NULL
);


CREATE TABLE rating(
  user_id BIGINT REFERENCES personality_data(user_id) NOT NULL,
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  rating float8 NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY(user_id, movie_id)
);


CREATE TABLE movie_actor(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  actor_id INT REFERENCES actor(actor_id) NOT NULL,
  PRIMARY KEY(movie_id, actor_id)
);

CREATE TABLE actor(
  actor_id INT PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL
);

CREATE TABLE publisher(
  publisher_id INT PRIMARY KEY,
  publishing_company VARCHAR(50) NOT NULL,
  publishing_country VARCHAR(50) NOT NULL
);

CREATE TABLE movie_publisher(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  publisher_id INT REFERENCES publisher(publisher_id) NOT NULL,
  PRIMARY KEY(movie_id, publisher_id)
);

CREATE TABLE movie_genre(
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  genre VARCHAR(20) NOT NULL,
  PRIMARY KEY(movie_id, genre)
);

