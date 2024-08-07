import React from "react";
import {Box, Button, Card, CardContent} from "@mui/material";
import "../stylesheets/Profile.css"

function Profile(){

    return (
        <Box className="box">
            <Card className="info">
                <Button className="item" variant="outlined">User profile!</Button>
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