import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Row.css';

const image_url = "https://image.tmdb.org/t/p/original";

function Row({ title, movies }) {
  const navigate = useNavigate();

  return (
    <div className='row'>
      <h2>{title}</h2>

      <div className='row_posters'>
        {movies.map((movie) => {
          if (movie.poster_path !== null){
            /*return (
              <img  
                key={movie.movie_id} 
                className='object-contain w-full max-h-[200px] rounded m-[5px] hover:scale-105 duration-[450ms]' 
                src={`${image_url}${movie.poster_path}`} 
                alt={movie.name} 
                onClick={() => navigate(`/movie/${movie.movie_id}`, { replace: true })}
              />
            )*/


            return(
              <div className='image_container'>
                <div className='after'>2</div>
                <img 
                  key={movie.movie_id} 
                  src={`${image_url}${movie.poster_path}`} 
                  alt={movie.name} 
                  onClick={() => navigate(`/movie/${movie.movie_id}`, { replace: true })}
                />
             </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default Row;
