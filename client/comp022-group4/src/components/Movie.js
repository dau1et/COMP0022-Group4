import React from 'react';
import { useParams } from 'react-router-dom';

import Nav from './Nav';
import Overview from './Overview';
import Reports from './Reports';

const Movie = () => {
  const { id } = useParams();

  return (
    <div>
      <Nav />
      <Overview movieId={id} />
      <Reports movieId={id} />
    </div>
  )
}

export default Movie;