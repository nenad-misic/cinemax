import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { api } from '../Environment/environment';
import InfiniteScroll from 'react-infinite-scroller';

class Movies extends Component {
  constructor(props) {
    super(props);

    this.pageLimit = 48;

    this.state = {
      movies: [],
      currentPage: 1,
      totalRecords: 0,
      inputValue: ''
    };
  }

  updateInputValue = (evt) => {
    this.setState({
      inputValue: evt.target.value
    });
  }

  async componentDidMount() {
    const movies = (await axios.get(`${api}list_movies.json`, {
      params: {
        page: 1,
        limit: this.pageLimit,
        sort_by: 'rating',
        query_term: this.state.inputValue
      }
    })).data.data;
    this.setState({
      movies: this.state.movies.concat(movies.movies),
      currentPage: this.state.currentPage + 1,
      totalRecords: movies.movie_count
    })  
  }

  loadMoreItems = async () => {
    if(this.state.currentPage * this.pageLimit >= this.state.totalRecords){
      return;
    }
    const loadedMovies = (await axios.get(`${api}list_movies.json`, {
      params: {
        limit: this.pageLimit,
        sort_by: 'rating',
        page: this.state.currentPage,
        query_term: this.state.inputValue
      }
    })).data.data;
    this.setState({
      movies: this.state.movies.concat(loadedMovies.movies),
      currentPage: this.state.currentPage + 1,
      totalRecords: loadedMovies.movie_count
    })  
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.doSearch();
  }
  doSearch = async () => {
    const movies = (await axios.get(`${api}list_movies.json`, {
      params: {
        page: 1,
        limit: this.pageLimit,
        query_term: this.state.inputValue
      }
    })).data.data;
    this.setState({
      movies: movies.movies || [],
      currentPage: 1,
      totalRecords: movies.movie_count
    })  
  }


  render() {
    return (
      <div className="container">
            {!this.state.movies && <p>Loading movies...</p>}
            
            <form onSubmit={this.onSubmit}>


            <div className="input-group col-6 offset-3 mb-3 my-5">
                <input type="text" className="form-control bg-primary text-light" id="searchInput" value={this.state.inputValue} onChange={this.updateInputValue} placeholder="Search"/>
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary border">Search</button>
                </div>
              </div>
            </form>
            
            <InfiniteScroll
                pageStart={this.state.currentPage}
                loadMore={this.loadMoreItems}
                hasMore={this.state.currentPage * this.pageLimit < this.state.totalRecords}
                threshold={750}
            >

              <div className="row">
              {
                this.state.movies  && this.state.movies.length > 0 && this.state.movies.map(movie => (
                  <div key={movie.id} className="col-xs-12 col-sm-6 col-md-4 col-lg-2 d-flex align-items-stretch">
                    <Link to={`/movie/${movie.id}`}>
                      <div className="card img-fluid bg-primary text-white mb-3 movie-image-container">
                        <div className="card-img-top movie-image-container">
                          <img className="card-img-top  movie-image" src={movie.large_cover_image} alt={movie.title_long}/>
                        </div>
                        <p className="caption0"><span className="border border-secondary badge text-dark badge-info">{movie.runtime} min</span></p>
                        <p className="caption1"><span className="border border-secondary badge text-dark badge-success">{movie.rating}/10</span></p>
                        <p className="caption2"><span className="border border-secondary badge text-black badge-light">{movie.language}</span></p>
                          <div className="card-body">
                            <p className="card-subtitle text-center align-middle">{movie.title_long}</p>
                          </div>
                      </div>
                    </Link>
                  </div>
                ))
              }
              </div>
              
            </InfiniteScroll>
      </div>
    )
  }
}

export default Movies;