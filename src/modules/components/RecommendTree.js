import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import ReviewForm from 'modules/containers/IiyoReviewForm';
import RecommendList from 'modules/containers/RecommendList';
import RecommendToolbox from 'modules/components/RecommendToolbox';

const styleSheet = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
	progres: {
		marginTop: theme.spacing.unit * 2,
		marginBotton: theme.spacing.unit * 2,
		marginLeft: 'auto';
		marginRight: 'auto';
	},
});

class RecommendTree extends React.Component {
	componentWillMount() {
    this.props.loadUserRecommendData();
	}

	render() {
		console.log("render recommend tree");
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<ReviewForm
						recommendBranchId={"0"}
						userId={this.props.userId}
						iineId={this.props.iineId}
						searchParent
					/>
				</div>
				<RecommendToolbox 
					addRecommendBranch={this.props.addRecommendBranch}
					addSubRecommendBranch={this.props.addSubRecommendBranch}
					deleteRecommendBranches={this.props.deleteRecommendBranches}
					moveUpRecommendBranch={this.props.moveUpRecommendBranch}
					moveDownRecommendBranch={this.props.moveDownRecommendBranch}
					moveRecommendBranches={this.props.moveRecommendBranches}
				/>
				<List component='nav' className={classes.list}>
				{(this.props.dataLoaded) 
					? (
							<RecommendList
								id={this.props.recommendBranchId}
								open={this.props.open}
							/>
						)
					: (
							<CircularProgress
								className={classes.progress}
								variant="determinate"
							/>
						)
				}
				</List>
			</div>
		);
	}

}

RecommendTree.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendTree);
