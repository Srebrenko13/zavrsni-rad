import React, {useState, useEffect} from 'react';
import axios, {AxiosResponse} from "axios";
import {StoryModel} from "../models/StoryModel";
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const temp: ChatCompletionMessageParam[] = [];
    const[chapter, setChapter] = useState(-1);
    const[description, setDescription] = useState("No response yet :(");
    const[story, setStory] = useState("One blank story...");
    const[picture, setPicture] = useState("");
    const[option_1, setOption1] = useState("No option");
    const[option_2, setOption2] = useState("No option");
    const[option_3, setOption3] = useState("No option");
    const[game_finished, setGameFinished] = useState(false);
    const[history, setHistory] = useState(temp);
    const[loading, setLoading] = useState(false);

    function setFields(){
        const storage = localStorage.getItem('game_data');
        let game: any;
        if(storage){
            game = JSON.parse(storage);
        }
        setChapter(game.chapter);
        setDescription(game.description);
        setStory(game.story);
        setPicture(game.picture);
        setOption1(game.option_1);
        setOption2(game.option_2);
        setOption3(game.option_3);
        setGameFinished(game.game_finished);
        setHistory(game.history);
        console.log(game);
    }

    useEffect(() => {
        const storage = localStorage.getItem('game_data')
        let game: any;
        if(storage){
            game = JSON.parse(storage);
            setFields();
        }
    }, [chapter]);

    async function generateNewChapter(e: any){
        setLoading(true);
        await axios.post<StoryModel>('http://localhost:8080/game/choice/' + e.target.textContent, {history: history}).then((response) => {
            localStorage.setItem('game_data', JSON.stringify(response.data));
            setFields();
        }).catch().finally(() => {
            setLoading(false);
        });
    }

    function goHome(){
        navigate('/');
    }

  return (
    <div className="app">
      <div className= "body">
          <h1 className="title">Chapter {chapter}: {description}</h1>
          <p className="text-center">{story}</p>
          <div className="image"><img src={picture} alt="Nema slike, sirotinja smo!" /></div>
          {!game_finished && (
              <div className="center option-field">
                  <div className="center option">
                      <button onClick={generateNewChapter} className="center button">1</button>
                      <p>{option_1}</p>
                  </div>
                  <div className="center option" hidden={game_finished}>
                      <button onClick={generateNewChapter} className="center button">2</button>
                      <p>{option_2}</p>
                  </div>
                  <div className="center option" hidden={game_finished}>
                      <button onClick={generateNewChapter} className="center button">3</button>
                      <p>{option_3}</p>
                  </div>
              </div>
          )}
          {game_finished && (
              <div className="center option-field">
                  <p className="title">Thank you for playing the game!</p>
                  <button className="center end_button" onClick={goHome}>End game</button>
              </div>
          )}
      </div>
        {loading && (
            <div className="loading_overlay">
                <div className="loading_message">
                    <p>Loading...</p>
                </div>
            </div>
        )}
    </div>
  );
}

export default App;
