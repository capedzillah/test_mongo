import React, {PureComponent} from 'react';
import './example.css';
import {Link} from 'react-router-dom'

class Example extends PureComponent {

    render() {
        console.log (this.props)
        return (
            <div className="login-page">
                <div className="form">
                    <form className="login-form" onSubmit={this.props.handleSubmit}>
                        <input type="text" placeholder="username" onChange={this.props.updateLogin}/>
                        <input type="password" placeholder="password" onChange={this.props.updatePassword}/>
                        <button onSubmit={this.props.handleSubmit}>login</button>
                        <p className="message">Not registered? <Link to="/registration">Create an account</Link></p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Example;
