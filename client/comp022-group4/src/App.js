import './styles/App.css';
import Nav from './components/Nav';
import Banner from './components/Banner';
import Row from './components/Row';
import requests from './api/requests';

import Overview from './components/Overview';
import Reports from './components/Reports';

function App() {
  /*return (
    <div className="app">
      <Nav />
      <Banner />

      <Row title="Most Popular" fetchUrl={requests.fetchTopRated} />
      <Row title="Most Polarising" fetchUrl={requests.fetchTrending} />
      <Row title="..." fetchUrl={requests.fetchTrending} />
      <Row title="..." fetchUrl={requests.fetchTrending} />
    </div>
  );*/

  // Longest name: 10338

  return (
    <div className="app">
      <Nav />

      <Overview movieId={634649} />
      <Reports movieId={634649} />
    </div>
  )
}

export default App;
