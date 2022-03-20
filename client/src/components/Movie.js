import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [totalTagValues, setTotalTagValues] = useState([]);
  const [prevalentTags, setPrevalentTags] = useState([]);

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

      let total_sum = 0;
      let totalPersonalityValues = [0, 0, 0, 0, 0];
      let prevalent = [];
      let index_personalities = ["Open", "Agreeable", "Conscientious", "Emotionally Stable", "Extraverted"]

      for (const movieTag of movieTags.data) {
        const tempTagPersonalities = await getTagPersonalityData(movieTag.tag_id);
        console.log("tagPersonality: ", tempTagPersonalities.data);
        var key = `${movieTag.tag}`;
        tTags.push(key);
        var personalityValues = Object.values(tempTagPersonalities.data);
        const sum = personalityValues.reduce((partialSum, a) => partialSum + a, 0);
        total_sum += sum;
        let i = 0;
        Object.keys(tempTagPersonalities.data).forEach(key => {
          totalPersonalityValues[i++] += tempTagPersonalities.data[key]; 
          tempTagPersonalities.data[key] = tempTagPersonalities.data[key] / sum;
        });
        tPersonalities.push({[key]: tempTagPersonalities.data});
      }
      setTags(tTags);
      setTagPersonalities(tPersonalities);

      for (let i = 0; i < totalPersonalityValues.length; i++) {
        totalPersonalityValues[i] = totalPersonalityValues[i] / total_sum;
        if (totalPersonalityValues[i] >= 0.2) {
          prevalent.push(index_personalities[i]);
        }
      }
      setTotalTagValues(totalPersonalityValues);
      setPrevalentTags(prevalent)

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
        tags={tags}
        tagPersonalities={tagPersonalities}
        totalTagValues={totalTagValues}
        prevalentTags={prevalentTags}
      />
    </>
  )
}

export default Movie;