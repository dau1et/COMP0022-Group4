import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { API_KEY } from '../api/requests';
import '../styles/Overview.css';
import logo from '../assets/tmdb.svg';

const image_url = "https://image.tmdb.org/t/p/original";

function Overview({ movieId }) {
  const [movie, setMovie] = useState();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(`/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
      setMovie(request.data);
      return request;
    }
    fetchData();
  }, [movieId]);

  console.log(movie);
  if (movie === undefined) return(<div />);
  
  return (
    <div className='flex justify-between p-40'>

        <img 
            className='object-contain mr-16 max-h-[600px]' 
            src={`${image_url}${movie.poster_path}`} 
            alt={movie.name} 
        />

        <div className='flex flex-col h-auto max-h-[600px]'>
            <h1 className='uppercase text-6xl h-20 font-semibold'>{movie.title}</h1>

            <div className='flex flex-grow flex-col justify-between ml-4'>

              <div className='overview_main'>
                <div className='flex justify-start mb-2 h-10'>
                  {movie.genres.map(genre => (
                    <div key={genre.id} className='genre_tag'>
                        {genre.name}
                    </div>
                  ))}
                </div>
                
                <div className='tmdb_rating'>
                  <img 
                      className='tmdb_logo' 
                      src={logo} 
                      alt="TMDB"
                  />
                </div>
                

                <h2>Overview</h2>
                <h3>{movie.overview}</h3>
              </div>
              
              <div className='overview_box'>
                DETAILS
              </div>
            </div>

        </div>

    </div>
  )
}

export default Overview;