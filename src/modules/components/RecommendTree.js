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
	progressDiv: {
		textAlign: 'center',
	},
	progress: {
		margin: theme.spacing.unit * 2,
	},
});

class RecommendTree extends React.Component {
	componentWillMount() {
		this.props.loadRecommendData();
	}

	render() {
		console.log("render recommend tree");
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				{this.props.isMine &&
					<div className={classes.content}>
						<ReviewForm
							recommendBranchId={"0"}
							userId={this.props.userId}
							iineId={this.props.iineId}
							searchParent
						/>
					</div>
				}
				{this.props.isMine &&
					<RecommendToolbox 
						addRecommendBranch={this.props.addRecommendBranch}
						addSubRecommendBranch={this.props.addSubRecommendBranch}
						deleteRecommendBranches={this.props.deleteRecommendBranches}
						moveUpRecommendBranch={this.props.moveUpRecommendBranch}
						moveDownRecommendBranch={this.props.moveDownRecommendBranch}
						moveRecommendBranches={this.props.moveRecommendBranches}
					/>
				}
				{(this.props.dataLoaded) 
					? (
							<List component='nav' className={classes.list}>
								<RecommendList
									id={this.props.recommendBranchId}
									open={this.props.open}
									isMine={this.props.isMine}
								/>
							</List>
						)
					: (
							<div className={classes.progressDiv}>
								<CircularProgress
									className={classes.progress}
									size={100}
								/>
							</div>
						)
				}
			</div>
		);
	}

}

RecommendTree.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendTree);
