import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { tvshows } from './DB';
import axios from 'axios';
import { compareTwoStrings } from 'string-similarity';

class Shows extends Component {
  constructor(props) {
    super(props);


    this.state = {
      shows: [],
      inputValue: ''
    };
  }

  updateInputValue = (evt) => {
    this.setState({
      inputValue: evt.target.value
    });
  }

  async componentDidMount() {
    this.setState({
      shows: tvshows.slice(0,48),
    })  
  }


  onSubmit = (e) => {
    e.preventDefault();
    this.doSearch();
  }
  doSearch = async () => {
      console.log('src')
    const { match: { params } } = this.props;
    const showTitle = this.state.inputValue;
    const vidcloudlist = (await axios.get(`https://vidcloud9.com/search.html`, {params: {keyword: showTitle}}));

    const parser = new DOMParser();
    const vidcloudlistdom = parser.parseFromString(vidcloudlist.data, 'text/html');
    if (vidcloudlistdom.querySelectorAll('ul.listing.items li.video-block a').length == 0){
      alert('TV show not found.');
      return;
    }
    
    const shows = Array(...vidcloudlistdom.querySelectorAll('ul.listing.items li.video-block'))
                .map(e => { 
                    if (e.querySelector('a div.name').textContent.indexOf('Episode') === -1)
                    {
                        return;
                    }
                    const  titulj =  e.querySelector('a div.name').textContent.replace('HD', '').replace('720p', '').replace('1080p', '').trim();
                    return {
                        image: e.querySelector('a .img .picture img').getAttribute('src'),
                        title: titulj.slice(0, titulj.indexOf('Episode')),
                        episodes: titulj.split('Episode')[1].replace(/[^0-9]+/g, ''),
                        href: e.querySelectorAll('a')[0].getAttribute('href'),
                        ctsrating: compareTwoStrings(titulj, showTitle)
                    }
                });
    this.setState(
        {
            shows: shows.filter(e => e !== undefined).sort((a,b) => a.title.localeCompare(b.title))
        }
    )
    // const movies = (await axios.get(`${api}list_movies.json`, {
    //   params: {
    //     page: 1,
    //     limit: this.pageLimit,
    //     query_term: this.state.inputValue
    //   }
    // })).data.data;
    // this.setState({
    //   movies: movies.movies || [],
    //   currentPage: 1,
    //   totalRecords: movies.movie_count
    // })  
  }


  render() {
    return (
      <div className="container">
            {!this.state.shows && <p>Loading TV shows...</p>}
            
            <form onSubmit={this.onSubmit}>


            <div className="input-group col-6 offset-3 mb-3 my-5">
                <input type="text" className="form-control bg-primary text-light" id="searchInput" value={this.state.inputValue} onChange={this.updateInputValue} placeholder="Search"/>
                <div className="input-group-append">
                  <button type="submit" class="btn btn-primary border">Search</button>
                </div>
              </div>
            </form>
            <div className="row">
              {
                this.state.shows  && this.state.shows.length > 0 && this.state.shows.map((show,id) => (
                  <div key={id} className="col-xs-12 col-sm-6 col-md-4 col-lg-2 d-flex align-items-stretch">
                    <Link to={`/show/${show.title}`}>
                      <div className="card img-fluid bg-primary text-white mb-3 movie-image-container">
                        <div className="card-img-top movie-image-container">
                          <img className="card-img-top  movie-image" src={show.image} alt={show.title}/>
                        </div>
                        {
                            show.rating && 
                            <p className="caption0"><span className="border border-secondary badge text-dark badge-info">{show.rating}/10</span></p>
                        }
                        {
                            show.episodes && 
                            <p className="caption0"><span className="border border-secondary badge text-dark badge-info">{show.episodes} Episodes</span></p>
                        }
                          <div className="card-body">
                            <p className="card-subtitle text-center align-middle">{show.title}</p>
                          </div>
                      </div>
                    </Link>
                  </div>
                ))
              }
              </div>
      </div>
    )
  }
}

export default Shows;