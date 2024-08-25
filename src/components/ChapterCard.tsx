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

interface CardProps {
    viewMode: boolean
}

const ChapterCard: React.FC<CardProps> = ({viewMode})  => {
    const navigate = useNavigate();
    const temp: ChatCompletionMessageParam[] = [];
    const[chapter, setChapter] = useState(-1);
    const[chapters, setChapters] = useState(-1);
    const[viewingChapter, setViewingChapter] = useState(1);
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

    function setFields(){
        const storage = localStorage.getItem('game_data');
        const chapterStorage = localStorage.getItem('chapterNumber');
        let game: any, chapterNumber: any;
        if(storage && chapterStorage){
            game = JSON.parse(storage);
            chapterNumber = JSON.parse(chapterStorage);
        }
        setChapter(parseInt(chapterNumber));
        setDescription(game.description);
        setStory(game.story);
        setPicture(game.picture);
        setOption1(game.option_1);
        setOption2(game.option_2);
        setOption3(game.option_3);
        setGameFinished(game.game_finished);
        setHistory(game.history);
    }

    function saveChapterToLocalStorage(){
        const storage = localStorage.getItem("chapters");
        const chapterStorage = localStorage.getItem("game_data");
        if(storage && chapterStorage){
            let chapters: [Object] = JSON.parse(storage);
            let generated: StoryModel = JSON.parse(chapterStorage);
            generated.history = undefined;
            console.log(chapters);
            console.log(generated);
            chapters.push(generated);
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
            console.log("Options: ", option, ", previous options: ", options);
            options.push(option);
            localStorage.setItem("chosenOptions", JSON.stringify(options));
        } else console.log("Failed to load options");

        await axios.post<StoryModel>('http://localhost:8080/game/choice/' + e.target.textContent,
            {history: history, gameEnding: gameEnding} ,
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
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

    function goHome(){
        localStorage.clear();
        navigate('/');
    }

    async function saveGame(e: any){
        setSaving(true);
        const topicData = localStorage.getItem("topic");
        const numberOfChaptersData = localStorage.getItem("numberOfChapters");
        const chaptersData = localStorage.getItem("chapters");
        const optionsData = localStorage.getItem("chosenOptions");

        let chaptersValue, topicValue, numbersValue, chosenOptions;

        if(chaptersData) chaptersValue = JSON.parse(chaptersData);
        else console.log("Chapters error!");

        if(topicData) topicValue = JSON.parse(topicData);
        else topicValue = "I'm feeling lucky!";

        if(numberOfChaptersData) numbersValue = JSON.parse(numberOfChaptersData);
        else console.log("Numbers error!");

        if(optionsData) chosenOptions = JSON.parse(optionsData);
        else console.log("Options error!");

        axios.post("http://localhost:8080/game/save",
            {topic: topicValue, numberOfChapters: numbersValue, chapters: chaptersValue, chosenOptions: chosenOptions},
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
                            <Button onClick={generateNewChapter} className="center game_buttons" disabled={loading}
                                    variant="contained"
                            >1</Button>
                            <p className="option-text">{option_1}</p>
                        </div>
                        <div className="option">
                            <Button onClick={generateNewChapter} className="center game_buttons" disabled={loading}
                                    variant="contained"
                            >2</Button>
                            <p className="option-text">{option_2}</p>
                        </div>
                        <div className="option">
                            <Button onClick={generateNewChapter} className="center game_buttons" disabled={loading}
                                    variant="contained"
                            >3</Button>
                            <p className="option-text">{option_3}</p>
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
                            <IconButton color="primary">
                                <ArrowCircleLeft/>
                            </IconButton>
                        </div>
                        <div className="navigation_button">
                            <Button variant="outlined">Return home</Button>
                        </div>
                        <div className="navigation_button">
                            <IconButton color="primary">
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