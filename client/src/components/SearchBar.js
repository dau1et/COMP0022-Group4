import React, {useState, useEffect} from "react";


const SearchBar = ({ allMovies, searchResults, setSearchResults }) => {
	const [value, setValue] = useState("");

	useEffect(() => {
		if (allMovies.data) {
			console.log(value);
			const result = (allMovies.data).filter(movie => movie.title.toLowerCase().includes(value.toLowerCase()));
			console.log(result);
			setSearchResults(result);
		}
	}, [value])

	return (
		<div className="pt-2 relative mx-auto text-gray-600 inline-block mt-20 justify-center align-middle">
			<input
				type="search"
				value={value}
				onChange={e => setValue(e.target.value)}
				name="search"
				placeholder="Search"
				className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
			/>

		</div>
	)
}

export default SearchBar;
