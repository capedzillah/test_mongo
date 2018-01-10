import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from 'axios';

import {actions as exampleActions} from '../../redux/modules/example';
import {exampleSelector} from '../../redux/selectors/exampleSelector';
import {Registration} from '../../common/components/Auth';

const mapStateToProps = state => ({
	...exampleSelector(state),
});

const mapDispatchToProps = {
	...exampleActions,
};

@connect(mapStateToProps, mapDispatchToProps)
class registrationView extends Component {

	constructor() {
		super();
		this.state = {
			login: null,
			password: null,
			userName: null,
			userType: 'developer'
		};
		this.updateLogin = this.updateLogin.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.updateUserName = this.updateUserName.bind(this);
		this.updateOptions = this.updateOptions.bind(this);
	}

	updateLogin(e) {
		this.setState({userName: e.target.value})
	}

	updateUserName(e) {
		this.setState({login: e.target.value})
	}

	updatePassword(e) {
		this.setState({password: e.target.value})
	}

	updateOptions(e) {
		this.setState({userType: e.target.value})
	}

	handleSubmit(e) {
		e.preventDefault();
		let body = {
			"email": this.state.login,
			"password": this.state.password,
			"displayName": this.state.userName,
			"userType": this.state.userType
		};
		axios.post('http://localhost:3000/user', body).then(response => {
			axios.post('http://localhost:3000/login', body).then(secondresponse => {
				if (secondresponse.data === 'Login failed')
					return;
				this.props.login(secondresponse.data)
				this.props.history.push('/projects')
			})
				.catch(error => {
					console.log(error)
				})
		})
			.catch(error => {
				console.log(error)
			})
	}

	render() {
		return <Registration updateOptions={this.updateOptions} updateLogin={this.updateLogin}
							 updatePassword={this.updatePassword}
							 handleSubmit={this.handleSubmit} updateUserName={this.updateUserName}/>;
	}
}

export default registrationView;