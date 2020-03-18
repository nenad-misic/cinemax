import React from 'react';
import {Link} from 'react-router-dom';

function NavBar() {
  return (
    // <nav className="navbar navbar-dark bg-primary fixed-top">
    //   <Link className="navbar-brand" to="/">
    //     Cinemax
    //   </Link>
    // </nav>

    <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
    <Link className="navbar-brand" to="/">
      Cinemax
    </Link>
    <button class="navbar-toggler border" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
      <li class="nav-item">
      <Link className="nav-link px-4" to="/movies">
      Movies
    </Link>
      </li>
      <li class="nav-item">
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