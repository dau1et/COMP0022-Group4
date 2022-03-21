import React, {useState, useEffect, useRef} from "react";
import { image_url } from "../constants";
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieButton from "./MovieButton";

const SearchResults = ({ movies, setImagesLoaded }) => {
  const RESULTS_BATCH_SIZE = 100;

	const [displayedMovies, setDisplayedMovies] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  const [batchNum, setBatchNum] = useState(0);
  const [isFirstBatch, setIsFirstBatch] = useState(true);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const loadedImageCountRef = useRef(0);

  const countMovieImages = movies => {
    return movies.filter(movie => movie.poster_path !== null).length;
  }

  useEffect(() => {
    setIsFirstBatch(true);
    setDisplayedMovies(movies.slice(0, RESULTS_BATCH_SIZE));
    setBatchNum(1);
  }, [movies])

  useEffect(() => {
    if (isFirstBatch) {
      loadedImageCountRef.current = 0;
      setImageCount(countMovieImages(displayedMovies));
      setLoadedImageCount(0);
      displayedMovies.forEach(movie => {
        if (movie.poster_path !== null) {
          let img = new Image();
          img.onload = () => {loadedImageCountRef.current += 1; setLoadedImageCount(loadedImageCountRef.current)};
          img.src = `${image_url}${movie.poster_path}`;
        }
      })
    }
    setIsFirstBatch(false);
  }, [displayedMovies])

  useEffect(() => {
    if (loadedImageCount >= imageCount) {
      setImagesLoaded(true);
    }
  }, [loadedImageCount, imageCount])

  useEffect(() => {
    setHasMoreResults(displayedMovies.length < movies.length);
  }, [displayedMovies, movies])


  const fetchBatch = () => {
    async function doFetch() {
      const nextBatch = movies.slice(batchNum*RESULTS_BATCH_SIZE, (batchNum+1)*RESULTS_BATCH_SIZE);
      setDisplayedMovies(displayedMovies.concat(nextBatch));
      setBatchNum(batchNum + 1);
    }
    doFetch();
  }
  
  return (  
    <InfiniteScroll
      dataLength={displayedMovies.length} 
      next={fetchBatch}
      hasMore={hasMoreResults}
      loader={<h4>Loading...</h4>}
      scrollThreshold={0.8}
      style={{width: "100%", display: 'block'}}
    >
      <div className="flex flex-wrap justify-evenly px-32 py-8">
        {displayedMovies.map((item, index) => (
            <MovieButton 
              key={item.movie_id} 
              id={item.movie_id} 
              title={item.title} 
              poster_path={item.poster_path} 
              popularity={item.popularity} 
              polarity={item.polarity} 
              show={true} 
              max_height={'270px'} 
            />
          )
        )}
      </div>
    </InfiniteScroll>
  )
}

export default SearchResults;