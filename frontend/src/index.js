import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from "mobx-react";
import STORE from "./store";
import registerServiceWorker from './registerServiceWorker';
import Gemview from './components/Gemview';
import './main.css'

ReactDOM.render((
    <Provider store={STORE}>
        <BrowserRouter>
            <Route exact path="/" component={Gemview}></Route>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'))
registerServiceWorker();
