import ErrorBoundary from './components/errorBoundary/error';
import ResultArea from './components/resultsArea/ResultArea';

function App() {
  return (
    <div>
      <ErrorBoundary>
        <ResultArea />
      </ErrorBoundary>
    </div>
  );
}

export default App;
