import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import Recommend from 'modules/components/Recommend';

const styleSheet = theme => ({
});

class RecommendBranchName extends React.Component {
	state = {
		name: this.props.name,
		changeFlag: false,
	};
	
	handleChange = event => {
		this.setState({
			changeFlag: true,
			name: event.target.value,
		});
	};
	handleOnBlur = this.handleSubmit;
	handleSubmit = event => {
		event.preventDefault();
		if (this.state.changeFlag) {
			this.props.handleSubmit(this.state.name);
			this.setState({changeFlag: false});
		}
	};

	render() {
		const { classes } = this.props;

		if (this.props.recommend) {
			return <Recommend data={this.props.recommend} enableLink />
		} else {
			if (this.props.isMine) {
				<TextField
					id={this.props.id}
					placeholder="リスト名"
					fullWidth
					value={this.state.name}
					onChange={this.handleChange}
					onBlur={this.handleSubmit}
				/>
			} else {
				return <Typogranphy variant="title">{this.props.name}</Typography>
			}
		}
	}
}

RecommendBranchName.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranchName);


