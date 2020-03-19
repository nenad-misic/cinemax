import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Movies from './Movies/Movies';
import Movie from './Movies/Movie/Movie';
import WatchMovie from './Movies/WatchMovie/WatchMovie';
import Shows from './Shows/Shows';
import Show from './Shows/Show/Show';
import Test from './Test/Test';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar></NavBar>
      
        <Route exact path='/' component={Test}/>
 
        <Route exact path='/cinemax' component={Test}/>
        <Route exact path='/movies' component={Movies}/>
        <Route exact path='/shows' component={Shows}/>
        <Route exact path='/movie/:movieId' component={Movie}/>
        <Route exact path='/show/:showTitle' component={Show}/>
        <Route exact path='/watch-movie/:movieId' component={WatchMovie}/>
      </div>
    );
  }
}

export default App;