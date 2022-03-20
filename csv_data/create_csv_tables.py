import asyncio
import csv
import platform

import aiohttp


API_KEY = "673a60b2dc1f76450ef8d5eaf431c189"

movie_tmdb_id = {}
with open("ml-latest-small/links.csv", encoding="utf-8") as ml_links_csv:
    ml_links_reader = csv.reader(ml_links_csv)
    next(ml_links_reader, None)  # Skip header
    for movie_id, _, tmdb_id in ml_links_reader:
        movie_tmdb_id[movie_id] = tmdb_id

tag_ids = {}
with open("ml-latest-small/tags.csv", encoding="utf-8") as ml_tags_csv:
    ml_tags_reader = csv.reader(ml_tags_csv)
    next(ml_tags_reader, None)  # Skip header
    tag_id = 0
    for _, _, tag, _ in ml_tags_reader:
        if tag.lower() not in tag_ids:
            tag_ids[tag.lower()] = tag_id
            tag_id += 1

avg_movie_ratings = {}
with open("tables/AverageMovieRatings.csv", encoding="utf-8") as avg_movie_ratings_csv:
    avg_movie_ratings_reader = csv.reader(avg_movie_ratings_csv)
    for movie_id, avg_rating in avg_movie_ratings_reader:
        avg_movie_ratings[movie_id] = avg_rating

movie_polarities = {}
with open("tables/MoviePolarity.csv", encoding="utf-8") as movie_polarity_csv:
    movie_polarity_reader = csv.reader(movie_polarity_csv)
    for movie_id, polarity in movie_polarity_reader:
        movie_polarities[movie_id] = polarity


movie_reactions = {}
with open("tables/MovieReactions.csv", encoding="utf-8") as movie_reactions_csv:
    movie_reactions_reader = csv.reader(movie_reactions_csv)
    for movie_id, imdb_score, rotten_score, metacritic_score, awards in movie_reactions_reader:
        # if imdb_score:
        #     imdb_score = float(imdb_score.split("/")[0])
        # if rotten_score:
        #     rotten_score = float(rotten_score[:-1]) / 10
        # if metacritic_score:
        #     metacritic_score = float(metacritic_score.split("/")[0]) / 10
        movie_reactions[movie_id] = {
            "imdb_score": imdb_score,
            "rotten_score": rotten_score,
            "metacritic_score": metacritic_score,
            "awards": awards
        }


async def create_movie_csv(session):
    movie_ids = set()

    async def write_movie(session, movie_writer, id, name):
        response = await request_tmdb_movie(session, movie_tmdb_id[id])
        movie_writer.writerow([
            id,
            response.get("original_title", name),
            response.get("overview"),
            response.get("runtime"),
            avg_movie_ratings.get(id),
            movie_reactions.get(id).get("imdb_score"),
            movie_reactions.get(id).get("rotten_score"),
            movie_reactions.get(id).get("metacritic_score"),
            movie_reactions.get(id).get("awards"),
            response.get("popularity"),
            movie_polarities.get(id),
            response.get("adult"),
            response.get("status"),
            response.get("release_date"),
            response.get("budget"),
            response.get("revenue"),
            response.get("original_language"),
            response.get("poster_path"),
            response.get("backdrop_path")
        ])
        movie_ids.add(id)

    with open("tables/Movie.csv", "w", newline="", encoding="utf-8") as movie_csv:
        movie_writer = csv.writer(movie_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_movie(session, movie_writer, id, name) for id, name, _ in ml_movies_reader])
            print("<---- Completed writing Movie.csv ---->", flush=True)
    return movie_ids


async def create_actor_csv(session):
    actor_id = 0

    async def write_actor(session, actor_writer, movie_actor_writer, id):
        nonlocal actor_id
        response = await request_tmdb_credits(session, movie_tmdb_id[id])
        for actor in response.get("cast", []):
            names = actor["name"].split(maxsplit=1)
            first_name = names[0]
            surname = names[1] if len(names) > 1 else ""
            movie_actor_writer.writerow([id, actor_id])
            actor_writer.writerow([actor_id, first_name, surname])
            actor_id += 1

    with open("tables/Actor.csv", "w", newline="", encoding="utf-8") as actor_csv, \
            open("tables/MovieActor.csv", "w", newline="", encoding="utf-8") as movie_actor_csv:
        actor_writer = csv.writer(actor_csv)
        movie_actor_writer = csv.writer(movie_actor_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_actor(session, actor_writer, movie_actor_writer, id) for id, _, _ in ml_movies_reader])
            print("<---- Completed writing Actor.csv and MovieActor.csv ---->", flush=True)


def create_genre_csv():
    with open("tables/MovieGenre.csv", "w", newline="", encoding="utf-8") as movie_genre_csv:
        movie_genre_writer = csv.writer(movie_genre_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            for id, _, genres in ml_movies_reader:
                for genre in genres.split("|"):
                    movie_genre_writer.writerow([id, genre])
            print("<---- Completed writing MovieGenre.csv ---->", flush=True)


def create_tag_csv():
    with open("tables/Tag.csv", "w", newline="", encoding="utf-8") as tag_csv:
        tag_writer = csv.writer(tag_csv)
        for tag, tag_id in tag_ids.items():
            tag_writer.writerow([tag_id, tag])
        print("<---- Completed writing Tag.csv ---->", flush=True)


def create_movie_tag_csv():
    existing_movie_tags = set()
    with open("tables/MovieTag.csv", "w", newline="", encoding="utf-8") as movie_tag_csv:
        movie_tag_writer = csv.writer(movie_tag_csv)
        with open("ml-latest-small/tags.csv", encoding="utf-8") as ml_tags_csv:
            ml_tags_reader = csv.reader(ml_tags_csv)
            next(ml_tags_reader, None)  # Skip header
            for _, id, tag, _ in ml_tags_reader:
                tag_id = tag_ids[tag.lower()]
                if (id, tag_id) not in existing_movie_tags:
                    movie_tag_writer.writerow([id, tag_id])
                    existing_movie_tags.add((id, tag_id))
            print("<---- Completed writing MovieTag.csv ---->", flush=True)


async def create_language_csv(session):
    language_isos = set()
    with open("tables/Language.csv", "w", newline="", encoding="utf-8") as language_csv:
        language_writer = csv.writer(language_csv)
        languages = await request_tmdb_languages(session)
        for language in languages:
            language_writer.writerow([language["iso_639_1"], language["english_name"]])
            language_isos.add(language["iso_639_1"])
        print("<---- Completed writing Language.csv ---->", flush=True)
    return language_isos


async def create_translation_csv(session, language_isos):
    async def write_translation(session, language_isos, movie_translation_writer, id):
        existing_translations = set()
        response = await request_tmdb_translations(session, movie_tmdb_id[id])
        for translation in response.get("translations", []):
            iso = translation.get("iso_639_1")
            if iso in language_isos and iso not in existing_translations:
                movie_translation_writer.writerow([
                    id,
                    iso,
                ])
                existing_translations.add(iso)

    with open("tables/MovieTranslation.csv", "w", newline="", encoding="utf-8") as movie_translation_csv:
        movie_translation_writer = csv.writer(movie_translation_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_translation(session, language_isos, movie_translation_writer, id) for id, _, _ in ml_movies_reader])
            print("<---- Completed writing MovieTranslation.csv ---->", flush=True)


def create_rating_csv(movie_ids):
    existing_ratings = set()

    with open("tables/Rating.csv", "w", newline="", encoding="utf-8") as rating_csv:
        rating_writer = csv.writer(rating_csv)
        with open("ml-latest-small/ratings.csv", encoding="utf-8") as ml_ratings_csv:
            ml_ratings_reader = csv.reader(ml_ratings_csv)
            next(ml_ratings_reader, None)  # Skip header
            for user_id, movie_id, rating, timestamp in ml_ratings_reader:
                user_id = user_id.strip()
                movie_id = movie_id.strip()
                if movie_id in movie_ids and (user_id, movie_id) not in existing_ratings:
                    rating_writer.writerow([
                        user_id,
                        movie_id,
                        rating.strip(),
                        timestamp.strip()
                    ])
                    existing_ratings.add((user_id, movie_id))
            print("<---- Completed writing Rating.csv ---->", flush=True)


def create_personality_data_csv():
    existing_users = set()

    with open("tables/PersonalityData.csv", "w", newline="", encoding="utf-8") as personality_csv:
        personality_writer = csv.writer(personality_csv)
        with open("ml-latest-small/personality-data.csv", encoding="utf-8") as ml_personality_csv:
            ml_personality_reader = csv.reader(ml_personality_csv)
            next(ml_personality_reader, None)  # Skip header
            for user_id, openness, agreeableness, emotional_stability, conscientiousness, extraversion, *_ in ml_personality_reader:
                user_id = user_id.strip()
                if user_id not in existing_users:
                    personality_writer.writerow([
                        user_id,
                        openness.strip(),
                        agreeableness.strip(),
                        emotional_stability.strip(),
                        conscientiousness.strip(),
                        extraversion.strip()
                    ])
                    existing_users.add(user_id)
            print("<---- Completed writing PersonalityData.csv ---->", flush=True)


async def create_publisher_csv(session):
    existing_publishers = set()

    async def write_actor(session, publisher_writer, movie_publisher_wrtier, id):
        response = await request_tmdb_movie(session, movie_tmdb_id[id])
        for publisher in response.get("production_companies", []):
            movie_publisher_wrtier.writerow([id, publisher["id"]])
            if publisher["id"] not in existing_publishers:
                publisher_writer.writerow([publisher["id"], publisher["name"], publisher["origin_country"]])
                existing_publishers.add(publisher["id"])
    
    with open("tables/Publisher.csv", "w", newline="", encoding="utf-8") as publisher_csv, \
            open("tables/MoviePublisher.csv", "w", newline="", encoding="utf-8") as movie_publisher_csv:
        publisher_writer = csv.writer(publisher_csv)
        movie_publisher_wrtier = csv.writer(movie_publisher_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_actor(session, publisher_writer, movie_publisher_wrtier, id) for id, _, _ in ml_movies_reader])
            print("<---- Completed writing Publisher.csv and MoviePublisher.csv ---->", flush=True)


def create_movie_tmdb_csv():
    with open("tables/MovieTmdb.csv", "w", newline="", encoding="utf-8") as movie_tmdb_csv:
        movie_tmdb_writer = csv.writer(movie_tmdb_csv)
        with open("ml-latest-small/links.csv", encoding="utf-8") as ml_links_csv:
            ml_links_reader = csv.reader(ml_links_csv)
            next(ml_links_reader, None)  # Skip header
            for movie_id, _, tmdb_id in ml_links_reader:
                movie_tmdb_writer.writerow([movie_id, tmdb_id])
            print("<---- Completed writing MovieTmdb.csv ---->", flush=True)


async def request_tmdb_movie(session, id):
    async with session.get(f"/3/movie/{id}?api_key={API_KEY}") as response:
        return await response.json()


async def request_tmdb_credits(session, id):
    async with session.get(f"/3/movie/{id}/credits?api_key={API_KEY}") as response:
        return await response.json()


async def request_tmdb_languages(session):
    async with session.get(f"/3/configuration/languages?api_key={API_KEY}") as response:
        return await response.json()


async def request_tmdb_translations(session, id):
    async with session.get(f"/3/movie/{id}/translations?api_key={API_KEY}") as response:
        return await response.json()


async def main():
    async with aiohttp.ClientSession("https://api.themoviedb.org") as session:
        movie_ids = await create_movie_csv(session)
        await create_actor_csv(session)
        create_genre_csv()
        create_tag_csv()
        create_movie_tag_csv()
        language_isos = await create_language_csv(session)
        await create_translation_csv(session, language_isos)
        create_rating_csv(movie_ids)
        create_personality_data_csv()
        await create_publisher_csv(session)
        create_movie_tmdb_csv()


if __name__ == "__main__":
    if platform.system() == "Windows":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
