import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

import ReviewForm from 'modules/containers/IiyoReviewForm';
import RecommendBranch from 'modules/containers/RecommendBranch';
import RecommendToolbox from 'modules/containers/RecommendToolbox';
import SearchBox from 'modules/containers/SearchBox';

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
	icon: {
		width: '1.6em',
		height: '1.6em',
		color: theme.palette.secondary.main,
	},
});

class RecommendTree extends React.Component {
	componentDidMount() {
		this.props.loadRecommendData();
	}
	componentDidUpdate(prevProps) {
		if (this.props.userId !== prevProps.userId) {
			this.props.loadRecommendData();
		}
	}
	componentWillUnmount() {
		this.props.clearRecommendData();
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
							history={this.context.router.history}
							searchParent
						/>
					</div>
				}
				{this.props.isMine &&
					<RecommendToolbox userId={this.props.userId} />
				}
				{!this.props.isMine &&
					<AppBar
						position="static"
						color="default"
					>
						<Toolbar>
							<Tooltip id="tooltip-top-start" title="全て開く">
								<IconButton>
									<ExpandMore
										onClick={this.props.openAll}
										className={classes.icon}
									/>
								</IconButton>
							</Tooltip>
							<Tooltip id="tooltip-top-start" title="全て閉じる">
								<IconButton>
									<ExpandLess
										onClick={this.props.closeAll}
										className={classes.icon}
									/>
								</IconButton>
							</Tooltip>
						</Toolbar>
					</AppBar>
				}
				<SearchBox />
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

	static contextTypes = {
		router: PropTypes.shape({
				history: PropTypes.shape({
						push: PropTypes.func.isRequired,
						replace: PropTypes.func.isRequired,
						createHref: PropTypes.func.isRequired
				}).isRequired
		}).isRequired
	}
}

RecommendTree.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendTree);
