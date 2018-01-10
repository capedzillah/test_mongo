import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import loginView from './views/example/loginView';
import registrationView from './views/example/registrationView';

require('../style/index.css');

module.exports = (
        <div className="container__content">
            <Switch>
                <Route exact path="/login" component={loginView} />
                <Route path="/registration" component={registrationView}/>
                <Route path="*" component={loginView} />
            </Switch>
    </div>
);