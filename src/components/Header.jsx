// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <h1>Post & Comment Platform</h1>
      </div>
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create">Create Post</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;