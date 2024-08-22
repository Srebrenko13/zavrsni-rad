import React from 'react';
import '../stylesheets/Footer.css'
import {AppBar, Container, Toolbar, Typography} from "@mui/material";

function Footer(){

    return(
        <footer className="footer">
            <AppBar position="static" sx={{bottom: 0}}>
                <Toolbar color="primary">
                    <Container maxWidth="sm">
                        <Typography fontSize="14px">
                            Copyright ©NoCopyrightHere
                        </Typography>
                    </Container>
                </Toolbar>
            </AppBar>
        </footer>
    )
}

export default Footer;