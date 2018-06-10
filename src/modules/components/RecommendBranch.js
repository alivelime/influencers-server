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

import { patchAPI } from 'modules/utils/DevUtils';

const styleSheet = theme => ({
	root: {
		paddingLeft: 0,
		paddingRight: 0,
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
});

class RecommendBranch extends React.Component {
	state = Object.assign({
		changeFlag: false,
		checked: false,
		open: true,
	}, this.props.data);

	handleCollapse = () => {
		this.setState({open: !this.state.open});
	}
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
			this.props.handleCheck(this.state.id, true);
		} else {
			this.props.handleCheck(this.state.id, false);
		}

		this.setState({checked: checked});
	}

	render() {
		const { classes } = this.props;

		const children = this.props.getRecommendList(this.props.data.id).map((child) => {
			return (
				<RecommendBranch
					classes={classes}
					key={child.id}
					data={child}
					getRecommendList={this.props.getRecommendList}
					handleCheck={this.props.handleCheck}
					level={this.props.level + 1}
				/>
			);
		});

		return (
			<div style={{paddingLeft: (this.props.level * 2)+ 'em'}}>
				<ListItem
					className={classNames(classes.root, (this.state.checked ? classes.checked : classes.unchecked))}
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
					{(() => {
						if (children.length > 0) {
							return (
									<IconButton onClick={this.handleCollapse}>
										{this.state.open ? <ExpandLess className={classes.icon}/> : <ExpandMore className={classes.icon}/>}
									</IconButton>
							);
						}
					})()}
				</ListItem>
				{(() => {
					if (children.length > 0) {
						return (
							<Collapse in={this.state.open} tomeout="auto">
								<List component="div" disablePadding>
									{children}
								</List>
							</Collapse>
						);
					}
				})()}
			</div>
		);
	}
}

RecommendBranch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranch);

