import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { api } from '../../Environment/environment';
import { compareTwoStrings } from 'string-similarity';

class WatchMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      src: null,
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const movie = (await axios.get(`${api}movie_details.json?movie_id=${params.movieId}`)).data.data.movie;
    const vidcloudlist = (await axios.get(`https://vidcloud9.com/search.html`, {params: {keyword: movie.title}}));

    const parser = new DOMParser();
    const vidcloudlistdom = parser.parseFromString(vidcloudlist.data, 'text/html');
    if (vidcloudlistdom.querySelectorAll('ul.listing.items li.video-block a').length == 0){
      alert('No available stream found.');
      return;
    }
    
    const hrefl = Array(...vidcloudlistdom.querySelectorAll('ul.listing.items li.video-block'))
                .map(e => { 
                  return {
                    href: e.querySelectorAll('a')[0].getAttribute('href'),
                    rating: compareTwoStrings(e.querySelector('a div.name').textContent.replace('HD', '').replace('720p', '').replace('1080p', '').trim(), movie.title)
                  }
                });
    const href = hrefl.reduce((a,b) => a.rating > b.rating ? a : b).href;

    const vidcloudvideo = (await axios.get(`https://vidcloud9.com${href}`));
    const vidcloudvideodom = parser.parseFromString(vidcloudvideo.data, 'text/html');

    const iframesrc = vidcloudvideodom.querySelectorAll('iframe')[0].getAttribute('src');

    this.setState({
        movie,
        src: `https:${iframesrc}`,
    });
  }

  render() {
    return (
      <div className="container">
            {!this.state.movie && <p>Loading movie...</p>}
              <div className="row">
              {
                this.state.movie && 
                <iframe sandbox allowFullScreen src={this.state.src} className="col-xs-12 col-sm-12 col-md-12 col-lg-12 myh-75"></iframe>
              }
              </div>
      </div>
    )
  }
}
export default WatchMovie;