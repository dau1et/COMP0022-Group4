import aioredis
import json
import datetime
import os
from typing import Literal

import asyncpg
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from app.query import QueryBuilder

app = FastAPI()

provider = TracerProvider(resource=Resource.create(
    {SERVICE_NAME: os.environ.get("JAEGER_SERVICE_NAME")}))
exporter = JaegerExporter(agent_host_name=os.environ.get(
    "JAEGER_AGENT_HOST"), agent_port=int(os.environ.get("JAEGER_AGENT_PORT")))
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)

FastAPIInstrumentor.instrument_app(app)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SortDirection = Literal["ASC", "DESC"]

SortFields = Literal[
    "title",
    "runtime",
    "average_rating",
    "popularity",
    "polarity",
    "release_date",
    "budget",
    "revenue"
]

MOVIE_COLUMNS = [
    "movie_id",
    "title",
    "overview",
    "runtime",
    "average_rating",
    "imdb_score",
    "rotten_score",
    "metacritic_score",
    "awards",
    "popularity",
    "polarity",
    "adult",
    "status",
    "release_date",
    "budget",
    "revenue",
    "iso639_1",
    "poster_path",
    "backdrop_path",
]

MOVIE_GENRES = [
    "Drama",
    "IMAX",
    "Film-Noir",
    "Action",
    "Children",
    "Adventure",
    "Sci-Fi",
    "Documentary",
    "Western",
    "Crime",
    "Comedy",
    "Thriller",
    "Musical",
    "Animation",
    "War",
    "Mystery",
    "Fantasy",
    "Horror",
    "Romance"
]


async def redis_cache(redis, key, db_query):

    value = await redis.get(key)

    if value:
        return json.loads(value)

    def serialize_dates(v):
        return v.isoformat()

    if key == "DBCACHE_GET_ALL_LANGUAGES" or key == "DBCACHE_GET_ALL_MOVIES":

        async with app.state.conn_pool.acquire() as conn:
            records = await conn.fetch(db_query)

        await redis.set(
            key,
            json.dumps([dict(record)
                       for record in records], default=serialize_dates),
            # timeout=2
        )
        print(f"\nREDIS FIRST TIME: {key}")

    return records


@app.on_event("startup")
async def startup():
    app.state.conn_pool = await asyncpg.create_pool(
        host="db",
        port=5432,
        user="moviedb-dev",
        password="moviedb-dev",
        database="moviedb"
    )
    app.state.redis = aioredis.from_url("redis://redis")


@app.on_event("shutdown")
async def shutdown():
    await app.state.conn_pool.close()


@app.get("/api/movies")
async def get_movies(request: Request, runtime_min: int | None = None, runtime_max: int | None = None,
                     revenue_min: float | None = None, revenue_max: float | None = None,
                     release_date_min: datetime.date | None = None, release_date_max: datetime.date | None = None,
                     genres: list[str] | None = Query(None), language: str | None = None,
                     sort_by: SortFields = "title", sort_direction: SortDirection = "ASC",
                     limit: int | None = None, row_min: int | None = None, row_max: int | None = None):

    if sort_by == "title" and sort_direction == "ASC" and not(any([runtime_min, runtime_max, revenue_min, revenue_max, release_date_min, release_date_max, genres, language, limit, row_min, row_max])):
        result = await redis_cache(
            app.state.redis,
            "DBCACHE_GET_ALL_MOVIES",
            "SELECT title, overview, runtime, average_rating, imdb_score, rotten_score, metacritic_score, awards, polarity, popularity, adult, status, release_date, budget, revenue, iso639_1, poster_path, backdrop_path FROM Movie;"
        )

        return result

    query_builder = QueryBuilder(MOVIE_COLUMNS, "Movie", "movie_id")
    query_builder.add_range_filter("runtime", runtime_min, runtime_max)
    query_builder.add_range_filter("revenue", revenue_min, revenue_max)
    query_builder.add_range_filter(
        "release_date", release_date_min, release_date_max)
    query_builder.add_row_bounds(row_min, row_max)
    if language is not None:
        query_builder.add_equality_filter("iso639_1", language)
    # if genres is not None:
    #     query_builder.add_membership_filter("genre", genres, from_table="MovieGenre")
    if genres is not None:
        for genre in genres:
            query_builder.add_equality_filter(
                "genre", genre, from_table="MovieGenre")
    query_builder.add_order_by(sort_by, sort_direction)
    if limit is not None:
        query_builder.add_limit(limit)
    query, args = query_builder.build()

    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(query, *args)
    return records


@app.get("/api/movies/{movie_id}")
async def get_movie(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        record = await conn.fetchrow("SELECT title, overview, runtime, average_rating, imdb_score, rotten_score, metacritic_score, awards, polarity, popularity, adult, status, release_date, budget, revenue, iso639_1, poster_path, backdrop_path FROM Movie WHERE movie_id=$1", movie_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return record


@app.get("/api/movies/{movie_id}/language")
async def get_movie_language(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetchrow("SELECT Language.iso639_1, Language.language_name FROM Language, Movie WHERE Movie.iso639_1=Language.iso639_1 AND Movie.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/actors")
async def get_movie_actors(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch("SELECT Actor.first_name, Actor.last_name FROM Actor INNER JOIN MovieActor ON Actor.actor_id=MovieActor.actor_id AND MovieActor.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/publishers")
async def get_movie_publishers(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch("SELECT Publisher.publishing_company, Publisher.publishing_country FROM Publisher INNER JOIN MoviePublisher ON Publisher.publisher_id=MoviePublisher.publisher_id AND MoviePublisher.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/genres")
async def get_movie_genres(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch("SELECT genre FROM MovieGenre WHERE movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/tags")
async def get_movie_tags(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch("SELECT Tag.tag_id, Tag.tag FROM Tag INNER JOIN MovieTag ON Tag.tag_id = MovieTag.tag_id AND MovieTag.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/translations")
async def get_movie_translations(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch("SELECT Language.iso639_1, Language.language_name FROM Language INNER JOIN MovieTranslation ON Language.iso639_1=MovieTranslation.iso639_1 AND MovieTranslation.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/ratings")
async def get_movie_ratings(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch("SELECT user_id, rating, timestamp FROM Rating WHERE movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/pred_rating")
async def get_pred_movie_rating(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        record = await conn.fetchrow("SELECT predicted_rating FROM PredictedMovieRating WHERE movie_id=$1", movie_id)
    if record is None:
        return {"predicted_rating": None}
    return record


@app.get("/api/movies/{movie_id}/pred_personality_ratings")
async def get_pred_personality_ratings(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        record = await conn.fetchrow("SELECT pred_open, pred_agreeable, pred_emotionally_stable, pred_conscientious, pred_extrovert FROM PredictedPersonalityRatings WHERE movie_id=$1", movie_id)
    if record is None:
        return {"pred_open": None, "pred_agreeable": None, "pred_emotionally_stable": None, "pred_conscientious": None, "pred_extrovert": None}
    return record


@app.get("/api/movies/{movie_id}/pred_personality_traits")
async def get_pred_personality_traits(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        record = await conn.fetchrow("SELECT openness, agreeableness, emotional_stability, conscientiousness, extraversion FROM PredictedPersonalityTraits WHERE movie_id=$1", movie_id)
    if record is None:
        return {"openness": None, "agreeableness": None, "emotional_stability": None, "conscientiousness": None, "extraversion": None}
    return record


@app.get("/api/tags/{tag_id}/personality_data")
async def get_tag_personality_data(request: Request, tag_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        record = await conn.fetchrow("SELECT agg_openness, agg_agreeableness, agg_emotional_stability, agg_conscientiousness, agg_extraversion FROM TagPersonalities WHERE tag_id=$1", tag_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return record


@app.get("/api/genres")
def get_tag_personality_data():
    return MOVIE_GENRES


@app.get("/api/languages")
async def get_all_languages():
    result = await redis_cache(
        app.state.redis,
        "DBCACHE_GET_ALL_LANGUAGES",
        "SELECT Language.iso639_1, Language.language_name FROM Language;"
    )

    return result
