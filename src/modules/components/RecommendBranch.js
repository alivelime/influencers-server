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
		paddingTop: theme.spacing.unit * 0.5,
		paddingBottom: theme.spacing.unit * 0.5,
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
	handleSubmit = event => {
		event.preventDefault();
		if (this.state.changeFlag) {
			this.props.handleSubmit();
			this.setState({changeFlag: false});
		}
	};

	render() {
		const { classes } = this.props;

		const children = this.props.children.map((id) => {
			return (
				<RecommendList id={id} />
			);
		});

		if (this.props.id === "0") {
			return {children};
		}

		const reviews = this.props.reviews.map((review) => {
			return (
				<ListItem key={review.id} className={classes.review} >
					<Review data={review} />
				</ListItem>
			);
		});

		return (
			<div>
				<ListItem
					className={classNames(classes.root, (this.props.isChecked ? classes.checked : classes.unchecked))}
				>
					<Checkbox
						checked={this.props.isChecked}
						onClick={this.props.handleCheck}
						tabIndex={-1}
						disabled={this.props.parentIsChecked}
						disableRipple
					/>
					{(() => {
						if (!this.props.recommend) {
							return (
								<TextField
									id={this.props.id}
									placeholder="リスト名"
									fullWidth
									value={this.state.name}
									onChange={this.handleChange}
									onBlur={this.handleSubmit}
								/>
							);
						} else {
							return (
								<Recommend data={this.props.recommend} enableLink />
							);
						}
					})()}
					{(() => {
						if (children.length > 0 || reviews.length > 0) {
							return (
									<IconButton onClick={this.handleCollapse}>
										{this.props.isOpen ? <ExpandLess className={classes.icon}/> : <ExpandMore className={classes.icon}/>}
									</IconButton>
							);
						}
					})()}
				</ListItem>
				{(() => {
					if (children.length > 0 || reviews.length > 0) {
						return (
							<Collapse in={this.prosp.isOpen} tomeout="auto">
								<List
									component="div"
									disablePadding
									className={(this.prosp.isChecked ? classes.checked : classes.unchecked)}
								>
									<div className={classes.container}>
										{children}
										{reviews}
									</div>
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

