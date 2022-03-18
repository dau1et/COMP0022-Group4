import React, { useState, useEffect } from 'react';

import Nav from './Nav';
import Banner from './Banner';
import Row from './Row';
import { getMoviesByGenre, getTopMoviesBy } from '../api/fetches';

import RingLoader from 'react-spinners/RingLoader';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [popularMovies, setPopularMovies] = useState();
    const [polarisingMovies, setPolarisingMovies] = useState();
    const [actionMovies, setActionMovies] = useState();
    const [adventureMovies, setAdventureMovies] = useState();
    const [comedyMovies, setComedyMovies] = useState();
    const [dramaMovies, setDramaMovies] = useState();
    const [romanceMovies, setRomanceMovies] = useState();
    const [mysteryMovies, setMysteryMovies] = useState();

    useEffect(() => {
        // fetch data per genre, pass into respective row
        async function fetchData() {
            const popularMoviesRequest = await getTopMoviesBy("popularity", 30);
            setPopularMovies(popularMoviesRequest.data);
            const polarisingMoviesRequest = await getTopMoviesBy("polarity", 30);
            setPolarisingMovies(polarisingMoviesRequest.data);
            const requestAction = await getMoviesByGenre("Action", 30);
            setActionMovies(requestAction.data);
            const requestAdventure = await getMoviesByGenre("Adventure", 30);
            setAdventureMovies(requestAdventure.data);
            const requestComedy = await getMoviesByGenre("Comedy", 30);
            setComedyMovies(requestComedy.data);
            const requestDrama = await getMoviesByGenre("Drama", 30);
            setDramaMovies(requestDrama.data);
            const requestRomance = await getMoviesByGenre("Romance", 30);
            setRomanceMovies(requestRomance.data);
            const requestMystery = await getMoviesByGenre("Mystery", 30);
            setMysteryMovies(requestMystery.data);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const spinnerStyle = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }
    
    if (isLoading) {
        return (
            <div style={spinnerStyle}>
                <RingLoader color="#0000ff" loading={isLoading}/>
            </div>
        )
    }

    console.log(isLoading);
    
    return (
        <div>
            <Nav />
            <Banner />
        
            <Row title="Most Popular" movies={popularMovies} />
            <Row title="Most Polarising" movies={polarisingMovies} />
            <Row title="Action" movies={actionMovies} />
            <Row title="Adventure" movies={adventureMovies} />
            <Row title="Comedy" movies={comedyMovies} />
            <Row title="Drama" movies={dramaMovies} />
            <Row title="Romance" movies={romanceMovies} />
            <Row title="Mystery" movies={mysteryMovies} />
        </div>
    )
}

export default Home;