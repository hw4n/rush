import React from 'react';

function Chat() {
  return (
    <>
      <div className="px-0 border col-md-9">
        <div id="chat">
        </div>
      </div>
      <textarea className="fixed-bottom form-control" id="chatInput" placeholder="메시지를 입력하세요!"></textarea>
    </>
  );
}

export default Chat;
