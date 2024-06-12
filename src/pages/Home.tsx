import React, {useState, useEffect} from 'react'
import {redirect, useNavigate} from "react-router-dom";
import {StoryModel} from "../models/StoryModel";
import axios from "axios";
import {Box, Button, Card, CardActions, CardContent, TextField} from "@mui/material";

function Home(){
    const navigate = useNavigate();
    const[topic, setTopic] = useState("");

    function handleTopicChange(e: any){
        setTopic(e.target.value);
    }

    async function navigateToGame(e: any) {
        console.log("Calling post with topic: ", topic);
        await axios.post<StoryModel>('http://localhost:8080/game/start', {topic: topic}).then((response) => {
            localStorage.setItem('game_data', JSON.stringify(response.data));
            console.log(response.data);
        }).catch();
        navigate("/game");
    }

    return(
        <Box>
            <Card className="play_box">
                <CardContent className="play_box">
                    <TextField fullWidth id="outlined-basic" label="Please input chosen topic of your game!"
                           onChange={handleTopicChange}/>
                </CardContent>
                <CardActions>
                    <Button className="start_button" variant="outlined" onClick={navigateToGame}>Start new game!</Button>
                </CardActions>
            </Card>
        </Box>
    )
}

export default Home;