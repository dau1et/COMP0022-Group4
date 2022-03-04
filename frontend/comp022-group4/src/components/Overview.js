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
    <div className='overview'>
        <img 
            className='overview_poster' 
            src={`${image_url}${movie.poster_path}`} 
            alt={movie.name} 
        />
        <div className='overview_movie'>
            <h1 className='overview_title uppercase'>{movie.title}</h1>

            <div className='overview_details'>
              <div className='genres'>
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

              <div className='overview_box'>
                DETAILS
              </div>
            </div>

        </div>
    </div>
  )
}

export default Overview;