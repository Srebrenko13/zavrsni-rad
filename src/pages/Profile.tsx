import React, {useCallback, useEffect, useState} from "react";
import {Box, Button, Card, CardContent, Icon, TextField} from "@mui/material";
import "../stylesheets/Profile.css"
import axios from "axios";
import {AccountData} from "../models/AccountData";
import {getCookie} from "typescript-cookie";
import {emptyUser} from "../typescripts/Utils"
import {AccountCircle, Edit, EmojiPeople, Save} from "@mui/icons-material";

function Profile(){
    const[userInfo , setUserInfo] = useState(emptyUser);
    const[editingAbout, setEditingAbout] = useState(false);
    const[aboutText, setAboutText] = useState(userInfo.aboutMe);

    function getDateCreated(){
        const date = new Date(userInfo.dateCreated);
        return date.toLocaleDateString();
    }

    async function startEditAboutInfo(e: any){
        setEditingAbout(true);
    }

    async function editAboutInfo(e: any){
        setEditingAbout(false);
    }

    const fetchData = useCallback(async() =>{
        await axios.get<AccountData>("http://localhost:8080/profile",
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
                setUserInfo(response.data);
                setAboutText(userInfo.aboutMe);
            }).catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                        <TextField multiline fullWidth defaultValue={aboutText}/>
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
                        <span/>
                    </CardContent>
                </Card>
            </Box>
            <Box className="games">
                <Card className="game_header">
                    <CardContent className="game_id">Game ID</CardContent>
                    <CardContent className="game_title">Title</CardContent>
                    <CardContent className="game_description">Description</CardContent>
                    <CardContent className="game_view">View</CardContent>
                    <CardContent className="game_replay">Replay</CardContent>
                    <span/>
                </Card>
                <Card className="game_card">
                    <CardContent className="game_id">372</CardContent>
                    <CardContent className="game_title">Crazy pirate adventure</CardContent>
                    <CardContent className="game_description">Delve into crazy search for One Piece as a member of Straw Hat crew lead by Monkey D. Luffy</CardContent>
                    <CardContent className="game_view">
                        <Button variant="outlined" color="primary">View</Button>
                    </CardContent>
                    <CardContent className="game_replay">
                        <Button variant="outlined" color="primary">Replay</Button>
                    </CardContent>
                    <span/>
                </Card>
            </Box>
        </Box>
    )
}

export default Profile;