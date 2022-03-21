import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { image_url } from "../constants";
import Nav from './Nav';
import Banner from './Banner';
import SearchBar from './SearchBar';
import { getGenres, getMovies, getAllLanguages } from "../api/fetches";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RingLoader from 'react-spinners/RingLoader';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieButton from "./MovieButton";
import SearchResults from "./SearchResults";

const Library = () => {
  const navigate = useNavigate();

  const RESULTS_BATCH_SIZE = 100;

  const [isFetchingFilters, setIsFetchingFilters] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [allGenres, setAllGenres] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [chosenLanguage, setChosenLanguage] = useState(null);
  const [order, setOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState(null);
  const [allLanguages, setAllLanguages] = useState([]);
  const [batchNum, setBatchNum] = useState(0);
  const [moviesArray, setMoviesArray] = useState([]);
  const [hasMoreResults, setHasMoreResults] = useState(true);

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
    },
    {
      value: 1960,
      label: 'Release Date',
    }
  ];

  useEffect(() => {
    async function fetchData() {
      const genresRequest = await getGenres();
      setAllGenres(genresRequest.data);
      const languages = await getAllLanguages();
      setAllLanguages(languages.data);
      setIsFetchingFilters(false);
    }
    fetchData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      setResultsLoaded(false);
      const moviesRequest = await getMovies({genres: selectedGenres, params: {release_date_min: bounds[0], release_date_max: bounds[1], sort_by: sortBy ? sortBy: null, language: chosenLanguage ? chosenLanguage : null, sort_direction: order}});
      const movies = moviesRequest.data;
      setFilteredMovies(movies);
      setSearchResults(movies.filter(movie => movie.title.toLowerCase().includes(searchText.toLowerCase())));
      setIsFetching(false);
    }
    fetchData();
  }, [selectedGenres, chosenLanguage, sortBy, bounds, order]);

  useEffect(() => {
    setSearchResults(filteredMovies.filter(movie => movie.title.toLowerCase().includes(searchText.toLowerCase())));
  }, [searchText])

  const handleGenres = (event, newGenres) => {
    setSelectedGenres(newGenres);
  }
  
  const isLoading = isFetching || !resultsLoaded;

  return isFetchingFilters ? (
    <div className='fixed h-full w-full grid place-content-center'>
      <RingLoader color="#0000ff" loading={isFetching} size={120} />
    </div>
  ) : (  
    <div>
      <Nav />

      <div className="flex flex-column justify-between px-56 pt-32 pb-4">
      <div className="flex-start text-gray-600 mt-[10px]">
          <input
            type="search"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            name="search"
            placeholder="Search"
            className="border-2 border-[#0000ff] bg-white h-10 px-5 pr-5 rounded-lg text-sm focus:outline-none"
          />
        </div>
        <div className = "flex flex-start justify-center px-8 mr-56 mt-[5px]">
        <Box sx={{ width: 300, '& .MuiSlider-markLabel':{color:"white",}}}>
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
        <div className="flex flex-end pl-28">
        <select className="form-control" name="filter" value={sortBy} onChange={e => setSortBy(e.target.value)} 
        style={{paddingLeft: "10px", paddingRight: "10px", backgroundColor: "white", color: "black", borderRadius: "8px", height: "45px", marginTop: "10px"}}>
              <option value="">Sort By</option>
              {/* <option style={{display: 'none'}} selected>Sort By</option> */}
              <option value="release_date">Release Date</option>
              <option value="popularity">Popularity</option>
              <option value="polarity">Polarity</option>
              <option value="average_rating">Rating</option>
              <option value="budget">Budget</option>
              <option value="revenue">Revenue</option>
        </select>

        <select className="form-control" name="filter" value={chosenLanguage} onChange={e => setChosenLanguage(e.target.value)} 
        style={{marginLeft: "10px", padding: "10px", backgroundColor: "white", color: "black", borderRadius: "8px", height: "45px", marginTop: "10px"}}>
              <option value="">All Languages</option>
              {allLanguages.map(language => <option key={language.iso639_1} value={language.iso639_1}>{language.language_name}</option>)}
        </select>

        <select className="form-control" name="filter" value={order} onChange={e => setOrder(e.target.value)} 
        style={{marginLeft: "10px", padding: "10px", backgroundColor: "white", color: "black", borderRadius: "8px", height: "45px", marginTop: "10px"}}>
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
        </select>

        {/* <SearchBar allMovies={allMovies} searchResults={searchResults} setSearchResults={setSearchResults} /> */}

        </div>
      </div>


      <div className="flex flex-column justify-center">
      <ToggleButtonGroup value={selectedGenres} onChange={handleGenres} sx={{backgroundColor: "#616161", borderRadius: "8px"}}>
          {allGenres.map(genre => (//MuiButtonBase-root
            <ToggleButton key={genre} value={genre} sx={{fontWeight: "700", color:"white", textTransform: "none"}}>
              {genre}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <kbd className='bg-red-700 mx-2 px-1 ml-[220px] mt-2'>Polarity</kbd>
      <kbd className='bg-yellow-600 mx-2 px-1'>Popularity</kbd>


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
            <SearchResults movies={searchResults} setImagesLoaded={setResultsLoaded} />
            {/* <InfiniteScroll
              dataLength={moviesArray.length} 
              next={fetchBatch}
              hasMore={hasMoreResults}
              loader={<h4>Loading...</h4>}
              scrollThreshold={0.8}
              style={{width: "100%", display: 'block'}}
            >
              <div className="flex flex-wrap justify-evenly px-32 py-8">
                {moviesArray.map((item, index) => (
                    <MovieButton 
                      key={item.movie_id} 
                      id={item.movie_id} 
                      title={item.title} 
                      poster_path={item.poster_path} 
                      max_height={'270px'} 
                    />
                  )
                )}
              </div>
            </InfiniteScroll> */}
          </div>
        </div>
			) : (
        <div></div>
      )}
    </div>

  )

}

export default Library;