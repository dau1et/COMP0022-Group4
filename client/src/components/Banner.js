import React, { useEffect, useState } from 'react';
import { getMovie } from '../api/fetches';
import '../styles/App.css';

function Banner({ setIsLoaded }) {
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

    let bannerImg = new Image();
    bannerImg.onload = () => {setIsLoaded(true)};
    bannerImg.src = "https://www.ucl.ac.uk/news/sites/news/files/ucl_quad57-800x500_0.jpg";
  }, []);

  return (
    <header className='text-white object-contain h-[448px]' 
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(
          "https://www.ucl.ac.uk/news/sites/news/files/ucl_quad57-800x500_0.jpg"
        )`,
        backgroundPosition: "center center",
      }}
    >
      <div className='ml-8 pt-[180px] h-[200px]'>
        <h1 className='text-5xl font-extrabold pb-[1rem]'>{movie.title}</h1>

        <div>
          
          <a 
            className='cursor-pointer text-white outline-none border-none font-bold rounded px-8 py-2 mr-4 bg-neutral-800/50 hover:text-black hover:bg-[#e6e6e6] hover:transition' 
            href={`/movie/${movieId}`}
          >More Info</a>
        </div>

        <h1 className='w-[45rem] pt-4 text-[0.8rem] max-w-[560px] h-[80px] max-h-[120px]'>{movie.overview}</h1>
      </div>

      <div className='h-[248px] fade' />
    </header>
  )
}

export default Banner;