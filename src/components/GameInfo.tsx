import {Button, Card, CardContent} from "@mui/material";
import React, {useState} from "react";

interface GameData{
    gameId: number,
    topic: string,
    numOfChapters: number
}

const GameInfo: React.FC<GameData> = ({gameId, topic, numOfChapters}) => {
    const[viewDisabled, setViewDisabled] = useState(false);

    async function loadGame(){
        setViewDisabled(true);



        setViewDisabled(false);
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