import React, {useState, useEffect} from 'react';
import axios from "axios";
import {StoryModel} from "../models/StoryModel";
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import {useNavigate} from "react-router-dom";
import {Box, Button, Card, LinearProgress} from "@mui/material";
import '../stylesheets/Game.css'

function App() {
    const navigate = useNavigate();
    const temp: ChatCompletionMessageParam[] = [];
    const[chapter, setChapter] = useState(-1);
    const[chapters, setChapters] = useState(-1);
    const[gameEnding, setGameEnding] = useState(false);
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
    }

    useEffect(() => {
        const storage = localStorage.getItem('game_data');
        if(storage) setFields();

        if(chapter === (chapters - 1)) setGameEnding(true);
    }, [chapter]);

    useEffect(() => {
        const gameChapters = localStorage.getItem("numberOfChapters");
        if(gameChapters){
            const numberOfChapters = parseInt(gameChapters);
            setChapters(numberOfChapters);
        }
    }, []);

    async function generateNewChapter(e: any){
        setLoading(true);
        await axios.post<StoryModel>('http://localhost:8080/game/choice/' + e.target.textContent,
            {history: history, gameEnding: gameEnding}).then((response) => {
            localStorage.setItem('game_data', JSON.stringify(response.data));
            setFields();
        }).catch().finally(() => {
            setLoading(false);
        });
    }

    function goHome(){
        localStorage.removeItem("numberOfChapters");
        navigate('/');
    }

  return (
    <Box>
      <Card className="body">
          <h1 className="title">Chapter {chapter}: {description}</h1>
          <p className="text-center">{story}</p>
          <div className="image"><img src={picture} alt="Loading image failed. :(" /></div>
          {!game_finished && (
              <div className="center option-field" hidden={game_finished}>
                  <div className="center option">
                      <Button onClick={generateNewChapter} className="center button" disabled={loading}
                        variant="contained"
                      >1</Button>
                      <p className="option-text">{option_1}</p>
                  </div>
                  <div className="center option">
                      <Button onClick={generateNewChapter} className="center button" disabled={loading}
                              variant="contained"
                      >2</Button>
                      <p className="option-text">{option_2}</p>
                  </div>
                  <div className="center option">
                      <Button onClick={generateNewChapter} className="center button" disabled={loading}
                              variant="contained"
                      >3</Button>
                      <p className="option-text">{option_3}</p>
                  </div>
              </div>
          )}
          {game_finished && (
              <div className="center option-field">
                  <p className="title thank_you_text">Thank you for playing the game!</p>
                  <Button className="center end_button" onClick={goHome} variant="contained">End game</Button>
              </div>
          )}
          {loading && (
              <LinearProgress/>
          )}
      </Card>
    </Box>
  );
}

export default App;
