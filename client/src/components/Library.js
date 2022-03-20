import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { image_url } from "../constants";
import Nav from './Nav';
import Banner from './Banner';
import SearchBar from './SearchBar';
import { getGenres, getMovies, getAllLanguages } from "../api/fetches";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SelectUnstyled from '@mui/base/SelectUnstyled';
import { alpha, styled, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputBase from '@mui/material/InputBase';
import RingLoader from 'react-spinners/RingLoader';
import SearchResults from './SearchResults';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import InfiniteScroll from 'react-infinite-scroll-component';

const Library = () => {
  const navigate = useNavigate();

  const [isDoingInitialFetch, setIsDoingInitialFetch] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState([]);
  // const [allMovies, setAllMovies] = useState();
  const [allGenres, setAllGenres] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [chosenLanguage, setChosenLanguage] = useState(null);
  const [order, setOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState(null);
  const [allLanguages, setAllLanguages] = useState([]);
  const [batchNum, setBatchNum] = useState(0);
  const [moviesArray, setMoviesArray] = useState([]);

  function valuetext(value) {
    return `${value}`;
  }

  const [range, setRange] = useState([1900, 2020]);
  const [bounds, setBounds] = useState(["1990-01-01", "2020-12-31"])
  const handleChange = (event, newValue) => {
    setRange(newValue);
  };
  const handleRange = (event, newValue) => {
    var range_lb = `${range[0]}-01-01`;
    var range_up = `${range[1]}-12-31`;
    setBounds([range_lb, range_up]);
    setRange(newValue);
  };
  const marks = [
    {
      value: 1900,
      label: '1900',
    },
    {
      value: 2020,
      label: '2020',
    }
  ];

  useEffect(() => {
    async function fetchData() {
      const genresRequest = await getGenres();
      setAllGenres(genresRequest.data);
      const languages = await getAllLanguages();
      setAllLanguages(languages.data);
      setIsDoingInitialFetch(false);
    }
    fetchData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      setResultsLoaded(false);

      const moviesRequest = await getMovies({genres: selectedGenres, params: {release_date_min: bounds[0], release_date_max: bounds[1], sort_by: sortBy ? sortBy: null, language: chosenLanguage, sort_direction: order}});
      const movies = moviesRequest.data;
      
      setSearchResults(movies.filter(movie => movie.title.toLowerCase().includes(searchText.toLowerCase())));
      // setAllMovies(moviesRequest.data);

      setIsFetching(false);
      setResultsLoaded(true);
    }
    fetchData();
  }, [selectedGenres, sortBy, searchText, bounds, order]);

  useEffect(() => {
    setBatchNum(0);
    setMoviesArray([]);
    console.log("fetching...");
    fetchBatch();
  }, [searchResults])

  const handleGenres = (event, newGenres) => {
    setSelectedGenres(newGenres);
  }

  const fetchBatch = () => {
    async function doFetch() {
      // const movies = await getMovies({genres: selectedGenres, params: {release_date_min: bounds[0], release_date_max: bounds[1], sort_by: sortBy, language: chosenLanguage, row_min: batchNum*20, row_max: (batchNum+1)*20}});
      console.log(searchResults, batchNum);
      setMoviesArray(moviesArray.concat(searchResults.slice(batchNum*50, (batchNum+1)*50)));
      console.log(moviesArray, batchNum);
      setBatchNum(batchNum + 1);
    }
    doFetch();
  }

  console.log(isFetching, resultsLoaded);
  const isLoading = isFetching || !resultsLoaded;

  return isDoingInitialFetch ? (
    <div className='fixed h-full w-full grid place-content-center'>
      <RingLoader color="#0000ff" loading={isFetching} size={120} />
    </div>
  ) : (  
    <div>
      <Nav />

      <div className="flex flex-column justify-start px-32 pt-32 pb-4">

        <select className="form-control" name="filter" value={sortBy} onChange={e => setSortBy(e.target.value)} 
        style={{padding: "10px", backgroundColor: "white", color: "black", borderRadius: "8px"}}>
              <option value="" >Sort By</option>
              {/* <option style={{display: 'none'}} selected>Sort By</option> */}
              <option value="popularity">Popularity</option>
              <option value="average_rating">Rating</option>
              <option value="budget">Budget</option>
              <option value="revenue">Revenue</option>
        </select>

        <select className="form-control" name="filter" value={chosenLanguage} onChange={e => setChosenLanguage(e.target.value)} 
        style={{marginLeft: "10px", padding: "10px", backgroundColor: "white", color: "black", borderRadius: "8px"}}>
              <option value={null}>All Languages</option>
              {allLanguages.map((language) => <option key={language.iso639_1} value={language.iso639_1}>{language.language_name}</option>)}
        </select>

        <select className="form-control" name="filter" value={order} onChange={e => setOrder(e.target.value)} 
        style={{marginLeft: "10px", padding: "10px", backgroundColor: "white", color: "black", borderRadius: "8px"}}>
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
        </select>

        {/* <SearchBar allMovies={allMovies} searchResults={searchResults} setSearchResults={setSearchResults} /> */}
        <div className="mx-auto text-gray-600 bg-stone-800">
          <input
            type="search"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            name="search"
            placeholder="Search"
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-5 rounded-lg text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-column justify-center">
      <ToggleButtonGroup value={selectedGenres} onChange={handleGenres} sx={{backgroundColor: "white"}}>
          {allGenres.map(genre => (
            <ToggleButton key={genre} value={genre}>
              {genre}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div className = "flex justify-center mx-auto">
        <Box sx={{ width: 300 }}>
          <Slider
            getAriaLabel={() => 'Release Date'}
            value={range}
            onChange={handleChange}
            onChangeCommitted={handleRange}
            valueLabelDisplay="auto"
            step = {1}
            getAriaValueText={valuetext}
            marks = {marks}
            min={1900}
            max={2020}
          />
      </Box>
      </div>
			{searchResults.length > 0 ? (
        // <div className="flex flex-wrap justify-evenly px-32 py-8">
        //   {(
        //     searchResults.slice(0, 120)).map((item, index) => (
        //       item.poster_path ? (
				// 		    <img 
        //           key={item.movie_id} 
        //           className='object-contain max-h-[270px] aspect-[2/3] mx-2 my-3 hover:scale-105 duration-[450ms] rounded-xl border-solid border-y-2 border-[#0000ff]' 
        //           src={`${image_url}${item.poster_path}`} 
        //           alt={item.name} 
        //           onClick={() => navigate(`/movie/${item.movie_id}`, { replace: true })}
        //         />
        //       ) : (
				// 			  <a 
        //           key={index} 
        //           className='flex bg-stone-800 justify-center items-center text-center font-semibold h-[270px] aspect-[2/3] rounded mx-2 my-3 p-3 hover:scale-105 duration-[450ms] rounded-xl border-solid border-y border-[#0000ff]' 
        //           href={`/movie/${item.movie_id}`}
        //         >
        //           {item.title}
        //         </a>
        //       )
        //     )
        //   )}
        // </div>
        <div>
          <div className='fixed h-screen w-screen grid place-content-center' style={{display: isLoading ? 'grid' : 'none'}}>
            <RingLoader color="#0000ff" size={120} />
          </div>
          <div style={{display: isLoading ? 'none' : 'grid'}}>
            {/* <SearchResults movies={searchResults} setIsLoaded={setResultsLoaded} /> */}
            <InfiniteScroll
              dataLength={moviesArray.length} 
              next={fetchBatch}
              hasMore={true}
              loader={<h4>Loading...</h4>}
              scrollThreshold={0.8}
              style={{width: "100%", display: 'block'}}
            >
              <div className="flex flex-wrap justify-evenly px-32 py-8">
                {moviesArray.map((item, index) => (
                    item.poster_path ? (
                      <img 
                        key={item.movie_id} 
                        className='object-contain max-h-[270px] aspect-[2/3] mx-2 my-3 hover:scale-105 duration-[450ms] rounded-xl border-y-2 border-stone-800 hover:border-[#0000ff]' 
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
            </InfiniteScroll>
          </div>
        </div>
			) : (
        null
      )}
    </div>

  )

}

export default Library;