from pickletools import read_uint1
from typing import Literal

import asyncpg
from fastapi import FastAPI, HTTPException, Query, Request

from app.query import QueryBuilder

app = FastAPI()

SortDirection = Literal["ASC", "DESC"]

SortFields = Literal[
    "title",
    "release_date",
    "popularity",
    "runtime",
    "revenue",
    "budget"
]

MOVIE_COLUMNS = [
    "title",
    "overview",
    "runtime",
    "popularity",
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


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api/movies")
async def get_movies(request: Request, runtime_min: int | None = None, runtime_max: int | None = None, 
                        revenue_min: float | None = None, revenue_max: float | None = None,
                        genres: list[str] | None = Query(None), language: str | None = None,
                        sort_by: SortFields = "title", sort_direction: SortDirection = "ASC"):
    query_builder = QueryBuilder(MOVIE_COLUMNS, "Movie", "movie_id")
    query_builder.add_range_filter("runtime", runtime_min, runtime_max)
    query_builder.add_range_filter("revenue", revenue_min, revenue_max)
    if language is not None:
        query_builder.add_equality_filter("iso639_1", language)
    if genres is not None:
        query_builder.add_membership_filter("genre", genres, from_table="MovieGenre")
    query_builder.add_order_by(sort_by, sort_direction)
    query, args = query_builder.build()

    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(query, *args)
    return records


@app.get("/api/movies/{movie_id}")
async def get_movie(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        record = await conn.fetchrow(f"SELECT title, overview, runtime, popularity, adult, status, release_date, budget, revenue, iso639_1, poster_path, backdrop_path FROM Movie WHERE movie_id=$1", movie_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return record


@app.get("/api/movies/{movie_id}/actors")
async def get_movie_actors(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT Actor.first_name, Actor.last_name FROM Actor INNER JOIN MovieActor ON Actor.actor_id=MovieActor.actor_id AND MovieActor.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/publishers")
async def get_movie_publishers(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT Publisher.publishing_company, Publisher.publishing_country FROM Publisher INNER JOIN MoviePublisher ON Publisher.publisher_id=MoviePublisher.publisher_id AND MoviePublisher.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/genres")
async def get_movie_genres(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT genre FROM MovieGenre WHERE movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/tags")
async def get_movie_tags(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT tag FROM MovieTag WHERE movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/translations")
async def get_movie_translations(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT Language.iso639_1, Language.language_name FROM Language INNER JOIN MovieTranslation ON Language.iso639_1=MovieTranslation.iso639_1 AND MovieTranslation.movie_id=$1", movie_id)
    return records


@app.get("/api/movies/{movie_id}/ratings")
async def get_movie_ratings(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT user_id, rating, timestamp FROM Rating WHERE movie_id=$1", movie_id)
    return records
