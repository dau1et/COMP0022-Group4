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
  return (
    <><Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/library" element={<Library />} />

              {/* <Nav />
              <Overview movieId={66} />
              <Reports movieId={634649} /> */}

          </Routes>
      </Router></>
  )
}

export default App;
