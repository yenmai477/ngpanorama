import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NavBar = ({ title, icon, changeRoute }) => {
  return (
    <nav className="navbar bg-primary animated">
      <h1>
        <i className={icon} />
        {title}
      </h1>
      <ul>
        <li>
          <Link onClick={changeRoute} to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
};

NavBar.defaultProps = {
  title: "NgPanorama",
  icon: "fas fa-camera-retro mr-1",
};
NavBar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default NavBar;
