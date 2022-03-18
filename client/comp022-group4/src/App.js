import './styles/App.css';

import Home from './components/Home';
import Movie from './components/Movie';
import Library from './components/Library';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Redirect
} from "react-router-dom";

const App = () => {
  // return (
  //   <div className="app">
  //     <Nav />
  //     <Banner />

  //     <Row title="Most Popular" fetchUrl={requests.fetchTopRated} />
  //     <Row title="Most Polarising" fetchUrl={requests.fetchTrending} />
  //     <Row title="..." fetchUrl={requests.fetchTrending} />
  //     <Row title="..." fetchUrl={requests.fetchTrending} />
  //   </div>
  // );

  // Longest name: 10338
  // Most publishers: 330764

  return (

    <>
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/library" element={<Library />} />


              {/* <Nav />
              <Overview movieId={66} />
              <Reports movieId={634649} /> */}

          </Routes>

      </Router>

    </>

  )
}

export default App;
