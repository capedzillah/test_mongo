import React, {PureComponent} from 'react';
import './example.css';
import {Link} from 'react-router-dom'


class Projects extends PureComponent {
	renderList(projectList) {
		return <ul className="list-item-1">{projectList.map((item, i) => <li key={i}><Link
			to={'/projects/' + item._id}>{item.project}</Link>
		</li>)}</ul>
	}

	render() {
		const {projectList} = this.props;

		if (projectList) {
			return this.renderList(projectList)
		}
		return <div />;
	}
}

export default Projects;
