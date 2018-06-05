import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import { patchAPI } from 'modules/utils/DevUtils';

const styleSheet = theme => ({
	checked: {
		backgroundColor: theme.palette.secondary[100],
	},
	unchecked: {
	},
});

class RecommendBranch extends React.Component {
	state = Object.assign({changeFlag: false, checked: false}, this.props.data);

	handleChange = event => {
		this.setState({
			changeFlag: true,
			name: event.target.value,
		});
	};
	handleSubmit = event => {
		event.preventDefault();
		if (this.state.changeFlag) {
			patchAPI(`/api/recommend-branches/${this.state.id}`, {name: this.state.name});
			this.setState({changeFlag: false});
		}
	};
	handleCheck = event => {
		
		const checked = !this.state.checked;
		if (checked) {
			this.props.handleCheck(this.state.id);
		} else {
			this.props.handleCheck(false);
		}

		this.setState({checked: checked});
	}

	render() {
		const { classes } = this.props;

		return (
			<ListItem
				className={this.state.checked ? classes.checked : classes.unchecked}
			>
				<Checkbox
					checked={this.state.checked}
					onClick={this.handleCheck}
					tabIndex={-1}
					disableRipple
				/>
				<TextField
					id={this.state.id}
					placeholder="リスト名"
					fullWidth
					value={this.state.name}
					onChange={this.handleChange}
					onBlur={this.handleSubmit}
				/>
			</ListItem>
		);
	}
}

RecommendBranch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranch);

