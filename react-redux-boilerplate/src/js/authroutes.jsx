import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import Login from './views/example/loginPage';
import Registration from './views/example/registrationPage';

require('../style/index.css');

module.exports = (
    <div className="container">
        <div className="container__content">
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/registration" component={Registration}/>
                <Route path="*" component={Login} />
            </Switch>
        </div>
    </div>
);
