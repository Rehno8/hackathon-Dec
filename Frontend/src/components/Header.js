import React from 'react'
import { Link } from 'react-router-dom'
// import Home from '../pages/Frontend/Home'
// import Login from '../pages/Auth/Login'

export default function Header() {
  return (
    <header>
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
  <div className="container">
    <Link to='/frontend' className="navbar-brand">Eventura</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link to='/frontend' className="nav-link active" aria-current="page">Home</Link>
        </li>
        <li className="nav-item">
          <Link to='/event' className="nav-link active" aria-current="page">Events</Link>
        </li>
      </ul>
      <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        {/* <Link to='/login' className="btn btn-danger">Logout</Link> */}
      </form>
    </div>
  </div>
</nav>
    </header>
  )
}
