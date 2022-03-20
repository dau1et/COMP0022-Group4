import React, { useState, useEffect } from 'react';

import Nav from './Nav';
import Banner from './Banner';
import Row from './Row';
import { getMoviesByGenre, getTopMoviesBy } from '../api/fetches';

import RingLoader from 'react-spinners/RingLoader';
import { CircularProgress } from '@mui/material';

const Home = () => {
    const [isFetching, setIsFetching] = useState(true);

    const [newReleases, setNewReleases] = useState();
    const [popularMovies, setPopularMovies] = useState();
    const [polarisingMovies, setPolarisingMovies] = useState();
    const [actionMovies, setActionMovies] = useState();
    const [adventureMovies, setAdventureMovies] = useState();
    const [comedyMovies, setComedyMovies] = useState();
    const [dramaMovies, setDramaMovies] = useState();
    const [romanceMovies, setRomanceMovies] = useState();
    const [mysteryMovies, setMysteryMovies] = useState();

    const [navLoaded, setNavLoaded] = useState(false);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [newReleasesLoaded, setNewReleasesLoaded] = useState(false);
    const [popularMoviesLoaded, setPopularMoviesLoaded] = useState(false);
    const [polarisingMoviesLoaded, setPolarisingMoviesLoaded] = useState(false);
    const [actionMoviesLoaded, setActionMoviesLoaded] = useState(false);
    const [adventureMoviesLoaded, setAdventureMoviesLoaded] = useState(false);
    const [comedyMoviesLoaded, setComedyMoviesLoaded] = useState(false);
    const [dramaMoviesLoaded, setDramaMoviesLoaded] = useState(false);
    const [romanceMoviesLoaded, setRomanceMoviesLoaded] = useState(false);
    const [mysteryMoviesLoaded, setMysteryMoviesLoaded] = useState(false);

    useEffect(() => {
        // fetch data per genre, pass into respective row
        async function fetchData() {
            const newReleasesRequest = await getTopMoviesBy("release_date", 30);
            setNewReleases(newReleasesRequest.data);
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
            setIsFetching(false);
        }
        fetchData();
    }, []);
    
    let loadingImages = !(bannerLoaded && newReleasesLoaded && popularMoviesLoaded && polarisingMoviesLoaded && actionMoviesLoaded && adventureMoviesLoaded && comedyMoviesLoaded && dramaMoviesLoaded && romanceMoviesLoaded && mysteryMoviesLoaded);
    return isFetching ? (
        <div className='fixed h-full w-full grid place-content-center'>
            <RingLoader color="#0000ff" size={120} />
            {/* <CircularProgress /> */}
        </div>
    ) : (
        <div>
            <div className='fixed h-screen w-screen grid place-content-center' style={{display: loadingImages ? 'grid' : 'none'}}>
                <RingLoader color="#0000ff" size={120} />
                {/* <CircularProgress /> */}
            </div>
            <div style={{display : loadingImages ? 'none' : 'block'}}>
                <Nav />
                <Banner setIsLoaded={setBannerLoaded} />

                <Row title="New Releases" movies={newReleases} setIsLoaded={setNewReleasesLoaded} />
                <Row title="Most Popular" movies={popularMovies} setIsLoaded={setPopularMoviesLoaded} />
                <Row title="Most Polarising" movies={polarisingMovies} setIsLoaded={setPolarisingMoviesLoaded} />
                <Row title="Action" movies={actionMovies} setIsLoaded={setActionMoviesLoaded} />
                <Row title="Adventure" movies={adventureMovies} setIsLoaded={setAdventureMoviesLoaded} />
                <Row title="Comedy" movies={comedyMovies} setIsLoaded={setComedyMoviesLoaded} />
                <Row title="Drama" movies={dramaMovies} setIsLoaded={setDramaMoviesLoaded} />
                <Row title="Romance" movies={romanceMovies} setIsLoaded={setRomanceMoviesLoaded} />
                <Row title="Mystery" movies={mysteryMovies} setIsLoaded={setMysteryMoviesLoaded} />
            </div>
        </div>
    )
}

export default Home;