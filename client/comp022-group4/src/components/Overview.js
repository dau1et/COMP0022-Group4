import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getMovie, getMovieGenres } from '../api/fetches';
import { API_KEY } from '../api/requests';
import '../styles/Overview.css';
import Details from './Details';
import { image_url, tmdb } from '../constants';


function Overview({ movieId }) {
  const [movie, setMovie] = useState();
  const [genres, setGenres] = useState();

  useEffect(async () => {
    const movieRequest = await getMovie(movieId);
    setMovie(movieRequest.data);

    const genresRequest = await getMovieGenres(movieId);
    setGenres(genresRequest.data);
  }, [movieId]);


  if (movie === undefined || genres === undefined) return(
    <div className='text-white'>
      MOVIE NOT FOUND
    </div>
  );

  const sectionHeight = "600";
  
  return (
    <div className='flex p-40'>

        <img 
            className={`object-contain mr-16 max-h-[${sectionHeight}px]`} 
            src={`${image_url}${movie.poster_path}`} 
            alt={movie.name} 
        />

        <div className={`flex flex-col h-auto max-h-[${sectionHeight}px]`}>
            <h1 className='uppercase text-6xl h-20 font-semibold'>{movie.title}</h1>

            <div className='flex flex-grow flex-col justify-between ml-4'>

              <div>
                <div className='flex justify-start mb-2 h-10'>
                  {genres.map((genre, index) => (
                    <div key={index} className='genre_tag'>
                        {genre.genre}
                    </div>
                  ))}
                </div>
                
                <div className='m-6 mt-8'>
                  <img 
                      className='object-contain w-16' 
                      src={tmdb} 
                      alt="TMDB"
                  />
                  {movie.vote_average} / {movie.vote_count}
                </div>
                

                <h2 className='text-xl font-bold mb-3'>Overview</h2>
                <h3 className='font-medium max-w-[95%]'>{movie.overview}</h3>
              </div>

              <Details movie={movie} />
            </div>

        </div>

    </div>
  )
}

export default Overview;