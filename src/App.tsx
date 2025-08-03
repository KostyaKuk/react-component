import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/errorBoundary/error';
import ResultArea from './components/resultsArea/ResultArea';
import PokemonDetails from './components/cardInfo/cardInfo';
import About from './components/about/about';
import NotFound from './components/notFound/notFound';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <div>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ResultArea />}>
                <Route path="pokemon/:name" element={<PokemonDetails />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </div>
    </Provider>
  );
}

export default App;
