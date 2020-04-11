import React from 'react';

function Sidebar() {
  return (
    <div className="border col-md-3">
      <div>
        <input className="mt-3 slider" type="range" id="volumeControl" min="0" max="100" value="50"></input>
        <h4 className="pl-2 pt-4"><strong>재생 중</strong></h4>
        <ul>
          <li id="nowPlaying"></li>
        </ul>
        <h4 className="pl-2 pt-4"><strong>재생 대기열</strong></h4>
        <ul id="musicQueue">
          
        </ul>
      </div>
      <div>
        <h4 className="pl-2 pt-4"><strong>접속중인 유저</strong></h4>
        <ul id="userlist">
        </ul>
      </div>
      {/* <video id="streamPlayer" muted="muted" autoplay controls style="height: 40px; width: 100%;"></video> */}
    </div>
  );
}

export default Sidebar;
