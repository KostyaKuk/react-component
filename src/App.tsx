import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/errorBoundary/error';
import ResultArea from './components/resultsArea/ResultArea';

function App() {
  return (
    <div>
      <ErrorBoundary>
        <BrowserRouter>
          <ResultArea />
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
