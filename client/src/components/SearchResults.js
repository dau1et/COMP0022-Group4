import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from 'react-router-dom';
import { image_url } from "../constants";
import Nav from './Nav';
import Banner from './Banner';
import SearchBar from './SearchBar';
import { getGenres, getMovies } from "../api/fetches";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SelectUnstyled from '@mui/base/SelectUnstyled';
import { alpha, styled, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputBase from '@mui/material/InputBase';
import RingLoader from 'react-spinners/RingLoader';
import InfiniteScroll from 'react-infinite-scroll-component';

function SearchResults({ movies, setIsLoaded }) {
  const navigate = useNavigate();

  // const [rendered, setRendered] = useState([]);
  // const batchSize = 100;
  // let batchNum = 1;

  // function fetchBatch() {
  //   batchNum += 1;
  //   console.log("BATCH: " + batchNum);
  //   setRendered(movies.slice(0, batchNum * batchSize));
  // }

	// const [loadedMovieCount, setLoadedMovieCount] = useState(0);
  // const loadedMovieCountRef = useRef(0);

  // let movie_count = 0
  // movies.forEach(movie => {
  //   if (movie.poster_path !== null) {
  //     movie_count += 1;
  //   }
  // })

  // useEffect(() => {
  //   loadedMovieCountRef.current = 0;
  //   setLoadedMovieCount(0);
  //   movies.forEach(movie => {
  //     if (movie.poster_path !== null) {
  //       let img = new Image();
  //       img.onload = () => {loadedMovieCountRef.current += 1; setLoadedMovieCount(loadedMovieCount + 1)};
  //       img.src = `${image_url}${movie.poster_path}`;
  //     }
  //   })
  // }, [movies]);

  //console.log(loadedMovieCount, movie_count);

  // useEffect(() => {
  //   if (loadedMovieCount >= movie_count) {
  //     setIsLoaded(true);      
  //   }
  // }, [loadedMovieCount, movie_count])

  return (  
        /*<InfiniteScroll
          dataLength={rendered.length} 
          next={fetchBatch} 
          loader={<h4>Loading...</h4>}
          scrollThreshold={0.99}
          style={{width: "100%", display: 'block'}}
  >*/
          <div className="flex flex-wrap justify-evenly px-32 py-8">
            {movies.map((item, index) => (
                item.poster_path ? (
                  <img 
                    key={item.movie_id} 
                    className='object-contain max-h-[270px] aspect-[2/3] mx-2 my-3 hover:scale-105 duration-[450ms] rounded-xl border-double border-y-8 border-stone-800 hover:border-[#0000ff]' 
                    src={`${image_url}${item.poster_path}`} 
                    alt={item.name} 
                    onClick={() => navigate(`/movie/${item.movie_id}`, { replace: true })}
                  />
                ) : (
                  <a 
                    key={item.movie_id} 
                    className='flex bg-stone-800 justify-center items-center text-center font-semibold h-[270px] aspect-[2/3] rounded-xl mx-2 my-3 p-3 hover:scale-105 duration-[450ms] rounded-xl border-solid border-y-2 border-stone-800 hover:border-[#0000ff]' 
                    href={`/movie/${item.movie_id}`}
                  >
                    {item.title}
                  </a>
                )
              )
            )}
          </div>
        /*</InfiniteScroll>*/
  )

}

export default SearchResults;