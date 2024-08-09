import React, {useCallback, useEffect, useState} from "react";
import {Box, Button, Card, CardContent, Icon} from "@mui/material";
import "../stylesheets/Profile.css"
import axios from "axios";
import {AccountData} from "../models/AccountData";
import {getCookie} from "typescript-cookie";

function Profile(){
    const[userInfo, setUserInfo] = useState({});

    const fetchData = useCallback(async() =>{
        await axios.get<AccountData>("http://localhost:8080/profile",
            {headers:{
                    Authorization: "Bearer " + getCookie('sessionId')
                }})
            .then((response) => {
                setUserInfo(response.data);
                console.log(response.data);
            }).catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Box className="box">
            <Card className="info">
                <CardContent>
                    <Icon></Icon>
                    <Button className="item" variant="outlined">User profile!</Button>
                </CardContent>
                <Button className="item" variant="contained">Itemmmmmmmmmmmmmmm</Button>
            </Card>
            <Card className="games">
                <Button className="game_card">Second row</Button>
                <Button className="game_card">Second item</Button>
            </Card>
        </Box>
    )
}

export default Profile;