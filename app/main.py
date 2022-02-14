from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


# TODO: Add query params
@app.get("/api/movies")
async def get_movies():
    return []


@app.get("/api/movies/{movie_id}")
async def get_movie(movie_id: int):
    return {"movie_id": movie_id}


@app.get("/api/movies/{movie_id}/actors")
async def get_movie_actors(movie_id: int):
    return []


@app.get("/api/movies/{movie_id}/publishers")
async def get_movie_publishers(movie_id: int):
    return []


@app.get("/api/movies/{movie_id}/genres")
async def get_movie_genres(movie_id: int):
    return []


@app.get("/api/movies/{movie_id}/tags")
async def get_movie_tags(movie_id: int):
    return []


@app.get("/api/movies/{movie_id}/translations")
async def get_movie_translations(movie_id: int):
    return []


@app.get("/api/movies/{movie_id}/ratings")
async def get_movie_ratings(movie_id: int):
    return []
