import React from 'react';
import {
	Route,
	Switch,
} from 'react-router-dom';
import ExampleRouteHandler from './views/example';
import ProjectsView from './views/example/ProjectsView';

require('../style/index.css');

module.exports = (
		<div className="container__content">
			<Switch>
				<Route exact path="/projects" component={ProjectsView}/>
				<Route path="/projects/:id"/>
				<Route path="*" component={ProjectsView}/>
			</Switch>
		</div>
);
