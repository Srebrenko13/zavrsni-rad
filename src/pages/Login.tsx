import React, {useState} from "react";
import {
    Alert,
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
import {LoginInfo} from "../models/LoginInfo";
import {useNavigate} from "react-router-dom";
import {getCookie, setCookie} from "typescript-cookie";

function Login() {

    const navigate = useNavigate();
    const[processing, setProcessing] = useState(false);
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    const[usernameError, setUsernameError] = useState(false);
    const[passwordError, setPasswordError] = useState(false);
    const[errorOccurred, setErrorOccurred] = useState(false);
    const[loginFailed, setLoginFailed] = useState(false);
    const[otherError, setOtherError] = useState(false);
    const[alreadyLogged, setAlreadyLogged] = useState(false);

    const handleShowPassword = () => setShowPassword((showPassword) => !showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    async function handleLogin(e: any){
        setProcessing(true);
        setLoginFailed(false);
        setOtherError(false);

        if(getCookie('sessionId') !== undefined) {
            console.log(getCookie('sessionId'));
            setAlreadyLogged(true);
            setProcessing(false);
            return;
        }

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

        await axios.post<string>("http://localhost:8080/login", info).then((response) => {
            setCookie('sessionId', response.data, {expires: 2, sameSite: "lax"});
            navigate('/profile');
        }).catch((err) => {
            setLoginFailed(true);
            const resp = err.response.data;
            console.log("Error occurred: " + resp);
            if(err.response.status === 500) setOtherError(true);
        });

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
                    <Button variant="contained" onClick={handleLogin} disabled={processing || alreadyLogged}>
                        {alreadyLogged ? "Already logged in" : "Login"}
                    </Button>
                </CardContent>
                {processing && (
                    <CardContent className="loading_overlay item">
                        <LinearProgress/>
                    </CardContent>
                )}
                {loginFailed && (
                        <CardContent className="item">
                            <Alert severity="error">{
                                otherError? "Unexpected error occurred" :
                                    "Incorrect username or password"
                            }</Alert>
                        </CardContent>
                )}
            </Card>
        </Box>
    )
}

export default Login;