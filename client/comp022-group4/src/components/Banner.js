import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import requests from '../api/requests';
import { getMovie } from '../api/fetches';
import '../styles/Banner.css';

function Banner() {
  const [movie, setMovie] = useState([]);
  const [movieId, setMovieId] = useState(null);
  useEffect(() => {
    async function fetchData() {
      var rand_ids = ["1", "2", "3", "5", "6", "10", "44", "48"]
      var rand_id =  rand_ids[Math.floor(Math.random() * rand_ids.length)];
      const request = await getMovie(rand_id);
      console.log(request.data)
      setMovieId(rand_id);
      setMovie(
        request.data
      );
    }
    
    fetchData();
  }, []);

  return (
    <header className='banner' 
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(
          "https://www.ucl.ac.uk/news/sites/news/files/ucl_quad57-800x500_0.jpg"
        )`,
        backgroundPosition: "center center",
      }}
    >
      <div className='banner_contents'>
        <h1 className='banner_title'>{movie.title}</h1>

        <div className='banner_buttons'>
          
          <a className='banner_button' href={`/movie/${movieId}`}>Play</a>
        </div>

        <h1 className='banner_description'>{movie.overview}</h1>
      </div>

      <div className='banner-fadeBottom' />
    </header>
  )
}

export default Banner;