import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from 'axios';

import {actions as exampleActions} from '../../redux/modules/example';
import {exampleSelector} from '../../redux/selectors/exampleSelector';
import {Login} from '../../common/components/Auth';

const mapStateToProps = state => ({
    ...exampleSelector(state),
});

const mapDispatchToProps = {
    ...exampleActions,
};

@connect(mapStateToProps, mapDispatchToProps)
class loginView extends Component {

    constructor() {
        super();
        this.state = {
            login: null,
            password: null
        };
        this.updateLogin = this.updateLogin.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.setAwesomeCode('Well done, and this is awesome !!');
    }

    updateLogin(e) {
        this.setState({login: e.target.value})
    }

    updatePassword(e) {
        this.setState({password: e.target.value})
    }

    handleSubmit(e) {
        e.preventDefault();
        let body = {
            "email": this.state.login,
            "password": this.state.password,
        };
        axios.post('http://localhost:3000/login', body).then(response => {
            if (response.data === 'Login failed')
                return;
            this.props.login(response.data)
        })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return <Login updateLogin={this.updateLogin} updatePassword={this.updatePassword}
                      handleSubmit={this.handleSubmit}/>;
    }
}

export default loginView;
