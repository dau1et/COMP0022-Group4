import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Row.css';

const image_url = "https://image.tmdb.org/t/p/original";

function Row({ title, movies, setIsLoaded }) {
  const navigate = useNavigate();

  const [loadedMovies, setLoadedMovies] = useState(0);
  const loadedMoviesRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState();

  let movie_count = 0
  movies.forEach(movie => {
    if (movie.poster_path !== null) {
      movie_count += 1;
    }
  })

  useEffect(() => {
    setImages(movies.map(movie => {
      if (movie.poster_path !== null) {
        let img = new Image();
        img.key = movie.movie_id;
        img.className = 'object-contain w-full max-h-[200px] rounded m-[5px] hover:scale-105 duration-[450ms]';
        img.onload = () => {loadedMoviesRef.current += 1; setLoadedMovies(loadedMoviesRef.current)};
        img.src = `${image_url}${movie.poster_path}`;
        img.alt = movie.title;
        img.onClick = () => navigate(`/movie/${movie.movie_id}`, { replace: true });
        return img;
      }
    }))
  }, [movies])

  useEffect(() => {
    if (loadedMovies >= movie_count) {
      setIsLoaded(true);
      setIsLoading(false);
      
    }
  }, [loadedMovies, movie_count])

  return isLoading ? (
    <div>
      Loading...
    </div>
  ) : (
    <div className='text-white ml-5'>
      <h2>{title}</h2>

      <div className='row_posters'>
        {movies.map((movie) => {
          if (movie.poster_path !== null) {
            return (
              <img  
                key={movie.movie_id} 
                className='object-contain w-full max-h-[200px] rounded m-[5px] hover:scale-105 duration-[450ms]' 
                src={`${image_url}${movie.poster_path}`} 
                alt={movie.name} 
                onClick={() => navigate(`/movie/${movie.movie_id}`, { replace: true })}
              />
            )
          }
        })}
        {/* {images.map(image => {
          return (
            <div>
              {image}
            </div>
          )
        })} */}
      </div>
    </div>
  )
}

export default Row;
