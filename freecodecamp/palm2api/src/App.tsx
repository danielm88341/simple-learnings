import React from 'react';
import './index.css';

function App() {
  // @ts-ignore
  return (
    <div className="chat-bot">
      <div className="chat-header">
        <div className="info-container">
          <h3>Chat with the</h3>
          <h2>PaLM2 Bot</h2>
        </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="rgb(6, 120, 84)" fillOpacity="1"
                    d="M0,224L60,218.7C120,213,240,203,360,186.7C480,171,600,149,720,154.7C840,160,960,192,1080,186.7C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
      </div>
      <div className="feed">
        <div className="question bubble"></div>
        <div className="response bubble"></div>
      </div>
      <textarea name="input" id="chatinput" value="" ></textarea>
      <button >⇨</button>
    </div>
  );
}

export default App;
