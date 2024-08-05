import React, {useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    LinearProgress,
    Link,
    TextField
} from "@mui/material";
import '../stylesheets/LoginAndRegister.css';
import {LockPerson, Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";
import {AccountData} from "../models/AccountData";
import {LoginInfo} from "../models/LoginInfo";

function Login() {

    const[processing, setProcessing] = useState(false);
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    const[usernameError, setUsernameError] = useState(false);
    const[passwordError, setPasswordError] = useState(false);
    const[errorOccurred, setErrorOccurred] = useState(false);

    const handleShowPassword = () => setShowPassword((showPassword) => !showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    async function sleepy(){
        return new Promise(
            (resolve) => setTimeout(resolve, 10000)
        );
    }

    async function handleLogin(e: any){
        setProcessing(true);

        if(username.length === 0) {
            setUsernameError(true);
            setErrorOccurred(true);
        }
        else setUsernameError(false);

        if(password.length === 0) {
            setPasswordError(true);
            setErrorOccurred(true);
        }
        else setPasswordError(false);

        if(errorOccurred){
            setErrorOccurred(false);
            setProcessing(false);
            return;
        }

        const info: LoginInfo = {
            user: username,
            password: password
        }

        console.log(info);

        // await sleepy();

        // probaj postat na backend i spremit u cookie ono sta si primio nazad, isto probaj stavis https umjesto http
/*        await axios.post<AccountData>("http://localhost:8080/login", info).then((response) => {
            console.log(response.data);
        }).catch(); */
        setProcessing(false);
        // redirectaj na user profile ako je prijava uspjesna
    }

    return(
        <Box className="box">
            <Card className="card">
                <div className="item title">
                    <LockPerson fontSize="large" color="primary"/>
                    <CardContent className="title">Login</CardContent>
                </div>
                <CardContent className="item field">
                    <TextField id="username" required label="Username" fullWidth type="text"
                        onChange={e => setUsername(e.target.value)}
                        error = {usernameError}
                        helperText = {usernameError ? "Field required" : ""}></TextField>
                </CardContent>
                <CardContent className="item field">
                    <TextField id="password" required label="Password" fullWidth type={showPassword ? 'text' : 'password'}
                         onChange={e => setPassword(e.target.value)}
                         error = {passwordError}
                         helperText= {passwordError ? "Field required" : ""}
                         InputProps={{
                             endAdornment: <InputAdornment position="end" sx={{padding: 0, margin: 0}}>
                                 <IconButton
                                    onClick={handleShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                 >
                                     {showPassword ? <VisibilityOff/> : <Visibility/>}
                                 </IconButton>
                             </InputAdornment>
                         }}></TextField>
                </CardContent>
                <CardContent>
                    <Link href="/register">Need an account?</Link>
                </CardContent>
                <CardContent className="item">
                    <Button variant="contained" onClick={handleLogin} disabled={processing}>Login</Button>
                </CardContent>
                {processing && (
                    <CardContent className="loading_overlay item">
                        <LinearProgress/>
                    </CardContent>
                )}
            </Card>
        </Box>
    )
}

export default Login;