import React, {useState, useEffect} from "react";
import { getMovies } from '../api/fetches';


const SearchBar = () => {
	// const [searchTerm, searchTermField] = useInput({ placeholder: "Search by Movie Name" });
	const [value, setValue] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [allMovies, setAllMovies] = useState({});

	useEffect(async () => {
		const movies = await getMovies();
		console.log(movies);
		setAllMovies(movies);
	}, [])	

	useEffect(() => {
		if (allMovies.data) {
			console.log(value);
			const result = (allMovies.data).filter(movie => movie.title.toLowerCase().includes(value.toLowerCase()));
			console.log(result);
			setSearchResults(result);
		}
	}, [value])

	return (
		<div className="mt-10">
			<form>
			<input
				type="search"
				value={value}
				onChange={e => setValue(e.target.value)}
				name="s"
				id="s"
				placeholder="Search"
			/>
			</form>

			{/* <ul>
				<li>

					<a>
						<h3>{searchResults.title}</h3>
					</a>
				</li>
			</ul> */}
		</div>
	)
}

export default SearchBar;
