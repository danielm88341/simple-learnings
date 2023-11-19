import React from 'react';

function App() {
  // @ts-ignore
  return (
    <div className="chat-bot">
      <div className="chat-header">
        <div className="infocontainer">
          <h3>Chat with the</h3>
          <h2>PaLM2 Bot</h2>
        </div>
        //svg
      </div>
      <div className="feed">
        <div className="question bubble"></div>
        <div className="response bubble"></div>
      </div>
      {/*<textarea name="input" id="chatinput" value="" onChange={}></textarea>*/}
      {/*<button onClick={}>⇨</button>*/}
    </div>
  );
}

export default App;
