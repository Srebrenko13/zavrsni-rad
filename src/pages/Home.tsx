import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {StoryModel} from "../models/StoryModel";
import axios from "axios";
import {Box, Button, Card, CardActions, CardContent, IconButton, LinearProgress, TextField} from "@mui/material";
import '../stylesheets/Home.css'
import {getCookie} from "typescript-cookie";
import {AddBox, IndeterminateCheckBox} from "@mui/icons-material";

function Home(){
    const navigate = useNavigate();
    const [topic, setTopic] = useState("");
    const [chapters, setChapters] = useState(5);
    const [loading, setLoading] = useState(false);
    const [startDisabled, setStartDisabled] = useState(false);
    const [decreaseDisabled, setDecreaseDisabled] = useState(false);
    const [increaseDisabled, setIncreaseDisabled] = useState(false);

    function handleTopicChange(e: any){
        setTopic(e.target.value);
    }

    function decreaseChapters(){
        if(chapters > 2) setChapters(chapters - 1);
        if(chapters === 3) setDecreaseDisabled(true);
        if(increaseDisabled) setIncreaseDisabled(false);
    }

    function increaseChapters(){
        if(chapters < 10) setChapters(chapters + 1);
        if(chapters === 9) setIncreaseDisabled(true);
        if(decreaseDisabled) setDecreaseDisabled(false);
    }

    async function navigateToGame(e: any) {
        setLoading(true);
        setStartDisabled(true);
        localStorage.setItem("numberOfChapters", chapters.toString());
        console.log("Calling post with topic: ", topic);
        await axios.post<StoryModel>('http://localhost:8080/game/start', {topic: topic, chapters: chapters})
            .then((response) => {
                localStorage.setItem('game_data', JSON.stringify(response.data));
                console.log(response.data);
        }).catch();
        setStartDisabled(false);
        setLoading(false);
        navigate("/game");
    }

    useEffect(() => {
        setStartDisabled(loading || (getCookie('sessionId') === undefined));
    })

    return(
        <Box className="play_box">
            <div className="image"><img src={"/logo.jpeg"} alt="Nema slike, sirotinja smo!" width="40%"/></div>
            <Card className="play_card">
                <CardContent className="topic_box">
                    <TextField id="outlined-basic" placeholder="Please input chosen topic of your game!"
                           onChange={handleTopicChange} className="topic_field" multiline={true}/>
                </CardContent>
                <CardActions>
                    <CardActions>
                        <p>Number of chapters:</p>
                        <IconButton color="primary" onClick={decreaseChapters} disabled={decreaseDisabled}>
                            <IndeterminateCheckBox/>
                        </IconButton>
                        <p>{chapters}</p>
                        <IconButton color="primary" onClick={increaseChapters} disabled={increaseDisabled}>
                            <AddBox/>
                        </IconButton>
                    </CardActions>
                    <Button className="start_button" variant="outlined" size="large" onClick={navigateToGame}
                    disabled={startDisabled}>{startDisabled ? (loading ? "Loading" : "Please log in")
                        : (topic.length === 0 ? "I'm feeling lucky!" : "Start new game!")}</Button>
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