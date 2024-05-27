import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
    const[chapter, setChapter] = useState(-1);

  return (
    <div className="app">
      <header className="header">
        <p className="center">
          This is header!
        </p>
      </header>
      <body>
      <div className= "body">
          <h1 className="title">Chapter {chapter}: Title</h1>
          <p className="text-center">Welcome to Nova Prime, a futuristic city located on the distant planet of Xerion. As a new resident, you quickly discover that the city holds many secrets and hidden agendas among its glittering skyscrapers and advanced technology.</p>
          <div className="image"><img src="./TestImage.png" alt="Nova Prime" /></div>
          <div className="center option-field">
              <div className="center option">
                  <button className="center button">1</button>
                  <p>Join a rebel group seeking to overthrow the corrupt government.</p>
              </div>
              <div className="center option">
                  <button className="center button">2</button>
                  <p>Work for a powerful corporation to gain insider knowledge.</p>
              </div>
              <div className="center option">
                  <button className="center button">3</button>
                  <p>Explore the city's underground network to find the truth.</p>
              </div>
          </div>
      </div>
      </body>
        <footer className="footer">
        <p>
          This is bottom of the page!
        </p>
      </footer>
    </div>
  );
}

export default App;
