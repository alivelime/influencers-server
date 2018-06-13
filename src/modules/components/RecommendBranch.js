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

import Recommend from 'modules/components/Recommend';
import Review from 'modules/components/Review';
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
	nopadding:{
		paddingTop: theme.spacing.unit * 0.5,
		paddingBottom: theme.spacing.unit * 0.5,
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

		const children = this.props.getChildren(this.props.data.id, this.props.level + 1, this.state.checked);
		const reviews = this.props.reviews.map((review) => {
				console.log(review);
			return (
				<ListItem key={review.id} className={classes.nopadding} style={{paddingLeft: ((this.props.level + 1.5) * 2)+ 'em'}}>
					<Review data={review} />
				</ListItem>
			);
		});

		return (
			<div style={{paddingLeft: ((this.props.level + (this.props.parentChecked ? 2 : 0)) * 2)+ 'em'}}>
				<ListItem
					className={classNames(classes.root, (this.state.checked ? classes.checked : classes.unchecked))}
				>
					{(() => {
						if (!this.props.parentChecked) {
							return (
								<Checkbox
									checked={this.state.checked}
									onClick={this.handleCheck}
									tabIndex={-1}
									disableRipple
								/>
							);
						}
					})()}
					{(() => {
						if (!this.props.recommend) {
							return (
								<TextField
									id={this.state.id}
									placeholder="リスト名"
									fullWidth
									value={this.state.name}
									onChange={this.handleChange}
									onBlur={this.handleSubmit}
								/>
							);
						} else {
							return (
								<Recommend data={this.props.recommend} />
							);
						}
					})()}
					{(() => {
						if (children.length > 0 || reviews.length > 0) {
							return (
									<IconButton onClick={this.handleCollapse}>
										{this.state.open ? <ExpandLess className={classes.icon}/> : <ExpandMore className={classes.icon}/>}
									</IconButton>
							);
						}
					})()}
				</ListItem>
				{(() => {
					if (children.length > 0 || reviews.length > 0) {
						return (
							<Collapse in={this.state.open} tomeout="auto">
								<List
									component="div"
									disablePadding
									className={(this.state.checked ? classes.checked : classes.unchecked)}
								>
									{children}
									{reviews}
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

