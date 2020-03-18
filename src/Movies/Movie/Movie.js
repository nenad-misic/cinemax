import React, {Component} from 'react';
import axios from 'axios';
import { api } from '../../Environment/environment';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Link } from 'react-router-dom';

class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      similar: null
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;

    const movie = (await axios.get(`${api}movie_details.json?movie_id=${params.movieId}&with_cast=true`)).data.data.movie;
    const similar = (await axios.get(`${api}movie_suggestions.json?movie_id=${params.movieId}`)).data.data.movies;
    this.setState({
      movie,
      similar
    });
  }

  async componentWillReceiveProps (nextProps) {
    console.log(nextProps);
    if(nextProps.match.params.movieId !== this.props.match.params.movieId) {
      this.setState({
        movie: null,
        similar: null
      });
      const { match: { params } } = this.props;

      const movie = (await axios.get(`${api}movie_details.json?movie_id=${nextProps.match.params.movieId}&with_cast=true`)).data.data.movie;
      const similar = (await axios.get(`${api}movie_suggestions.json?movie_id=${nextProps.match.params.movieId}`)).data.data.movies;
      this.setState({
        movie,
        similar
      });
    }
  }


  render() {
    const {movie, similar} = this.state;
    if (movie === null) return <p>Loading ...</p>;
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="jumbotron col-md-10 pb-5 pt-3">
            <h2 className="text-center">{movie.title} <small className="text-muted">{movie.year}</small></h2>
            
            <div className="container col">
              <div className="row text-center">
                <table className="offset-4 col-2">
                  <tbody>
                    <tr>
                      <td rowSpan="2" align="right" width="50%"><span className="fa mr-1 fa-star checked fa-2x"></span></td>
                      <td align="left" width="50%"><a className="smallerp ml-1 mt-0 color-primary" href={`https://www.imdb.com/title/${movie.imdb_code}`}>IMDB rating</a></td>
                    </tr>
                    <tr>
                      <td valign="middle" align="left" width="50%"><p className="ml-1 biggerp">{movie.rating}<span className="text-muted smallerp">/10</span></p></td>
                    </tr>
                  </tbody>
                </table>
                <table className="col-md-2">
                  <tbody>
                    <tr>
                      <td align="center" ><small className="text-muted" className="col-md-6">{Math.floor(movie.runtime / 60)}h {Math.floor(((movie.runtime / 60)- Math.floor(movie.runtime / 60)) * 60)}min</small></td>
                    </tr>
                    <tr>
                      <td valign="middle" align="center"><small className="text-muted" className="col-md-6">{movie.genres.join(', ')}</small></td>
                    </tr>
                  </tbody>
                </table>
                
                
              </div>
            </div>
            <hr className="my-4" />
            <div className="container-fluid">
              <div className="row">

                <CarouselProvider 
                  className="col col-lg-6 col-md-12 col-sm-12 col-12 mb-3 outer"
                  naturalSlideWidth={800}
                  naturalSlideHeight={450}
                  totalSlides={4}
                  infinite={true}
                >
                  <Slider>
                    <Slide index={0}>
                      <iframe className="carousel-image carousel-video" src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                      </iframe>
                    </Slide>
                    <Slide index={1}>
                      <img className="carousel-image" src={movie.background_image_original.replace('background', 'large-screenshot1')} />
                    </Slide>
                    <Slide index={2}>
                      <img className="carousel-image"  src={movie.background_image_original.replace('background', 'large-screenshot2')} />
                    </Slide>
                    <Slide index={3}>
                      <img className="carousel-image"  src={movie.background_image_original.replace('background', 'large-screenshot3')} />
                    </Slide>
                    
                  </Slider>
                <span className = "next-button align-middle">
                  <ButtonNext className="button-control">Next</ButtonNext>
                  <span className="next-button-image">
                  </span>
                </span>
                <span className = "prev-button align-middle">
                  <ButtonBack className="button-control">Prev</ButtonBack>
                  <span className="prev-button-image">
                  </span>
                </span>
                
                </CarouselProvider>

                <div className="col col-lg-6 col col-md-12 col-sm-12 col-12 mb-3 container">
                  <div className="row">
                      <div className="synopsis col col-sm-12 col-12">
                        <h4>Synopsis:</h4>
                        <p className="text-justify">{movie.description_full}</p>
                      </div>
                      <div className="cast col col-md-6 col-sm-12 col-12 container-fluid">
                        <h4 className="my-3">Cast:</h4>
                        <div className="row">
                          {
                            movie.cast && movie.cast.map((e,i) => {
                              return (
                                <div key={i} className="col col-sm-12 col-12 my-1 container-fluid text-center">
                                  <div className="row">
                                    <div className="col col-sm-2 col-2">
                                      <img className="cast-image border border-primary" src={e.url_small_image  || '/secret.png'}/>
                                    </div>
                                    <span className="offset-1 col text-left col-sm-9 col-9 text-info m-auto">
                                    <a className="text-info" href={`https://www.imdb.com/name/nm${e.imdb_code}`}>{e.name}</a> <small className="text-muted">as {e.character_name}</small>
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                      <div className="related-movies col col-md-6 col-sm-12 col-12 container-fluid">
                        <h4 className="my-3">Similar movies:</h4>
                        <div className="row">
                          <CarouselProvider 
                            className="offset-2 col col-sm-8 col-8 mb-3 outer"
                            naturalSlideWidth={115}
                            naturalSlideHeight={173}
                            totalSlides={4}
                            infinite={true}
                          >
                            <Slider>
                              {
                            
                            similar && similar.map((e,i) => {
                              return (
                                <Slide index={1} key={i}>
                                  <Link to={`/movie/${e.id}`}>
                                     <div className="carousel-image card img-fluid bg-primary text-white mb-3">
                                       <div className="card-img-top movie-image-container">
                                         <img className="card-img-top" src={e.medium_cover_image} alt={e.title_long}/>
                                       </div>
                                       <p className="caption0"><span className="border border-secondary badge text-black badge-light">{e.title_long.length > 20 ? `${e.title_long.substring(0,18)}...` : e.title_long}</span></p>
                                       <p className="caption1"><span className="border border-secondary badge text-dark badge-success">{e.rating}/10</span></p>
                                     </div>
                                   </Link>
                                </Slide>
                              );
                            })
                          }
                            </Slider>
                          <span className = "next-button-similar align-middle">
                            <ButtonNext className="button-control-similar">Next</ButtonNext>
                            <span className="next-button-image-similar">
                            </span>
                          </span>
                          <span className = "prev-button-similar align-middle">
                            <ButtonBack className="button-control-similar">Prev</ButtonBack>
                            <span className="prev-button-image-similar">
                            </span>
                          </span>
                          
                          </CarouselProvider>
                          
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row justify-content-center container-fluid">
                {
                  movie &&
                    <div className="col offset-5 col-4 container-fluid">
                      <Link to={`/watch-movie/${movie.id}`}>
                        <div class="btn btn-success">Watch movie</div>
                      </Link>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
         
    )

    
  }

  getMovieFromDom(movieDom) {
    const imageSrc = movieDom.querySelectorAll('#movie-poster .img-responsive')[0].getAttribute('src')

    const title = movieDom.querySelectorAll('#mobile-movie-info h1')[0].textContent
    
    const year = movieDom.querySelectorAll('#mobile-movie-info h2')[0].textContent
    
    const genre = movieDom.querySelectorAll('#mobile-movie-info h2')[1].textContent
    
    const magnets = Array.from(movieDom.querySelectorAll('.modal-content .modal-torrent')).map(e => {
        return {
            title: e.querySelector('.magnet').getAttribute('title'),
            magnet: e.querySelector('.magnet').getAttribute('href'),
            quality: e.querySelector('div.modal-quality').getAttribute('id').split('-').pop(),
            torrentType: e.querySelectorAll('p.quality-size')[0].textContent,
            size: e.querySelectorAll('p.quality-size')[1].textContent,
            downloadUrl: e.querySelector('a.download-torrent').getAttribute('href') 
        } 
    });
    
    
    const ratings = Array.from(movieDom.querySelectorAll('div.rating-row'))
    .map(e => {
        return {
            title: e.querySelector('a.icon')?.getAttribute('title'),
            url : e.querySelector('a.icon')?.getAttribute('href'),
            rating: e.querySelector('span')
        }
    })
    .filter(e => e.title);
    
    const similarMovies = Array.from(movieDom.querySelectorAll('div#movie-related a')).map(e => {
        return {
            title: e.getAttribute('title'),
            url: e.getAttribute('href'),
            imageSrc: e.querySelector('img').getAttribute('src') 
        }
    });
    
    const screenshots = Array.from(movieDom.querySelectorAll('div#screenshots .screenshot a')).map(e => {
        return {
            url: e.getAttribute('href'),
            imageSrc: e.querySelector('img')?.getAttribute('src') 
        }
    }).filter(e => e.imageSrc);
    
    const trailer = movieDom.querySelector('div#screenshots .screenshot a.youtube').getAttribute('href');
    
    const synopsis = movieDom.querySelector('div#synopsis p').textContent;
    
    const allSubtitles = Array.from(movieDom.querySelectorAll('div#movie-tech-specs div.tech-spec-info')).map(e => {
        return {
            fileSize: e.querySelector('span[title="File Size"]').parentNode.childNodes[1].textContent.trim(),
            link: e.querySelector('span[title="Subtitles"]').parentNode.querySelector('a').getAttribute('href')
        };
    })
    
    const subtitle = movieDom.querySelector('span[title="Subtitles"]').parentNode.querySelector('a').getAttribute('href');

    return {
        title,
        year,
        genre,
        synopsis,
        imageSrc,
        magnets,
        ratings,
        similarMovies,
        screenshots,
        trailer,
        allSubtitles,
        subtitle
    }
  }
}

export default Movie;