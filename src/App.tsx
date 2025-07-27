import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/errorBoundary/error';
import ResultArea from './components/resultsArea/ResultArea';
import PokemonDetails from './components/cardInfo/cardInfo';

function App() {
  return (
    <div>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ResultArea />}>
              <Route path="pokemon/:name" element={<PokemonDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
