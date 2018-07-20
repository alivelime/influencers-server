import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import RecommendList from 'modules/containers/RecommendList';
import Recommend from 'modules/components/Recommend';
import Review from 'modules/components/Review';

const styleSheet = theme => ({
	root: {
		padding:0,
	},
	checked: {
		backgroundColor: theme.palette.secondary[100],
	},
	unchecked: {
	},
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	container:{
		paddingLeft: '2em',
	},
});

class RecommendBranch extends React.Component {
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

		return (
				{this.props.isMine &&
					<Checkbox
						checked={this.props.isChecked}
						onClick={this.props.handleCheck}
						tabIndex={-1}
						disabled={this.props.parentIsChecked}
						disableRipple
					/>
				}
				{!this.props.recommendId
					? (!this.props.isMine
						? (
							<Typogranphy variant="headline">{this.props.name}</Typography>
							)
						: (
							<TextField
								id={this.props.id}
								placeholder="リスト名"
								fullWidth
								value={this.state.name}
								onChange={this.handleChange}
								onBlur={this.handleSubmit}
							/>
						))
					: (
							<Recommend data={this.props.recommendId} enableLink />
						)
				}
				{(this.props.recommendIds || this.props.childLength) &&
					<IconButton onClick={this.props.handleCollapse}>
						{this.props.isOpen ? <ExpandLess className={classes.icon}/> : <ExpandMore className={classes.icon}/>}
					</IconButton>
				}
		);
	}
}

RecommendBranch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranch);


