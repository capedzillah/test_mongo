import React, {PureComponent} from 'react';
import './example.css';
import {Link} from 'react-router-dom'

class Registration extends PureComponent {

	render() {
		return (
			<div className="login-page">
				<div className="form">
					<form className="login-form" onSubmit={this.props.handleSubmit}>
						<input type="text" placeholder="email" onChange={this.props.updateLogin}/>
						<input type="text" placeholder="username" onChange={this.props.updateUserName}/>
						<input type="password" placeholder="password" onChange={this.props.updatePassword}/>
						<select onChange={this.props.updateOptions} className="select-style">
							<option value="developer">Developer</option>
							<option value="manager">Manager</option>
						</select>
						<button onSubmit={this.props.handleSubmit}>create account</button>
						<p className="message"><Link to="/">Sign into an existing account</Link></p>
					</form>
				</div>
			</div>
		);
	}
}

export default Registration;
