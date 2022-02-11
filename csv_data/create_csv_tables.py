import aiohttp
import asyncio
import csv


API_KEY = "673a60b2dc1f76450ef8d5eaf431c189"

movie_tmdb_id = {}
with open("ml-latest-small/links.csv", encoding="utf-8") as ml_links_csv:
    ml_links_reader = csv.reader(ml_links_csv)
    next(ml_links_reader, None)  # Skip header
    for movie_id, _, tmdb_id in ml_links_reader:
        movie_tmdb_id[movie_id] = tmdb_id


async def create_movie_csv(session):
    async def write_movie(session, movie_writer, id, name):
        response = await request_tmdb_movie(session, movie_tmdb_id[id])
        movie_writer.writerow([
            id,
            name,
            response.get("overview"),
            response.get("runtime"),
            response.get("popularity"),
            response.get("adult"),
            response.get("status"),
            response.get("release_date"),
            response.get("budget"),
            response.get("revenue"),
            response.get("original_language"),
            response.get("poster_path")
        ])

    with open("Movie.csv", "w", newline="", encoding="utf-8") as movie_csv:
        movie_writer = csv.writer(movie_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_movie(session, movie_writer, id, name) for id, name, _ in ml_movies_reader])
            print("<---- Completed writing Movie.csv ---->")


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

    with open("Actor.csv", "w", newline="", encoding="utf-8") as actor_csv, \
            open("MovieActor.csv", "w", newline="", encoding="utf-8") as movie_actor_csv:
        actor_writer = csv.writer(actor_csv)
        movie_actor_writer = csv.writer(movie_actor_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_actor(session, actor_writer, movie_actor_writer, id) for id, _, _ in ml_movies_reader])
            print("<---- Completed writing Actor.csv and MovieActor.csv ---->")


def create_genre_csv():
    with open("MovieGenre.csv", "w", newline="", encoding="utf-8") as movie_genre_csv:
        movie_genre_writer = csv.writer(movie_genre_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            for id, _, genres in ml_movies_reader:
                for genre in genres.split("|"):
                    movie_genre_writer.writerow([id, genre])
            print("<---- Completed writing MovieGenre.csv ---->")


def create_tag_csv():
    with open("MovieTag.csv", "w", newline="", encoding="utf-8") as movie_tag_csv:
        movie_tag_writer = csv.writer(movie_tag_csv)
        with open("ml-latest-small/tags.csv", encoding="utf-8") as ml_tags_csv:
            ml_tags_reader = csv.reader(ml_tags_csv)
            next(ml_tags_reader, None)  # Skip header
            for _, id, tag, _ in ml_tags_reader:
                movie_tag_writer.writerow([id, tag])
            print("<---- Completed writing MovieTag.csv ---->")


async def create_language_csv(session):
    with open("Language.csv", "w", newline="", encoding="utf-8") as language_csv:
        language_writer = csv.writer(language_csv)
        languages = await request_tmdb_languages(session)
        for language in languages:
            language_writer.writerow([language["iso_639_1"], language["english_name"]])
        print("<---- Completed writing Language.csv ---->")


async def create_translation_csv(session):
    async def write_translation(session, movie_translation_writer, id):
        response = await request_tmdb_translations(session, movie_tmdb_id[id])
        for translation in response.get("translations", []):
            movie_translation_writer.writerow([
                id,
                translation.get("iso_639_1"),
            ])

    with open("MovieTranslation.csv", "w", newline="", encoding="utf-8") as movie_translation_csv:
        movie_translation_writer = csv.writer(movie_translation_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_translation(session, movie_translation_writer, id) for id, _, _ in ml_movies_reader])
            print("<---- Completed writing MovieTranslation.csv ---->")


def create_rating_csv():
    with open("Rating.csv", "w", newline="", encoding="utf-8") as rating_csv:
        rating_writer = csv.writer(rating_csv)
        with open("ml-latest-small/ratings.csv", encoding="utf-8") as ml_ratings_csv:
            ml_ratings_reader = csv.reader(ml_ratings_csv)
            next(ml_ratings_reader, None)  # Skip header
            for user_id, movie_id, rating, timestamp in ml_ratings_reader:
                rating_writer.writerow([
                    user_id.strip(),
                    movie_id.strip(),
                    rating.strip(),
                    timestamp.strip()
                ])
            print("<---- Completed writing Rating.csv ---->")


def create_personality_data_csv():
    with open("PersonalityData.csv", "w", newline="", encoding="utf-8") as personality_csv:
        personality_writer = csv.writer(personality_csv)
        with open("ml-latest-small/personality-data.csv", encoding="utf-8") as ml_personality_csv:
            ml_personality_reader = csv.reader(ml_personality_csv)
            next(ml_personality_reader, None)  # Skip header
            for user_id, openness, agreeableness, emotional_stability, conscientiousness, extraversion, *_ in ml_personality_reader:
                personality_writer.writerow([
                    user_id.strip(),
                    openness.strip(),
                    agreeableness.strip(),
                    emotional_stability.strip(),
                    conscientiousness.strip(),
                    extraversion.strip()
                ])
            print("<---- Completed writing PersonalityData.csv ---->")


async def create_publisher_csv(session):
    async def write_actor(session, publisher_writer, movie_publisher_wrtier, id):
        response = await request_tmdb_movie(session, movie_tmdb_id[id])
        for publisher in response.get("production_companies", []):
            movie_publisher_wrtier.writerow([id, publisher["id"]])
            publisher_writer.writerow([publisher["id"], publisher["name"], publisher["origin_country"]])
    
    with open("Publisher.csv", "w", newline="", encoding="utf-8") as publisher_csv, \
            open("MoviePublisher.csv", "w", newline="", encoding="utf-8") as movie_publisher_csv:
        publisher_writer = csv.writer(publisher_csv)
        movie_publisher_wrtier = csv.writer(movie_publisher_csv)
        with open("ml-latest-small/movies.csv", encoding="utf-8") as ml_movies_csv:
            ml_movies_reader = csv.reader(ml_movies_csv)
            next(ml_movies_reader, None)  # Skip header
            await asyncio.gather(*[write_actor(session, publisher_writer, movie_publisher_wrtier, id) for id, _, _ in ml_movies_reader])
            print("<---- Completed writing Publisher.csv and MoviePublisher.csv ---->")


def create_movie_tmdb_csv():
    with open("MovieTmdb.csv", "w", newline="", encoding="utf-8") as movie_tmdb_csv:
        movie_tmdb_writer = csv.writer(movie_tmdb_csv)
        with open("ml-latest-small/links.csv", encoding="utf-8") as ml_links_csv:
            ml_links_reader = csv.reader(ml_links_csv)
            next(ml_links_reader, None)  # Skip header
            for movie_id, _, tmdb_id in ml_links_reader:
                movie_tmdb_writer.writerow([movie_id, tmdb_id])
            print("<---- Completed writing MovieTmdb.csv ---->")


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
        await create_movie_csv(session)
        await create_actor_csv(session)
        create_genre_csv()
        create_tag_csv()
        await create_language_csv(session)
        await create_translation_csv(session)
        create_rating_csv()
        create_personality_data_csv()
        await create_publisher_csv(session)
        create_movie_tmdb_csv()


if __name__ == "__main__":
    # asyncio.run(main())
    asyncio.get_event_loop().run_until_complete(main())
