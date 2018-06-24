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
	review:{
	},
});

class RecommendBranch extends React.Component {
	state = Object.assign({
		changeFlag: false,
		checked: false,
		open: this.props.open,
	}, this.props.recommendBranch);

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
			this.props.data.changeRecommendBranch(this.state.id, this.state.name);
			this.setState({changeFlag: false});
		}
	};
	uncheck = () => {
		this.setState({checked: false});
	}
	handleCheck = event => {
		
		const checked = !this.state.checked;
		if (this.props.recommend) {
			this.props.checker.checkRecommend(this.state.id, this.props.recommend.url, checked, this.uncheck);
		} else {
			this.props.checker.checkRecommendBranch(this.state.id, checked, this.uncheck );
		}

		this.setState({checked: checked});
	}
	componentWillUnmount() {
		if (this.state.checked) {
			this.props.checker.checkRecommend(this.state.id, '', false);
			this.props.checker.checkRecommendBranch(this.state.id, false);
		}
	}

	render() {
		const { classes } = this.props;

		const children = this.props.getChildren(this.props.recommendBranch.id, this.state.checked || this.props.parentChecked);
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
					className={classNames(classes.root, (this.state.checked ? classes.checked : classes.unchecked))}
				>
					<Checkbox
						checked={this.state.checked}
						onClick={this.handleCheck}
						tabIndex={-1}
						disabled={this.props.parentChecked}
						disableRipple
					/>
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
								<Recommend data={this.props.recommend} enableLink />
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

