import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import {StoryModel} from "../models/StoryModel";
import axios from "axios";
import {Box, Button, Card, CardActions, CardContent, LinearProgress, TextField} from "@mui/material";
import '../stylesheets/Home.css'

function Home(){
    const navigate = useNavigate();
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [notLoggedIn, setNotLoggedIn] = useState(false);
    const [startDisabled, setStartDisabled] = useState(false);

    function handleTopicChange(e: any){
        setTopic(e.target.value);
    }

    async function navigateToGame(e: any) {
        setLoading(true);
        setStartDisabled(true);
        console.log("Calling post with topic: ", topic);
        await axios.post<StoryModel>('http://localhost:8080/game/start', {topic: topic}).then((response) => {
            localStorage.setItem('game_data', JSON.stringify(response.data));
            console.log(response.data);
        }).catch();
        setStartDisabled(false);
        setLoading(false);
        navigate("/game");
    }

    return(
        <Box className="play_box">
            <Card className="play_card">
                <CardContent className="topic_box">
                    <TextField id="outlined-basic" placeholder="Please input chosen topic of your game!"
                           onChange={handleTopicChange} className="topic_field"/>
                </CardContent>
                <CardActions>
                    <Button className="start_button" variant="outlined" size="large" onClick={navigateToGame}
                    disabled={startDisabled}>Start new game!</Button>
                </CardActions>
                {loading && (
                    <div className="loading_overlay">
                        <LinearProgress/>
                    </div>
                )}
            </Card>
        </Box>
    )
}

export default Home;