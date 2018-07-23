import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Recommend from 'modules/components/Recommend';

const styleSheet = theme => ({
	content: {
		flex: 1,
		marginLeft: theme.spacing.unit * 2,
		marginRight: theme.spacing.unit * 2,
	},
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
				return <TextField
					id={this.props.id}
					placeholder="リスト名"
					fullWidth
					value={this.state.name}
					onChange={this.handleChange}
					onBlur={this.handleSubmit}
				/>
			} else {
				return <div className={classes.content}><Typography variant="title">{this.props.name}</Typography></div>
			}
		}
	}
}

RecommendBranchName.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranchName);


