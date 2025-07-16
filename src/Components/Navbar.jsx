import React from 'react'
import Catogries from './Catogries'
import {
  Link
} from "react-router-dom";

const Navbar = () => {
  
  return (
    <div>
      {/* <nav class="navbar bg-dark text-light">
  <div class="container-fluid d-flex" >
    <Link class="navbar-brand" to="/">
      <img src="https://cdn.logojoy.com/wp-content/uploads/2018/12/14141836/ic_image.svg" alt="Logo" width="50" height="40" class="d-inline-block align-text-top"/>
    </Link>
    <div>
      <h2>Quicy</h2>
      </div>
    <div>
      <Link class="btn btn-primary" to="/" role="button">Link</Link>
      </div>
  </div>
</nav> */}
<Catogries/>
    </div>
  )
}

export default Navbar
