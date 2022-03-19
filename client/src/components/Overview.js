import React from 'react';
import AdaptiveText from 'react-adaptive-text';
import { image_url, no_poster, tmdb } from '../constants';
import Details from './Details';


function RatingFraction(average) {
  return (
    <div className='inline-block align-middle leading-10 text-xl font-semibold'>
      <span className='text-3xl font-bold'>
        {average.rating == null ? '--' : (2*average.rating).toFixed(1)}
      </span> / 10.0
    </div>
  );
}

function Overview({ movie, genres, language, translations, publishers, cast }) {
  // if (movie === undefined || genres === undefined) return(
  //   <div className='text-white'>
  //     MOVIE NOT FOUND
  //   </div>
  // );
  
  return (
    <div className='flex p-32'>

        <img 
            className="object-contain mr-16 max-h-[600px]" 
            src={movie.poster_path == null ? no_poster : `${image_url}${movie.poster_path}`} 
            alt={movie.name} 
        />

        <div className="flex flex-col h-auto max-h-[600px]">
            <AdaptiveText />
            <h1 className='uppercase text-6xl h-[72px] font-semibold'>{movie.title}</h1>

            <div className='flex flex-grow flex-col justify-between'>

              <div className='ml-4'>
                <div className='flex justify-start mb-2 h-9'>
                  {genres.map((genre, index) => (
                    <div key={index} className='text-white text-sm font-semibold rounded-lg bg-neutral-300/50 mr-5 px-5 py-2'>
                        {genre.genre}
                    </div>
                  ))}
                </div>
                
                <div className='flex flex-column h-10 m-6'>
                  <img 
                      className='object-contain w-14 mr-5' 
                      src={tmdb} 
                      alt="TMDB"
                  />
                  <RatingFraction rating={movie.average_rating} />
                </div>
                

                <h2 className='text-xl font-bold mb-1'>{movie.overview == null ? "No" : ""} Overview</h2>
                <h3 className='font-light text-justify'>{movie.overview}</h3>
              </div>

              <Details movie={movie} language={language} translations={translations} publishers={publishers} cast={cast} />
            </div>

        </div>

    </div>
  )
}

export default Overview;