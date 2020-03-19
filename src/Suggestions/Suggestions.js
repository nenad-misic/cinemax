import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { compareTwoStrings } from 'string-similarity';
import { api } from '../Environment/environment';

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
        movies: [],
    };
  }

  async componentDidMount() {
    // const movies = [
    //     3709,
    //     3304,
    //     3175,
    //     2429,
    //     2640,
    //     1151,
    //     1208,
    //     1606
    // ];
    const movies = [];
    const seed = (new Date).getDate();
    for (let i = 0; i < 10; i++) {

        movies.push((await axios.get(`${api}list_movies.json?sort_by=rating&with_images=true&limit=1&page=${(i+1)*seed}`)).data.data.movies[0])
    }
    // const details = [];
    // for (let i of movies){
    //     details.push((await axios.get(`${api}movie_details.json?movie_id=${i}`)).data.data.movie);
    // }


    this.setState({
        movies: movies,
    });
  }

  render() {
      console.log('r');
    return (
    //   <div className="container-fluid">
    //       <div className="row">
    //               {
    //                   this.state.movies && this.state.movies.map(e => (
    //                     <div className="cnt col-6">
    //                         <img className="imaz ol col-12 my-3" src={e.background_image_original}>
    //                           </img>
    //                         <h1 className="teksta">{e.title_long}</h1>
    //                     </div>
                          
    //                   ))
    //               }
    //       </div>
    //   </div>

    <div className="container-fluid">
        <h1 className="col-12 m-5">
            Suggestions:
        </h1>
        
    <div className="row col-12">
    {
        this.state.movies && this.state.movies.map(e => (
            // <div class="col-lg-6 mb-3 mb-lg-0">
            //     <div class="hover hover-2 text-white rounded">
            //         <img src={e.background_image_original} alt=""/>
            //         <div class="hover-overlay"></div>
            //         <div class="hover-2-content px-5 py-4">
            //             <h3 class="hover-2-title text-uppercase font-weight-bold mb-0">{e.title_long}</h3>
            //             <p class="hover-2-description text-uppercase mb-0">{e.description_full}</p>
            //         </div>
            //     </div>
            // </div>
            

      <div className="col-6 my-5">
      <Link to={`/movie/${e.id}`}>
        <div className="hover hover-2 text-white rounded">
          <img src={e.background_image_original} alt=""/>
          <div className="hover-overlay"></div>
          <div className="hover-2-content px-5 py-4">
            <h3 className="hover-2-title text-uppercase font-weight-bold mb-0">{e.title_long}</h3>
            <p className="hover-2-description mb-0">{e.description_full}</p>
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
export default Suggestions;