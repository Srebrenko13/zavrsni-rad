import React, {useEffect, useState} from "react";
import {Box, Button, Card, CardContent, TextField} from "@mui/material";
import "../stylesheets/Profile.css"
import axios from "axios";
import {AccountData} from "../models/AccountData";
import {getCookie} from "typescript-cookie";
import {emptyUser} from "../typescripts/Utils"
import {AccountCircle, Cancel, Edit, EmojiPeople, Save} from "@mui/icons-material";

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
        axios.post<AccountData>("http://localhost:8080/profile/editAbout", {about: editedAbout},
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
                console.log(response.data);
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
        axios.get<AccountData>("http://localhost:8080/profile",
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
                setUserInfo(response.data);
            }).catch((err) => {
                console.log(err);
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