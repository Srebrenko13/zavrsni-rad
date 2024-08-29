import React, {useEffect, useState} from "react";
import {Box, Button, Card, IconButton, LinearProgress} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {StoryModel} from "../models/StoryModel";
import axios from "axios";
import {getCookie} from "typescript-cookie";
import OpenAI from "openai";
import '../stylesheets/ChapterCard.css'
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import {ArrowCircleLeft, ArrowCircleRight} from "@mui/icons-material";
import {basePath} from "../typescripts/Utils";

interface CardProps {
    viewMode: boolean
}

const ChapterCard: React.FC<CardProps> = ({viewMode})  => {
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
    const[saving, setSaving] = useState(false);
    const[alreadySaved, setAlreadySaved] = useState(false);
    const[chosenOption, setChosenOption] = useState(-1);
    const[gameId, setGameId] = useState(-1);

    function setFields(){
        const storage = localStorage.getItem('game_data');
        const chapterStorage = localStorage.getItem('chapterNumber');
        let game: any, chapterNumber: any;
        if(storage) game = JSON.parse(storage);
        if(chapterStorage && !viewMode) chapterNumber = JSON.parse(chapterStorage);

        if(!viewMode) setChapter(parseInt(chapterNumber));
        else setChapter(game.chapter);
        setDescription(game.description);
        setStory(game.story);
        setPicture(game.picture);
        setOption1(game.option_1);
        setOption2(game.option_2);
        setOption3(game.option_3);
        setGameFinished(game.game_finished);
        if(!viewMode) setHistory(game.history);
        if(viewMode && !game_finished) setChosenOption(game.chosen_option);
    }

    function loadGameId(){
        const storage = localStorage.getItem("game_id");
        if(storage) setGameId(JSON.parse(storage));
    }

    function goHome(){
        localStorage.clear();
        navigate('/');
    }

    function goProfile(){
        localStorage.clear();
        navigate('/profile');
    }

    async function previousChapter(){
        setLoading(true);

        await axios.post<StoryModel>(basePath + "/game/chapter", {game_id: gameId, chapter: chapter - 1},
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }}).then((response) => {
            localStorage.setItem("game_data", JSON.stringify(response.data));
            setFields();
        }).catch((err) => {
            console.log("Failed to load chapter.", err);
        });

        setLoading(false);
    }

    async function nextChapter(){
        setLoading(true);

        await axios.post<StoryModel>(basePath + "/game/chapter", {game_id: gameId, chapter: chapter + 1},
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }}).then((response) => {
            localStorage.setItem("game_data", JSON.stringify(response.data));
            setFields();
        }).catch((err) => {
            console.log("Failed to load chapter.", err);
        });

        setLoading(false);
    }

    async function replayGame(){
        setLoading(true);
        let oldChapters: StoryModel[] = [];
        for(let i = 1; i < chapter; i++){
            await axios.post<StoryModel>(basePath + "/game/chapter", {game_id: gameId, chapter: i},
                {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }}).then((response) => {
                oldChapters.push(response.data);
            }).catch((err) => {
                console.log("Failed to load chapter.", err);
            });
        }
        localStorage.setItem("chapters", JSON.stringify(oldChapters));
        localStorage.setItem("chapterNumber", JSON.stringify(chapter));
        saveChapterToLocalStorage();

        await axios.post<ChatCompletionMessageParam[]>(basePath + "/game/replay",
            {previousChapters: oldChapters, numberOfChapters: chapters},
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }}).then((response) => {
                        console.log(response.data);
                        saveHistory(response.data);
            }).catch((err) => {
                console.log("Error getting message history. ", err);
        });
        setLoading(false);
        navigate('/game');
    }

    function saveHistory(history: ChatCompletionMessageParam[]){
        const chapterStorage = localStorage.getItem("game_data");
        if(chapterStorage){
            let current = JSON.parse(chapterStorage);
            current.history = history;
            localStorage.setItem("game_data", JSON.stringify(current));
        }
    }

    function saveChapterToLocalStorage(){
        const storage = localStorage.getItem("chapters");
        const chapterStorage = localStorage.getItem("game_data");
        if(storage && chapterStorage){
            let chapters: [StoryModel] = JSON.parse(storage);
            let generated: StoryModel = JSON.parse(chapterStorage);
            generated.history = undefined;
            chapters.push(generated);
            localStorage.setItem("chapters", JSON.stringify(chapters));
        }
    }

    function saveChosenOption(option: number){
        const storage = localStorage.getItem("chapters");
        if(storage){
            let chapters: [StoryModel] = JSON.parse(storage);
            let lastChapter: StoryModel = chapters[chapters.length - 1];
            chapters.pop();
            lastChapter.chosen_option = option;
            chapters.push(lastChapter);
            localStorage.setItem("chapters", JSON.stringify(chapters));
        }
    }

    function updateChapterNumber(){
        const chapterStorage = localStorage.getItem("chapterNumber");
        if(chapterStorage){
            let savedChapter = parseInt(chapterStorage);
            savedChapter++;
            localStorage.setItem("chapterNumber", savedChapter.toString());
        }
    }

    async function generateNewChapter(e: any){
        setLoading(true);

        const option = parseInt(e.target.textContent);
        const optionsData = localStorage.getItem("chosenOptions");
        if(optionsData){
            let options: [number] = JSON.parse(optionsData);
            options.push(option);
            localStorage.setItem("chosenOptions", JSON.stringify(options));
        } else console.log("Failed to load options");

        await axios.post<StoryModel>(basePath + '/game/choice/' + e.target.textContent,
            {history: history, gameEnding: gameEnding} ,
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
                saveChosenOption(option);
                updateChapterNumber();
                response.data.chapter = chapter + 1;
                localStorage.setItem('game_data', JSON.stringify(response.data));
                setFields();
                saveChapterToLocalStorage();
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            });
    }

    async function saveGame(e: any){
        setSaving(true);
        const topicData = localStorage.getItem("topic");
        const numberOfChaptersData = localStorage.getItem("numberOfChapters");
        const chaptersData = localStorage.getItem("chapters");

        let chaptersValue, topicValue, numbersValue;

        if(chaptersData) chaptersValue = JSON.parse(chaptersData);
        else console.log("Chapters error!");

        if(topicData) topicValue = JSON.parse(topicData);
        else topicValue = "I'm feeling lucky!";

        if(numberOfChaptersData) numbersValue = JSON.parse(numberOfChaptersData);
        else console.log("Numbers error!");

        axios.post("http://localhost:8080/game/save",
            {topic: topicValue, chapters: chaptersValue},
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }}).then((response => {
            console.log(response.data);
            setAlreadySaved(true);
        })).catch((err) => {
            console.log(err);
        });

        setSaving(false);
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
        console.log(history);
        loadGameId();
    }, []);

    return(
        <Box>
            <Card className="body">
                <h1 className="title">Chapter {chapter}: {description}</h1>
                <p className="text-center">{story}</p>
                <div className="image"><img src={picture} alt="Loading image failed. :(" /></div>
                {!game_finished && (
                    <div className="option-field" hidden={game_finished}>
                        <div className="option">
                            <Button onClick={generateNewChapter} className="center game_buttons"
                                    disabled={loading || viewMode}
                                    variant="contained"
                            >1</Button>
                            <p className="option-text" style={chosenOption === 1 ? {fontWeight: 'bold'} : {}}>{option_1}</p>
                        </div>
                        <div className="option">
                            <Button onClick={generateNewChapter} className="center game_buttons"
                                    disabled={loading || viewMode}
                                    variant="contained"
                            >2</Button>
                            <p className="option-text" style={chosenOption === 2 ? {fontWeight: 'bold'} : {}}>{option_2}</p>
                        </div>
                        <div className="option">
                            <Button onClick={generateNewChapter} className="center game_buttons"
                                    disabled={loading || viewMode}
                                    variant="contained"
                            >3</Button>
                            <p className="option-text" style={chosenOption === 3 ? {fontWeight: 'bold'} : {}}>{option_3}</p>
                        </div>
                    </div>
                )}
                {game_finished && !viewMode && (
                    <div>
                        <p className="title thank_you_text">Thank you for playing!</p>
                        <div className="end_buttons">
                            <div className="end_button">
                                <Button className="game_buttons" onClick={saveGame}
                                        variant={alreadySaved ? "contained" : "outlined"}
                                        disabled={saving || alreadySaved}
                                >{alreadySaved ? "Save successful" : "Save game"}
                                </Button>
                            </div>
                            <div className="end_button">
                                <Button className="game_buttons" onClick={goHome} variant="contained">End game</Button>
                            </div>
                        </div>
                    </div>
                )}
                {viewMode && (
                    <div className="navigation_buttons">
                        <div className="navigation_button">
                            <IconButton color="primary"
                                        onClick={previousChapter}
                                        disabled={chapter === 1 || loading}
                            >
                                <ArrowCircleLeft/>
                            </IconButton>
                        </div>
                        <div className="navigation_button" onClick={goProfile}>
                            <Button variant="outlined">Return to profile</Button>
                        </div>
                        <div className="navigation_button" onClick={replayGame}>
                            <Button variant="outlined" disabled={game_finished}>
                                Replay game
                            </Button>
                        </div>
                        <div className="navigation_button">
                            <IconButton color="primary"
                                        onClick={nextChapter}
                                        disabled={chapter === chapters || loading}
                            >
                                <ArrowCircleRight/>
                            </IconButton>
                        </div>

                    </div>
                )}
                {loading && (
                    <LinearProgress/>
                )}
            </Card>
        </Box>
    )
}

export default ChapterCard;