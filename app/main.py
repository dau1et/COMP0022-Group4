import asyncpg
from fastapi import FastAPI, HTTPException, Request

app = FastAPI()


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


# TODO: Filter by query params
@app.get("/api/movies")
async def get_movies(request: Request, runtime_min: int | None = None, runtime_max: int | None = None, 
                        popularity_min: float | None = None, popularity_max: float | None = None,
                        adult: bool | None = None):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT title, overview, runtime, popularity, adult, status, release_date, budget, revenue, iso639_1, poster_path, backdrop_path FROM Movie")
    return records


@app.get("/api/movies/{movie_id}")
async def get_movie(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        record = await conn.fetchrow(f"SELECT title, overview, runtime, popularity, adult, status, release_date, budget, revenue, iso639_1, poster_path, backdrop_path FROM Movie WHERE movie_id={movie_id}")
    if record is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return record


@app.get("/api/movies/{movie_id}/actors")
async def get_movie_actors(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT Actor.first_name, Actor.last_name FROM Actor INNER JOIN MovieActor ON Actor.actor_id=MovieActor.actor_id AND MovieActor.movie_id={movie_id}")
    return records


@app.get("/api/movies/{movie_id}/publishers")
async def get_movie_publishers(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT Publisher.publishing_company, Publisher.publishing_country FROM Publisher INNER JOIN MoviePublisher ON Publisher.publisher_id=MoviePublisher.publisher_id AND MoviePublisher.movie_id={movie_id}")
    return records


@app.get("/api/movies/{movie_id}/genres")
async def get_movie_genres(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT genre FROM MovieGenre WHERE movie_id={movie_id}")
    return records


@app.get("/api/movies/{movie_id}/tags")
async def get_movie_tags(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT tag FROM MovieTag WHERE movie_id={movie_id}")
    return records


@app.get("/api/movies/{movie_id}/translations")
async def get_movie_translations(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT Language.iso639_1, Language.language_name FROM Language INNER JOIN MovieTranslation ON Language.iso639_1=MovieTranslation.iso639_1 AND MovieTranslation.movie_id={movie_id}")
    return records


@app.get("/api/movies/{movie_id}/ratings")
async def get_movie_ratings(request: Request, movie_id: int):
    async with request.app.state.conn_pool.acquire() as conn:
        records = await conn.fetch(f"SELECT user_id, rating, timestamp FROM Rating WHERE movie_id={movie_id}")
    return records
