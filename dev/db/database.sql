CREATE TABLE language(
  ISO639_1 VARCHAR(2) PRIMARY KEY,
  language_name VARCHAR(50) NOT NULL
);

CREATE TABLE movie (
  movie_id BIGINT PRIMARY KEY UNIQUE,
  title VARCHAR(255) NOT NULL,
  overview VARCHAR(1000),
  runtime INT,
  average_rating float8,
  imdb_score VARCHAR(6),
  rotten_score VARCHAR(4),
  metacritic_score VARCHAR(7),
  awards VARCHAR(1000),
  popularity float8,
  polarity float8,
  adult BOOLEAN,
  status VARCHAR(50),
  release_date TIMESTAMP,
  budget BIGINT,
  revenue BIGINT,
  ISO639_1 VARCHAR(2) REFERENCES language(ISO639_1),
  poster_path VARCHAR(100),
  backdrop_path VARCHAR(100)
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

CREATE TABLE predictedMovieRating(
  movie_id BIGINT REFERENCES movie(movie_id) PRIMARY KEY,
  predicted_rating float8 NOT NULL
);

CREATE TABLE predictedPersonalityRatings(
  movie_id BIGINT REFERENCES movie(movie_id) PRIMARY KEY,
  pred_open float8 NOT NULL,
  pred_agreeable float8 NOT NULL,
  pred_emotionally_stable float8 NOT NULL,
  pred_conscientious float8 NOT NULL,
  pred_extrovert float8 NOT NULL
);

CREATE TABLE predictedPersonalityTraits(
  movie_id BIGINT REFERENCES movie(movie_id) PRIMARY KEY,
  openness VARCHAR(1),
  agreeableness VARCHAR(1),
  emotional_stability VARCHAR(1),
  conscientiousness VARCHAR(1),
  extraversion VARCHAR(1)
);

CREATE TABLE tag(
  tag_id BIGINT PRIMARY KEY UNIQUE,
  tag VARCHAR(100)
);

CREATE TABLE tagPersonalities(
  tag_id BIGINT REFERENCES tag(tag_id) PRIMARY KEY,
  agg_openness BIGINT NOT NULL,
  agg_agreeableness BIGINT NOT NULL,
  agg_emotional_stability BIGINT NOT NULL,
  agg_conscientiousness BIGINT NOT NULL,
  agg_extraversion BIGINT NOT NULL
);

CREATE TABLE movieTag (
  movie_id BIGINT REFERENCES movie(movie_id) NOT NULL,
  tag_id BIGINT REFERENCES tag(tag_id) NOT NULL,
  PRIMARY KEY(movie_id, tag_id)
);
