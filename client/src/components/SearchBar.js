import React, {useState, useEffect} from "react";


const SearchBar = ({ allMovies, setSearchResults }) => {
	const [value, setValue] = useState("");

	useEffect(() => {
		const result = allMovies.filter(movie => movie.title.toLowerCase().includes(value.toLowerCase()));
		setSearchResults(result);
	}, [allMovies, value])

	return (
		<div className="mx-auto text-gray-600 bg-stone-800">
			<input
				type="search"
				value={value}
				onChange={e => setValue(e.target.value)}
				name="search"
				placeholder="Search"
				className="border-2 border-gray-300 bg-white h-10 px-5 pr-5 rounded-lg text-sm focus:outline-none"
			/>
		</div>
	)
}

export default SearchBar;
