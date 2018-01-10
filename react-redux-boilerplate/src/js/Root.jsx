import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import {HashRouter as Router} from 'react-router-dom';
import AuthRoutes from 'authroutes'
import Logged from 'logged'

import {actions as exampleActions} from './redux/modules/example';
import {exampleSelector, userInfoSelector} from './redux/selectors/exampleSelector';

const mapStateToProps = state => ({
	...exampleSelector(state),
	...userInfoSelector(state)
});

const mapDispatchToProps = {
	...exampleActions,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Root extends Component {

	get content() {
		if (!this.props.userinfo)
			return (
				<Router>
					{AuthRoutes}
				</Router>
			);
		else
			return (
				<Router>
					{Logged}
				</Router>
			)
	}

	render() {
		return (
			<Provider store={this.props.store}>
				{this.content}
			</Provider>
		);
	}
}

Root.propTypes = {
	routes: PropTypes.element.isRequired,
	store: PropTypes.object.isRequired,
};
