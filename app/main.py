from pickletools import read_uint1
from typing import Literal

import asyncpg
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware

from app.query import QueryBuilder

app = FastAPI()

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
    "popularity",
    "polarity",
    "adult",
    "status",
    "release_date",
    "budget",
    "revenue",
    "iso639_1",
    "poster_path",
    "backdrop_path"
]


@app.on_event("startup")
async def startup():
    app.state.conn_pool = await asyncpg.create_pool(
        host = "db",
        port = 5432,
        user = "moviedb-dev",
        password = "moviedb-dev",
        database = "moviedb"
    )


@app.on_event("shutdown")
async def shutdown():
    await app.state.conn_pool.close()


@app.get("/api/movies")
async def get_movies(request: Request, runtime_min: int | None = None, runtime_max: int | None = None, 
                        revenue_min: float | None = None, revenue_max: float | None = None,
                        genres: list[str] | None = Query(None), language: str | None = None,
                        sort_by: SortFields = "title", sort_direction: SortDirection = "ASC",
                        limit: int | None = None):
    query_builder = QueryBuilder(MOVIE_COLUMNS, "Movie", "movie_id")
    query_builder.add_range_filter("runtime", runtime_min, runtime_max)
    query_builder.add_range_filter("revenue", revenue_min, revenue_max)
    if language is not None:
        query_builder.add_equality_filter("iso639_1", language)
    if genres is not None:
        query_builder.add_membership_filter("genre", genres, from_table="MovieGenre")
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
        record = await conn.fetchrow("SELECT title, overview, runtime, average_rating, polarity, popularity, adult, status, release_date, budget, revenue, iso639_1, poster_path, backdrop_path FROM Movie WHERE movie_id=$1", movie_id)
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
