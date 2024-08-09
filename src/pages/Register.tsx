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
import {PersonAdd, Visibility, VisibilityOff} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {RegisterInfo} from "../models/RegisterInfo";
import axios from "axios";
import {DatabaseStatus} from "../models/DatabaseStatus";
import {getCookie, setCookie} from "typescript-cookie";

function Register() {

    const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,20}$/;
    const[processing, setProcessing] = useState(false);
    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[repeat, setRepeat] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    const[showRepeat, setShowRepeat] = useState(false);
    const[usernameError, setUsernameError] = useState(false);
    const[emailError, setEmailError] = useState(false);
    const[passwordError, setPasswordError] = useState(false);
    const[repeatError, setRepeatError] = useState(false);
    const[mismatchError, setMismatchError] = useState(false);
    const[invalidEmail, setInvalidEmail] = useState(false);
    const[invalidPassword, setInvalidPassword] = useState(false);
    const[usernameExists, setUsernameExists] = useState(false);
    const[emailExists, setEmailExists] = useState(false);
    const[otherError, setOtherError] = useState(false);
    const[registerFailed, setRegisterFailed] = useState(false);
    const[errorOccurred, setErrorOccurred] = useState(false);
    const[alreadyLogged, setAlreadyLogged] = useState(false);


    const handleShowPassword = () => setShowPassword((showPassword) => !showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleShowRepeat = () => setShowRepeat((showRepeat) => !showRepeat);
    const handleMouseDownRepeat = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    function isValidEmail(email: string) : boolean{
        return emailRegex.test(email);
    }

    function isValidPassword(password: string) : boolean{
        return passwordRegex.test(password);
    }

    async function handleRegister(e: any) {
        setProcessing(true);
        setEmailExists(false);
        setUsernameExists(false);
        setOtherError(false);
        setRegisterFailed(false);

        if(getCookie('sessionId') !== undefined) {
            console.log(getCookie('sessionId'));
            setAlreadyLogged(true);
            setProcessing(false);
            return;
        }

        if(username.length === 0) {
            setUsernameError(true);
            setErrorOccurred(true);
        } else setUsernameError(false);

        if(email.length === 0) {
            setEmailError(true);
            setErrorOccurred(true);
        } else setEmailError(false);

        if(password.length === 0) {
            setPasswordError(true);
            setErrorOccurred(true);
        } else setPasswordError(false);

        if(repeat.length === 0) {
            setRepeatError(true);
            setErrorOccurred(true);
        } else setRepeatError(false);

        if(password !== repeat) {
            setMismatchError(true);
            setErrorOccurred(true);
        } else setMismatchError(false);

        if(!isValidEmail(email)) {
            setInvalidEmail(true);
            setErrorOccurred(true);
        } else setInvalidEmail(false);

        if(!isValidPassword(password)){
            setInvalidPassword(true);
            setErrorOccurred(true);
        } else setInvalidPassword(false);

        if(errorOccurred){
            setProcessing(false);
            setErrorOccurred(false);
            return;
        }

        let info: RegisterInfo = {
            user: username,
            password: password,
            email: email.toLowerCase()
        }

        await axios.post<string>("http://localhost:8080/register", info).then((response) => {
            setCookie('sessionId', response.data, {expires: 2, sameSite: "none"});
            navigate('/profile');
        }).catch((err) => {
            const resp = err.response.data;
            setRegisterFailed(true);
            console.log("Error occurred");
            const status = resp as DatabaseStatus;
            console.log(status);
            if(status.emailExists) setEmailExists(true);
            else if(status.usernameExists) setUsernameExists(true);
            else setOtherError(true);
        });

        setProcessing(false);
    }

    return(
        <Box className="box">
            <Card className="card">
                <div className="item title">
                    <PersonAdd fontSize="large" color="primary"/>
                    <CardContent className="title">Register</CardContent>
                </div>
                <CardContent className="item field">
                    <TextField required label="Username" fullWidth type="text"
                               onChange={e => setUsername(e.target.value)}
                               error = {usernameError || usernameExists}
                               helperText = {usernameError ? "Field required" : ""}
                    ></TextField>
                </CardContent>
                <CardContent className="item field">
                    <TextField required label="Email Address" fullWidth type="email"
                               onChange={e => setEmail(e.target.value)}
                               error = {emailError || invalidEmail || emailExists}
                               helperText = {emailError ? "Field required" :
                                   (invalidEmail ? "Please use valid email address" : "")}
                    ></TextField>
                </CardContent>
                <CardContent className="item field">
                    <TextField required label="Password" fullWidth type={showPassword ? 'text' : 'password'}
                               onChange={e => setPassword(e.target.value)}
                               error = {passwordError || mismatchError || invalidPassword}
                               helperText = {passwordError ? "Field required" :
                                   (invalidPassword ? "Password too weak" : "")}
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
                               }}
                    ></TextField>
                </CardContent>
                <CardContent className="item field">
                    <TextField id="repeat" required label="Repeat password" fullWidth type={showRepeat ? 'text' : 'password'}
                               onChange={e => setRepeat(e.target.value)}
                               error = {repeatError || mismatchError}
                               helperText = {repeatError ? "Field required" : (mismatchError ? "Passwords need to match" : "")}
                               InputProps={{
                                   endAdornment: <InputAdornment position="end" sx={{padding: 0, margin: 0}}>
                                       <IconButton
                                           onClick={handleShowRepeat}
                                           onMouseDown={handleMouseDownRepeat}
                                           edge="end"
                                       >
                                           {showRepeat ? <VisibilityOff/> : <Visibility/>}
                                       </IconButton>
                                   </InputAdornment>
                               }}
                    ></TextField>
                </CardContent>
                <CardContent>
                    <Link href="/login">Already have an account?</Link>
                </CardContent>
                <CardContent className="item">
                    <Button variant="contained" onClick={handleRegister} disabled={processing || alreadyLogged}>
                        {alreadyLogged ? "Already logged in" : "Register"}
                    </Button>
                </CardContent>
                {processing && (
                    <CardContent className="loading_overlay item">
                        <LinearProgress/>
                    </CardContent>
                )}
                {registerFailed && (
                    <CardContent className="item">
                        <Alert severity="error">{
                            emailExists? "Email already taken" :
                                (usernameExists? "Username already taken" :
                                "Unexpected error occurred")
                        }</Alert>
                    </CardContent>
                )

                }
            </Card>
        </Box>
    )
}

export default Register;