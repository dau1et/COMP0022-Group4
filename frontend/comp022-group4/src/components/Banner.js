import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import requests from '../api/requests';
import '../styles/Banner.css';

function Banner() {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchTopRated);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  return (
    <header className='banner' 
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(
          "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
        )`,
        backgroundPosition: "center center",
      }}
    >
      <div className='banner_contents'>
        <h1>The database has fallen</h1>
        <h1 className='banner_title'>{movie?.title || movie?.name || movie?.original_name}</h1>

        <div className='banner_buttons'>
          <button className='banner_button'>Play</button>
          <button className='banner_button'>My List</button>
        </div>

        <h1 className='banner_description'>{movie?.overview}</h1>
      </div>

      <div className='banner-fadeBottom' />
    </header>
  )
}

export default Banner;