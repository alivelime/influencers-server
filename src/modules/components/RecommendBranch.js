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
		paddingTop: theme.spacing.unit * 0.5,
		paddingBottom: theme.spacing.unit * 0.5,
	},
});

class RecommendBranch extends React.Component {

	render() {

		const { classes } = this.props;
		const children = this.props.childIds.map((id) => {
			return (
				<RecommendBranch
					id={id}
					key={id}
					parentIsChecked={this.props.parentIsChecked}
				/>
			);
		});

		if (this.props.id === "0") {
			return children;
		}

		return (
			<ListItem
				className={classNames(classes.root, (this.props.isChecked ? classes.checked : classes.unchecked))}
			>
				<ListItem>
					<RecommendBranchName
						id={this.props.id}
						parentIsChecked={this.props.parentIsChecked}
						childLength={this.props.childIds.length}
					>
				</ListItem>
				<ListItem>
					<Collapse in={this.props.isOpen} tomeout="auto" className={classes.container}>
						<List component='nav' className={classes.list}>
								{children}
								<ReviewList recommendBranchId={props.id} />
						</List>
					</Collapse>
				</ListItem>
		);
	}
}

RecommendBranch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranch);

