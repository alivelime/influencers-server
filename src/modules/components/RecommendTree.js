import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import ReviewForm from 'modules/components/ReviewForm';
import RecommendBranch from 'modules/components/RecommendBranch';
import RecommendToolbox from 'modules/components/RecommendToolbox';
import UserRecommendsReviews from 'modules/classes/UserRecommendsReviews';

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
		data: new UserRecommendsReviews((data) => {this.setState(data);}),
		switchRecommendToolbox: () => {
			console.log("please replace this function.");
		},
	};
	componentDidMount() {
    this.state.data.loadDataFromServer(this.props.userId)
	}

	handleCheck = (id, on) => {
		this.state.switchRecommendToolbox(id, on);
	};
	setHandleCheck = (handler) => {
		// do not setState(). avoiding render().
		let state = this.state;
		state.switchRecommendToolbox = handler;
	};

	getChildRecommendBranches = (parentId, level, parentChecked) => {
		return this.state.data.getRecommendBranchesList(parentId).map((recommendBranch) => {
			const reviews = this.state.data.getReviewList(recommendBranch.id);
			const recommend = (reviews.length > 0 ? this.state.recommends[reviews[0].recommendId] : null);
			return (
					<RecommendBranch
						key={recommendBranch.id}
						data={recommendBranch}
						recommend={recommend}
						reviews={reviews}
						getChildren={this.getChildRecommendBranches}
						handleCheck={this.handleCheck}
						level={level}
						parentChecked={parentChecked}
					/>
				);
		});
	};

	render() {
		console.log("render recommend tree");
		const { classes } = this.props;

		// get first level list.
		const recommendBranches = this.getChildRecommendBranches("0", 0, false);
		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<ReviewForm
						recommendBranch={{id: "0", name: "自動選択 or トップ"}}
						userId={this.props.userId}
						iineId={0}
						data={this.state.data}
						searchParent
					/>
				</div>
				<RecommendToolbox
					setHandleCheck={this.setHandleCheck}
					data={this.state.data}
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
