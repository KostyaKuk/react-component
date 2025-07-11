import { Component } from 'react';
import InputElem from './components/inputElement/inputElem';
import CharacterCard from './components/card/card';

class App extends Component {
  render() {
    return (
      <div>
        <InputElem />
        <CharacterCard />
      </div>
    );
  }
}

export default App;
