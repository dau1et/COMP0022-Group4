import './styles/App.css';
import Nav from './components/Nav';
import Banner from './components/Banner';
import Row from './components/Row';
import requests from './api/requests';

function App() {
  return (
    <div className="app">
      <header className="App-header">
        <Nav />
        <Banner />

        <Row title="Most Popular" fetchUrl={requests.fetchTopRated} />
        <Row title="Most Polarising" fetchUrl={requests.fetchTrending} />
        <Row title="..." fetchUrl={requests.fetchTrending} />
        <Row title="..." fetchUrl={requests.fetchTrending} />

      </header>
    </div>
  );
}

export default App;
