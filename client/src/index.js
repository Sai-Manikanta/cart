import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import CartContextProvider from './contexts/CartContext';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <CartContextProvider>
                <App />
            </CartContextProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
)