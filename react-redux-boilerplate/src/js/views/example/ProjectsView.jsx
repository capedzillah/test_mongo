import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from 'axios';

import {actions as exampleActions} from '../../redux/modules/example';
import {exampleSelector, userInfoSelector} from '../../redux/selectors/exampleSelector';
import {Projects} from '../../common/components/Example';

const mapStateToProps = state => ({
	...exampleSelector(state),
	...userInfoSelector(state)
});

const mapDispatchToProps = {
	...exampleActions,
};

@connect(mapStateToProps, mapDispatchToProps)
class ProjectsView extends Component {

	constructor() {
		super();
		this.state = {
			userProjects: [],
		};
	}

	componentDidMount() {
		const {userinfo} = this.props.userinfo;
		axios.get(`http://localhost:3000/project/5a5674844d90fb42b034944f`).then(response => {
			this.setState({
				userProjects: response.data
			});
		})
			.catch(error => {
				console.log(error)
			})
	}

	render() {
		if (this.state.userProjects.length)
			return <Projects projectList={this.state.userProjects}/>
		else
			return <div> нет проектов</div>

	}
}

export default ProjectsView;
