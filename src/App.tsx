import React from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div id="mainRow" className="row">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  );
}

export default App;
