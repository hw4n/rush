import React from 'react';

import Sidebar from './Sidebar';
import Chat from './Chat';

function Main() {
  return (
    <div className="main">
      <Sidebar/>
      <Chat/>
    </div>
  );
}

export default Main;
