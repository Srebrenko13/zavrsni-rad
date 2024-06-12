import { Link } from '@mui/material';
import React from 'react';
import '../stylesheets/Header.css'

function Header() {

    return (
        <header className="header">
            <Link href="/" color="inherit" underline="none">
                Home
            </Link>
        </header>
    );
}

export default Header;
