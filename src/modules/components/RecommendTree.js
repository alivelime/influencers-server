import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import ReviewForm from 'modules/components/ReviewForm';
import RecommendBranch from 'modules/components/RecommendBranch';
import RecommendToolbox from 'modules/components/RecommendToolbox';
import UserRecommendTreeData from 'modules/classes/UserRecommendTreeData';
import UserRecommendTreeChecker from 'modules/classes/UserRecommendTreeChecker';

const styleSheet = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
});

class RecommendTree extends React.Component {
	/*
	 * this.state.recommendBranches is one level list.
	 * do not make complex as nested object.
	 */
	state = {
		recommendBranches: [],
		reviews: {},
		recommends: {},
		data: new UserRecommendTreeData((data) => {this.setState(data);}),
		checker: new UserRecommendTreeChecker(),
	};
	componentWillMount() {
    this.state.data.loadDataFromServer(this.props.userId)
	}

	getChildRecommendBranches = (parentId, parentChecked) => {
		return this.state.data.getRecommendBranchesList(parentId).map((recommendBranch) => {
			const reviews = this.state.data.getReviewList(recommendBranch.id);
			const recommend = (reviews.length > 0 ? this.state.recommends[reviews[0].recommendId] : null);
			return (
					<RecommendBranch
						key={recommendBranch.id}
						data={this.state.data}
						checker={this.state.checker}
						recommendBranch={recommendBranch}
						recommend={recommend}
						reviews={reviews}
						getChildren={this.getChildRecommendBranches}
						parentChecked={parentChecked}
						open
					/>
				);
		});
	};

	render() {
		console.log("render recommend tree");
		const { classes } = this.props;

		// get first level list.
		const recommendBranches = this.getChildRecommendBranches("0", false);
		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<ReviewForm
						recommendBranch={{id: "0", name: "自動選択 or トップ"}}
						userId={this.props.userId}
						iineId={0}
						data={this.state.data}
						checker={this.state.checker}
						searchParent
					/>
				</div>
				<RecommendToolbox
					data={this.state.data}
					checker={this.state.checker}
				/>
				<List component='nav'>
					{recommendBranches}
				</List>
			</div>
		);
	}
}

RecommendTree.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendTree);
