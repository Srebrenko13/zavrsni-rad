import React from 'react';
import '../stylesheets/App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Game from './Game'
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import ViewGame from "./ViewGame";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/">
                        <Route index element={<Home/>}/>
                        <Route path="home" element={<Home/>}/>
                        <Route path="game" element={<Game/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register/>}/>
                        <Route path="profile" element={<Profile/>}/>
                        <Route path="view" element={<ViewGame/>}/>
                    </Route>
                </Routes>
                <Footer/>
            </BrowserRouter>

        </div>
    );
}

export default App;
