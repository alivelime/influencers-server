import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import RecommendList from 'modules/containers/RecommendBranch';
import RecommendBranchName from 'modules/containers/RecommendBranchName';
import ReviewList from 'modules/containers/ReviewList';

const styleSheet = theme => ({
	root: {
		padding:0,
	},
	checked: {
		backgroundColor: theme.palette.secondary[100],
	},
	unchecked: {
	},
	container:{
		paddingLeft: '2em',
		paddingTop: theme.spacing.unit * 0.5,
		paddingBottom: theme.spacing.unit * 0.5,
	},
	list: {
		width: "100%",
	},
	content: {
		backgroundColor: 'inherit',
	},
});

class RecommendBranch extends React.Component {

	render() {
		console.log('render recommendbranch '+this.props.id);

		const { classes } = this.props;
		const children = this.props.childIds.map((id) => {
			return (
				<RecommendList
					id={id}
					key={id}
					parentIsChecked={this.props.isChecked || this.props.parentIsChecked}
				/>
			);
		});

		if (this.props.id === "0") {
			return (
				<List component='nav' className={classes.list}>
					{children}
				</List>
			);
		}

		return (
			<List component='nav' className={classes.list}>
				<Paper className={classes.content}>
					<ListItem
						className={classNames(classes.root, (this.props.isChecked ? classes.checked : classes.unchecked))}
					>
						{this.props.isMine &&
							<Checkbox
								checked={this.props.isChecked}
								onClick={this.props.handleCheck}
								tabIndex={-1}
								disabled={this.props.parentIsChecked}
								disableRipple
							/>
						}
						<RecommendBranchName
							id={this.props.id}
							childLength={this.props.childIds.length}
						/>
						{(this.props.recommendId || this.props.childIds.length > 0) &&
							<IconButton onClick={this.props.handleCollapse}>
								{this.props.isOpen ? <ExpandLess className={classes.icon}/> : <ExpandMore className={classes.icon}/>}
							</IconButton>
						}
					</ListItem>
				</Paper>
				{(this.props.recommendId || this.props.childIds.length > 0) &&
					<ListItem
						className={classNames(classes.root, (this.props.isChecked ? classes.checked : classes.unchecked))}
					>
						<List component='nav' className={classes.list}>
							<Collapse in={this.props.isOpen} tomeout="auto" className={classes.container}>
								{children}
								<ReviewList recommendBranchId={this.props.id} />
							</Collapse>
						</List>
					</ListItem>
				}
			</List>
		);
	}
}

RecommendBranch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranch);

