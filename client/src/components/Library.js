import React, {useState, useEffect} from "react";

import Nav from './Nav';
import Banner from './Banner';
import SearchBar from './SearchBar';
import { getGenres, getMovies } from "../api/fetches";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import RingLoader from 'react-spinners/RingLoader';


const Library = () => {
  const [isLoading, setIsLoading] = useState(true);
	const [searchResults, setSearchResults] = useState([]);
  const [allMovies, setAllMovies] = useState();
  const [allGenres, setAllGenres] = useState();

  useEffect(() => {
    async function fetchData() {
      const moviesRequest = await getMovies();
      setAllMovies(moviesRequest.data);
      const genresRequest = await getGenres();
      setAllGenres(genresRequest.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return isLoading ? (
    <div className='fixed h-full w-full grid place-content-center'>
      <RingLoader color="#0000ff" loading={isLoading} size={120} />
    </div>
  ) : (  
    <div>
      <Nav />

      <div className="flex flex-column justify-start px-32 pt-32 pb-24">
        <FormControl sx={{minWidth: 120, color: 'white'}}>
          <InputLabel>Age</InputLabel>
          <Select value={""} label="Sort By">
            <MenuItem value={"popularity"}>Popularity</MenuItem>
            <MenuItem value={"rating"}>Popularity</MenuItem>
            <MenuItem value={"release_date"}>Release Date</MenuItem>
            <MenuItem value={"budget"}>Budget</MenuItem>
            <MenuItem value={"revenue"}>Revenue</MenuItem>
          </Select>
        </FormControl>

        {/* <Select value={""} label="Sort By">
          <MenuItem value={"popularity"}>Popularity</MenuItem>
          <MenuItem value={"rating"}>Popularity</MenuItem>
          <MenuItem value={"release_date"}>Release Date</MenuItem>
          <MenuItem value={"budget"}>Budget</MenuItem>
          <MenuItem value={"revenue"}>Revenue</MenuItem>
        </Select> */}

        <SearchBar allMovies={allMovies} searchResults={searchResults} setSearchResults={setSearchResults} />
      </div>


			{searchResults.length > 0? (
				<ul>
					{ (searchResults.slice(0, 100)).map((item, index) => (
						<li key={index}>
							<a href={`/movie/${item.movie_id}`}>
								<h3>{item.title}</h3>
							</a>
						</li>
					))
					}
				</ul>
			) : null//(
      // <ul>
      // { (allMovies.data).slice(0, 100).map((item, index) => (
      //   <li key={index}>
      //     <a href={`/movie/${item.movie_id}`}>
      //       <h3>{item.title}</h3>
      //     </a>
      //   </li>
      // ))
      // }
      
      
      //</ul>)
      }
    </div>

  )

}

export default Library;