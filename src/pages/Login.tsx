import React, {useState, useEffect} from "react";
import {Box, Button, Card, CardContent, Link, TextField} from "@mui/material";
import '../stylesheets/LoginAndRegister.css';
import {LockPerson} from "@mui/icons-material";
import axios from "axios";
import {AccountData} from "../models/AccountData";
import {LoginInfo} from "../models/LoginInfo";
import {hashSync, compareSync} from "bcrypt-ts";

function Login() {

    const[processing, setProcessing] = useState(false);
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");

    async function handleLogin(e: any){
        setProcessing(true);
        const hash = hashSync(password, 10);
        const info: LoginInfo = {
            user: username,
            passwordHash: hash
        }

        console.log(info);
        console.log(compareSync(password, hash));
        console.log(compareSync("fail", hash));
        console.log(compareSync("test", hash));

        // probaj postat na backend i ucitat u local storage ono sta si primio nazad
        // await axios.post<AccountData>("http://localhost:8080/");
        setProcessing(false);
    }

    return(
        <Box className="box">
            <Card className="card">
                <div className="item title">
                    <LockPerson fontSize="large" color="primary"/>
                    <CardContent className="title">Login</CardContent>
                </div>
                <CardContent className="item field">
                    <TextField id="email" required label="Email Address" fullWidth type="email"
                    onChange={e => setUsername(e.target.value)}></TextField>
                </CardContent>
                <CardContent className="item field">
                    <TextField id="password" required label="Password" fullWidth type="password"
                    onChange={e => setPassword(e.target.value)}></TextField>
                </CardContent>
                <CardContent>
                    <Link href="/register">Need an account?</Link>
                </CardContent>
                <CardContent className="item">
                    <Button variant="contained" onClick={handleLogin} disabled={processing}>Login</Button>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Login;