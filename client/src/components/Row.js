import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { image_url } from '../constants';
import MovieButton from "./MovieButton";
import '../styles/App.css';

function Row({ title, movies, setIsLoaded }) {
  const navigate = useNavigate();

  const [loadedMovieCount, setLoadedMovieCount] = useState(0);
  const loadedMovieCountRef = useRef(0);

  let movie_count = 0
  movies.forEach(movie => {
    if (movie.poster_path !== null) {
      movie_count += 1;
    }
  })

  useEffect(() => {
    movies.forEach(movie => {
      if (movie.poster_path !== null) {
        let img = new Image();
        img.onload = () => {loadedMovieCountRef.current += 1; setLoadedMovieCount(loadedMovieCountRef.current)};
        img.src = `${image_url}${movie.poster_path}`;
      }
    })
  }, [movies])

  useEffect(() => {
    if (loadedMovieCount >= movie_count) {
      setIsLoaded(true);      
    }
  }, [loadedMovieCount, movie_count])

  return (
    <div className='text-white ml-5'>
      <h2 className='font-bold'>{title}</h2>

      <div className='hide-scroll flex overflow-x-scroll overflow-y-hidden p-5'>
        {movies.map((movie) => {
          if (movie.poster_path !== null) {
            return (
              <MovieButton 
                key={movie.movie_id} 
                id={movie.movie_id} 
                title={movie.title} 
                poster_path={movie.poster_path} 
                popularity={movie.popularity} 
                polarity={movie.polarity} 
                max_height={'240px'} 
              />
            )
          }
        })}
      </div>
    </div>
  )
}

export default Row;
