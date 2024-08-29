import {Button, Card, CardContent} from "@mui/material";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {StoryModel} from "../models/StoryModel";
import {basePath} from "../typescripts/Utils";
import axios from "axios";
import {getCookie} from "typescript-cookie";

interface GameData{
    gameId: number,
    topic: string,
    numOfChapters: number
}

const GameInfo: React.FC<GameData> = ({gameId, topic, numOfChapters}) => {
    const navigate = useNavigate();
    const[viewDisabled, setViewDisabled] = useState(false);

    async function loadGame(){
        setViewDisabled(true);
        localStorage.setItem("numberOfChapters", JSON.stringify(numOfChapters));
        localStorage.setItem("topic", JSON.stringify(topic));
        localStorage.setItem("game_id", JSON.stringify(gameId));

        await axios.post<StoryModel>(basePath + "/game/chapter", {game_id: gameId, chapter: 1},
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
            }}).then((response) => {
                localStorage.setItem("game_data", JSON.stringify(response.data));
            }).catch((err) => {
            console.log("Failed to load chapter.", err);
        })
        setViewDisabled(false);
        navigate('/view');
    }

    return (
        <Card className="game_card">
            <CardContent className="game_id">{gameId}</CardContent>
            <CardContent className="game_topic">{topic}</CardContent>
            <CardContent className="game_description">{numOfChapters}</CardContent>
            <CardContent className="game_view">
                <Button variant="outlined" color="primary"
                        onClick={loadGame}
                        disabled={viewDisabled}
                >
                    View
                </Button>
            </CardContent>
            <span/>
        </Card>
    )
}


export default GameInfo;