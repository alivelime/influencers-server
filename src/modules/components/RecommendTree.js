import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import ReviewForm from 'modules/containers/IiyoReviewForm';
import RecommendBranch from 'modules/containers/RecommendBranch';
import RecommendToolbox from 'modules/containers/RecommendToolbox';

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
					<RecommendToolbox userId={this.props.userId} />
				}
				{this.props.dataLoaded
					? (
							<RecommendBranch
								id={this.props.recommendBranchId}
							/>
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
