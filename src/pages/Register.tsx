import React from "react";
import {Box, Button, Card, CardContent, Link, TextField} from "@mui/material";
import '../stylesheets/LoginAndRegister.css';
import {PersonAdd} from "@mui/icons-material";

function Register() {

    return(
        <Box className="box">
            <Card className="card">
                <div className="item title">
                    <PersonAdd fontSize="large" color="primary"/>
                    <CardContent className="title">Register</CardContent>
                </div>
                <CardContent className="item field">
                    <TextField required label="Username" fullWidth type="text"></TextField>
                </CardContent>
                <CardContent className="item field">
                    <TextField required label="Email Address" fullWidth type="email"></TextField>
                </CardContent>
                <CardContent className="item field">
                    <TextField required label="Password" fullWidth type="password"></TextField>
                </CardContent>
                <CardContent>
                    <Link href="/login">Already have an account?</Link>
                </CardContent>
                <CardContent className="item">
                    <Button variant="contained">Register</Button>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Register;