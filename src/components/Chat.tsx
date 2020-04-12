import React from 'react';

function Chat() {
  return (
    <>
      <aside>
        <div id="chat">
        </div>
      </aside>
      <textarea className="fixed-bottom form-control" id="chatInput" placeholder="메시지를 입력하세요!"></textarea>
    </>
  );
}

export default Chat;
