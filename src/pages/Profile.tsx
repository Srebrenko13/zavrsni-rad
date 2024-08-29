import React, {useEffect, useState} from "react";
import {Box, Button, Card, CardContent, Paper, TextField} from "@mui/material";
import "../stylesheets/Profile.css"
import axios from "axios";
import {AccountData} from "../models/AccountData";
import {getCookie} from "typescript-cookie";
import {basePath, emptyUser} from "../typescripts/Utils"
import {AccountCircle, Cancel, Edit, EmojiPeople, Save} from "@mui/icons-material";
import {GameInfoData} from "../models/GameInfoData";
import GameInfo from "../components/GameInfo";

function Profile(){
    const[userInfo , setUserInfo] = useState(emptyUser);
    const[editingAbout, setEditingAbout] = useState(false);
    const[aboutText, setAboutText] = useState(userInfo.aboutMe);
    const[editedAbout, setEditedAbout] = useState(userInfo.aboutMe);

    function getDateCreated(){
        const date = new Date(userInfo.dateCreated);
        return date.toLocaleDateString();
    }

    async function startEditAboutInfo(e: any){
        setEditingAbout(true);
    }

    async function editAboutInfo(e: any){
        axios.post<AccountData>( basePath + "/profile/editAbout", {about: editedAbout},
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then(() => {
                setAboutText(editedAbout);
            }).catch((err) => {
            console.log(err);
            setEditedAbout(aboutText);
        });
        setEditingAbout(false);
    }

    async function cancelEditAbout(e: any){
        setEditedAbout(aboutText);
        setEditingAbout(false);
    }

    function setText(){
        setAboutText(userInfo.aboutMe);
        setEditedAbout(userInfo.aboutMe);
    }

    useEffect(() => {
        axios.get<AccountData>(basePath + "/profile",
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
                setUserInfo(response.data);
            }).catch((err) => {
                console.log(err);
            });
        axios.get<GameInfoData[]>(basePath + "/profile/games",
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
                localStorage.setItem("games", JSON.stringify(response.data));
            }).catch((err) => {
                console.log("Failed to load games");
        });
    }, []);

    useEffect(() => {
       setText();
    }, [userInfo]);

    return (
        <Box className="profile_box">
            <Box className="info">
                <Card className="account_info">
                    <div className="sign">
                        <AccountCircle fontSize="large" color="primary"/>
                        <CardContent className="title">User info</CardContent>
                    </div>
                    <div className="info_box">
                        <div className="info_element">
                            <CardContent className="info_type">Username: </CardContent>
                            <CardContent> {userInfo.username}</CardContent>
                        </div>
                        <div className="info_element">
                            <CardContent className="info_type">Email: </CardContent>
                            <CardContent> {userInfo.email}</CardContent>
                        </div>
                        <div className="info_element">
                            <CardContent className="info_type">Date created: </CardContent>
                            <CardContent> {getDateCreated()}</CardContent>
                        </div>
                    </div>
                </Card>
                <Card className="about_me">
                    <div className="sign">
                        <EmojiPeople fontSize="large" color="primary"/>
                        <CardContent className="title">About me</CardContent>
                    </div>
                    <CardContent className="about_text" hidden={editingAbout}>
                        {aboutText}
                    </CardContent>
                    <CardContent hidden={!editingAbout}>
                        <TextField multiline fullWidth defaultValue={editedAbout}
                                   onChange={e => setEditedAbout(e.target.value)}
                        />
                    </CardContent>
                    <CardContent className="about_buttons">
                        <CardContent hidden={editingAbout}>
                            <Button variant="outlined" startIcon={<Edit/>}
                                    onClick={startEditAboutInfo}
                            >
                                Edit
                            </Button>
                        </CardContent>
                        <CardContent hidden={!editingAbout}>
                            <Button variant="outlined" startIcon={<Save/>}
                                    onClick={editAboutInfo}
                            >
                                Save
                            </Button>
                        </CardContent>
                        <CardContent hidden={!editingAbout}>
                            <Button variant="outlined" startIcon={<Cancel/>}
                                    color="error"
                                    onClick={cancelEditAbout}
                            >
                                Cancel
                            </Button>
                        </CardContent>
                        <span/>
                    </CardContent>
                </Card>
            </Box>
            <Box className="games">
                <Card className="game_header">
                    <CardContent className="game_id">Game ID</CardContent>
                    <CardContent className="game_topic">Topic</CardContent>
                    <CardContent className="game_description">Number of chapters</CardContent>
                    <CardContent className="game_header_view"></CardContent>
                    <span/>
                </Card>
                <div className="history" style={{maxHeight: 350, overflow: 'auto'}}>
                    {
                        JSON.parse(localStorage.getItem("games") || "[]").map((game: GameInfoData ) =>
                            <GameInfo gameId={game.game_id} topic={game.topic} numOfChapters={game.number_of_chapters}/>
                        )
                    }
                </div>
            </Box>
        </Box>
    )
}

export default Profile;