import { Component } from 'react';
import ResultArea from './components/resultsArea/ResultArea';
import ErrorBoundary from './components/errorBoundary/error';

class App extends Component {
  render() {
    return (
      <div>
        <ErrorBoundary>
          <ResultArea />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
