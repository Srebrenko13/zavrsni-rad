import {AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import React, {useEffect} from 'react';
import '../stylesheets/Header.css'
import {AccountCircle, VideogameAsset} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {getCookie, removeCookie} from "typescript-cookie";

interface Props{
    name?: String
}

function Header(props: Props) {
    const navigate = useNavigate();
    const[auth, setAuth] = React.useState(false);
    const[anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = (e: any) =>{
        e.preventDefault();
        navigate('/login');
    }

    const handleRegister = (e: any) =>{
        e.preventDefault();
        navigate('/register');
    }

    const handleLogOut = (e: any) => {
        e.preventDefault();
        handleClose();
        if(getCookie('sessionId') !== undefined) removeCookie('sessionId');
        else console.log("No account to log out of!");
        navigate('/login');
    }

    const handleHome = (e: any) => {
        e.preventDefault();
        navigate('/');
    }

    const handleProfile = (e: any) => {
        e.preventDefault();
        handleClose();
        navigate('/profile');
    }

    useEffect(() => {
        setAuth((getCookie('sessionId') !== undefined));
    });

    return (
        <Box className="header">
            <AppBar position="static" color="primary">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleHome}
                    >
                        <VideogameAsset color="action" fontSize="large"/>
                    </IconButton>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        MindCraft: AI Tales
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle fontSize="large"/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                            </Menu>
                        </div>
                    )}
                    {(!auth) && (
                        <div className="buttons">
                            <Button
                                onClick={handleLogin}
                                variant="outlined"
                                color="inherit"
                            >Login
                            </Button>
                            <Button
                                onClick={handleRegister}
                                variant="outlined"
                                color="inherit"
                            >Register
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
