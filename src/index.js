import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Game from './components/Game';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Game />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);