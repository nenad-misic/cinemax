import React from 'react';
import {Link} from 'react-router-dom';

function NavBar() {
  return (
    // <nav className="navbar navbar-dark bg-primary fixed-top">
    //   <Link className="navbar-brand" to="/">
    //     Cinemax
    //   </Link>
    // </nav>

    <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
    <Link className="navbar-brand" to="/">
      Cinemax
    </Link>
    <button className="navbar-toggler border" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
      <li className="nav-item">
      <Link className="nav-link px-4" to="/movies">
      Movies
    </Link>
      </li>
      <li className="nav-item">
      <Link className="nav-link px-4" to="/shows">
      TV shows
    </Link>
      </li>
    </ul>
  </div>
</nav>
  );
}

export default NavBar;