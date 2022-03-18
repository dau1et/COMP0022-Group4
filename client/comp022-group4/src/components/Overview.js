import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getMovie, getMovieGenres } from '../api/fetches';
import { API_KEY } from '../api/requests';
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

  console.log(movie);
  
  return (
    <div className='flex p-32'>

        <img 
            className="object-contain mr-16 max-h-[600px]" 
            src={`${image_url}${movie.poster_path}`} 
            alt={movie.name} 
        />

        <div className="flex flex-col h-auto max-h-[600px]">
            <h1 className='uppercase text-6xl h-[72px] font-semibold'>{movie.title}</h1>

            <div className='flex flex-grow flex-col justify-between'>

              <div className='ml-4'>
                <div className='flex justify-start mb-2 h-10'>
                  {genres.map((genre, index) => (
                    <div key={index} className='text-white font-semibold rounded-lg bg-neutral-300/50 mr-5 px-5 py-2'>
                        {genre.genre}
                    </div>
                  ))}
                </div>
                
                <div className='flex flex-column m-6'>
                  <img 
                      className='object-contain w-14 mr-5' 
                      src={tmdb} 
                      alt="TMDB"
                  />
                  {movie.average_rating} / 10.0
                </div>
                

                <h2 className='text-xl font-bold mb-1'>Overview</h2>
                <h3 className='font-light max-w-[95%]'>{movie.overview}</h3>
              </div>

              <Details movie={movie} />
            </div>

        </div>

    </div>
  )
}

export default Overview;