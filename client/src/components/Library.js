import React, {useState, useEffect} from "react";

import Nav from './Nav';
import Banner from './Banner';
import SearchBar from './SearchBar';
import { getMovies } from "../api/fetches";

const Library = () => {
	const [searchResults, setSearchResults] = useState([]);
  const [allMovies, setAllMovies] = useState({});

  useEffect(async () => {
    const movies = await getMovies();
    setAllMovies(movies);  
    console.log(movies)
  }, []);

  return (  
    <div>
      <Nav />
      <SearchBar allMovies={allMovies} searchResults={searchResults} setSearchResults={setSearchResults} />

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