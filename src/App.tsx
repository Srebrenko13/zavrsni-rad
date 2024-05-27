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
          <p className="text-center">Once upon a time, in a quaint village surrounded by rolling hills and lush meadows, lived a little boy named Tado. Tado was known for his boundless curiosity and infectious laughter that brought joy to everyone around him. He had a knack for finding adventure in the most ordinary places, whether it was a hidden nook in his grandmother's garden or a secret path through the village woods.</p>
          <div className="center option-field">
              <div className="center option">
                  <button className="center button">1</button>
                  <p>Option 1</p>
              </div>
              <div className="center option">
                  <button className="center button">2</button>
                  <p>Option 2</p>
              </div>
              <div className="center option">
                  <button className="center button">3</button>
                  <p>Option 3</p>
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
