import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/"><strong>RUSH</strong></a>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <a className="nav-link" href="/chat">Chat</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
