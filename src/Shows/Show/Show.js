import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { compareTwoStrings } from 'string-similarity';

class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTitle: null,
      src: null,
      episodes: [],
      href: null
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const showTitle = params.showTitle;
    const vidcloudlist = (await axios.get(`https://vidcloud9.com/search.html`, {params: {keyword: showTitle}}));

    const parser = new DOMParser();
    const vidcloudlistdom = parser.parseFromString(vidcloudlist.data, 'text/html');
    if (vidcloudlistdom.querySelectorAll('ul.listing.items li.video-block a').length == 0){
      alert('TV show not found.');
      return;
    }
    
    const hrefl = Array(...vidcloudlistdom.querySelectorAll('ul.listing.items li.video-block'))
                .map(e => { 
                    
                  return {
                    href: e.querySelectorAll('a')[0].getAttribute('href'),
                    rating: e.querySelector('a div.name').textContent.indexOf('Season') !== -1 ?  compareTwoStrings(e.querySelector('a div.name').textContent.replace('HD', '').replace('720p', '').replace('1080p', '').trim(), showTitle) : -1
                  }
                });
    const href = hrefl.reduce((a,b) => a.rating > b.rating ? a : b).href;

    const vidcloudvideo = (await axios.get(`https://vidcloud9.com${href}`));
    const vidcloudvideodom = parser.parseFromString(vidcloudvideo.data, 'text/html');

    const iframesrc = vidcloudvideodom.querySelectorAll('iframe')[0].getAttribute('src');

    const episodes = Array(...vidcloudvideodom.querySelectorAll('.listing.items.lists .video-block')).map(e => {
        return { 
            title: e.querySelector('.name').textContent.trim(),
            link: e.querySelector('a').getAttribute('href')
        }
    }).map(e => {
        return {
            title: e.title.slice(e.title.indexOf('Episode')),
            link: e.link
        }
    });
    this.setState({
        showTitle,
        src: `https:${iframesrc}`,
        episodes,
        href
    });
  }

  async episodeChange(element) {
    console.log('shit happen');
    if(element.link === this.state.href){
        return;
    }

    const vidcloudvideo = (await axios.get(`https://vidcloud9.com${element.link}`));
    
    const parser = new DOMParser();
    const vidcloudvideodom = parser.parseFromString(vidcloudvideo.data, 'text/html');
    
    const iframesrc = vidcloudvideodom.querySelectorAll('iframe')[0].getAttribute('src');
    
    // const episodes = Array(...vidcloudvideodom.querySelectorAll('.listing.items.lists .video-block')).map(e => {
    //     return { 
    //         title: e.querySelector('.name').textContent.trim(),
    //         link: e.querySelector('a').getAttribute('href')
    //     }
    // }).map(e => {
    //     return {
    //         title: e.title.slice(e.title.indexOf('Episode')),
    //         link: e.link
    //     }
    // });
    this.setState({
        src: `https:${iframesrc}`,
        href: element.link
    });

    
    
  }

  render() {
    return (
      <div className="container">
            {!this.state.showTitle && <p>Loading show...</p>}
              <div className="row">
              {
                this.state.showTitle && 
                <iframe allowFullScreen src={this.state.src} className="col-xs-12 col-sm-12 col-md-12 col-lg-12 myh-75"></iframe>
              }
              <div class="list-group col col-xs-12">
                {
                    this.state.episodes &&
                    this.state.episodes.map( e => (
                        <button type="button" onClick={() => this.episodeChange(e)} className={`list-group-item list-group-item-action${e.link === this.state.href ? ' active list-group-item-info' : ''}`}>{e.title}</button>
                    ))
              }
            </div>
        </div>
      </div>
    )
  }
}
export default Show;