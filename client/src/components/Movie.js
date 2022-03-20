import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RingLoader from 'react-spinners/RingLoader';

import { getMovie, getMovieGenres, getMovieLanguage, getPredictedRating, getPredictedPersonalityRatings, 
         getPredictedPersonalityTraits, getMovieActors, getMovieTranslations, getMoviePublishers,
         getMovieTags, getTagPersonalityData } from '../api/fetches';
import Nav from './Nav';
import Overview from './Overview';
import Reports from './Reports';

const Movie = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState();
  const [genres, setGenres] = useState();
  const [language, setLanguage] = useState()
  const [translations, setTranslations] = useState();
  const [publishers, setPublishers] = useState();
  const [cast, setCast] = useState();
  const [predictedRating, setPredictedRating] = useState(null);
  const [predictedPersonalityRatings, setPredictedPersonalityRatings] = useState([]);
  const [predictedPersonalityTraits, setPredictedPersonalityTraits] = useState([]);
  const [movieTags, setMovieTags] = useState([]);
  const [tagPersonalities, setTagPersonalities] = useState([]);
  const [tags, setTags] = useState([]);

  let tTags = [];
  let tPersonalities = [];

  useEffect(() => {
    async function fetchData() {
      const movieRequest = await getMovie(id);
      setMovie(movieRequest.data);
      const genresRequest = await getMovieGenres(id);
      setGenres(genresRequest.data);
      const languageRequest = await getMovieLanguage(id);
      setLanguage(languageRequest.data);
      const translationsRequest = await getMovieTranslations(id);
      setTranslations(translationsRequest.data);
      const publishersRequest = await getMoviePublishers(id);
      setPublishers(publishersRequest.data);
      const castRequest = await getMovieActors(id);
      setCast(castRequest.data);
      const predictedRatingRequest = await getPredictedRating(id);
      setPredictedRating(predictedRatingRequest.data.predicted_rating);
      const predictedPersonalityRatingsRequest = await getPredictedPersonalityRatings(id);
      setPredictedPersonalityRatings(predictedPersonalityRatingsRequest.data);
      const predictedPersonalityTraitsRequest = await getPredictedPersonalityTraits(id);
      setPredictedPersonalityTraits(predictedPersonalityTraitsRequest.data);
      const movieTags = await getMovieTags(id);

      for (const movieTag of movieTags.data) {
        const tempTagPersonalities = await getTagPersonalityData(movieTag.tag_id);
        console.log("tagPersonality: ", tempTagPersonalities.data);
        var key = `${movieTag.tag}`;
        tTags.push(key);

        tPersonalities.push({[key]: tempTagPersonalities.data});
      }
      setTags(tTags);
      setTagPersonalities(tPersonalities);

      console.log("tags: ", tags);
      console.log("tagPersonalities: ", tPersonalities);
      if (tPersonalities.length > 0) {
        console.log("tagPersonalities keys [0]: ", Object.keys(tPersonalities[0]));
      }

      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  return isLoading ? (
    <div className='fixed h-full w-full grid place-content-center'>
      <RingLoader color="#0000ff" loading={isLoading} size={120} />
    </div>
  ) : (
    <>
      <Nav />
      <Overview
        movie={movie}
        genres={genres}
        language={language}
        translations={translations}
        publishers={publishers}
        cast={cast}
      />
      <Reports
        movie={movie}
        predictedRating={predictedRating}
        predictedPersonalityRatings={predictedPersonalityRatings}
        predictedPersonalityTraits={predictedPersonalityTraits}
        tags = {tags}
        tagPersonalities={tagPersonalities}

      />
    </>
  )
}

export default Movie;