import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import ReviewForm from 'modules/components/ReviewForm';
import RecommendBranch from 'modules/components/RecommendBranch';
import RecommendToolbox from 'modules/components/RecommendToolbox';
import { getAPI, postAPI, deleteAPI, patchAPI } from 'modules/utils/DevUtils';

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
		switchRecommendToolbox: () => {
			console.log("please replace this function.");
		},
	};
	componentDidMount() {
    this.loadDataFromServer();
	}
	async loadDataFromServer() {
		let recommendBranches, reviews, recommends;
		await Promise.all([
			(async () => {
				recommendBranches = await getAPI(`/api/users/${this.props.userId}/recommend-branches`);
			})(),
			(async () => {
				reviews = await getAPI(`/api/users/${this.props.userId}/reviews`);
			})(),
			(async () => {
				recommends = await getAPI(`/api/users/${this.props.userId}/recommends`);
			})(),
		]);

		if (Object.keys(recommendBranches).length > 0) {
			this.setState({recommendBranches: recommendBranches, reviews: reviews, recommends: recommends});
		} else {
			this.addRecommendBranch("0");
		}
	}

	handleCheck = (id, on) => {
		this.state.switchRecommendToolbox(id, on);
	};
	setHandleCheck = (handler) => {
		// do not setState(). avoiding render().
		let state = this.state;
		state.switchRecommendToolbox = handler;
	};

	moveUpRecommendBranch = (id) => {
		const prevId = this.state.recommendBranches[id].prevId;
		if (prevId !== "0") {
			this.moveDownRecommendBranch(prevId);
		}
	}
	moveDownRecommendBranch = (id) => {
		let recommendBranches = Object.assign({}, this.state.recommendBranches);

		const B = id;
		const A = this.state.recommendBranches[B].prevId;
		const C = this.state.recommendBranches[B].nextId;

		// id is bottom.
		if (C === "0") {
			return;
		}
		const D = this.state.recommendBranches[C].nextId;

		// set prev id
		if (A !== "0") {
			recommendBranches[A].nextId = C;
			patchAPI(`/api/recommend-branches/${A}`, {
				nextId: C,
			});
		}

		recommendBranches[B].prevId = C;
		recommendBranches[B].nextId = D;
		patchAPI(`/api/recommend-branches/${B}`, {
			prevId: C,
			nextId: D,
		});

		recommendBranches[C].prevId = A;
		recommendBranches[C].nextId = B;
		patchAPI(`/api/recommend-branches/${C}`, {
			prevId: A,
			nextId: B,
		});

		if (D !== "0") {
			recommendBranches[D].prevId = B;
			patchAPI(`/api/recommend-branches/${D}`, {
				prevId: B,
			});
		}

		this.setState({recommendBranches: recommendBranches});
	}

	addRecommendBranch = (id) => {
		// if id = 0 then add first branch.
		postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.props.userId,
			prevId: id,
			nextId: (id === "0" ? "0" : this.state.recommendBranches[id].nextId),
		})
		.then( res => {
			let recommendBranches = Object.assign({}, this.state.recommendBranches);
			recommendBranches[res.id] = res;

			// set nextId of prev branch.
			if (id !== "0") {
				recommendBranches[id].nextId = res.id;
			}
			// set prevId of next branch.
			if (res.nextId !== "0") {
				recommendBranches[res.nextId].prevId = res.id;
			}

			this.setState({recommendBranches: recommendBranches});
		});
	};

	addSubRecommendBranch = async (parentId) => {
		// insert sub last branch.
		const last = Object.keys(this.state.recommendBranches).find((id) => {
			return (this.state.recommendBranches[id].parentId === parentId && this.state.recommendBranches[id].nextId === "0");
		});

		const res = await postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.props.userId,
			parentId: parentId,
			prevId: last || "0",
			nextId: "0",
		})

		let recommendBranches = Object.assign({}, this.state.recommendBranches);
		recommendBranches[res.id] = res;
		if (last) {
			recommendBranches[last].nextId = res.id;
		}

		this.setState({recommendBranches: recommendBranches});

		return res;
	}

	deleteRecommendBranch = (ids) => {

		(async () => {
			for (let id of ids) {
				await deleteAPI(`/api/recommend-branches/${id}`);
			}
	 })();

		let recommendBranches = Object.assign({}, this.state.recommendBranches);
		ids.forEach((id) => {
			const prev = recommendBranches[recommendBranches[id].prevId];
			if (prev) {
				prev.nextId = recommendBranches[id].nextId;
			}
			const next = recommendBranches[recommendBranches[id].nextId];
			if (next) {
				next.prevId = recommendBranches[id].prevId;
			}
			delete recommendBranches[id];
		});

		this.setState({recommendBranches: recommendBranches});

		// if recommendBranches is empty then add new branch.
		if (Object.keys(recommendBranches).length === 0) {	
				this.addRecommendBranch("0");
		}
	};

	searchRecommendBranch = (url) => {
		return Object.keys(this.state.reviews).filter((id) => {
			return this.state.reviews[id].recommendId === url;
		})
		.map((id) => {
			return this.state.reviews[id].recommendBranchId;
		});
	};
	getParentRecommendBranchName = (id) => {
		return (id === "0" ? "トップ" :
						(this.state.recommendBranches[id].parentId === "0"
							? `トップ(${id})`
							: this.state.recommendBranches[this.state.recommendBranches[id].parentId].name
						));
	};

	// get 1 level list. and fix broken list.
	getRecommendBranchesList = (parentId) => {
		let recommendBranches = [];

		// find parent id.
		const list = Object.keys(this.state.recommendBranches).filter((id) => {
			return this.state.recommendBranches[id].parentId === parentId;
		});
		if (list.length > 0) {
			let patchIds = [];

			const firsts = list.filter((id) => {
				return this.state.recommendBranches[id].prevId === "0";
			});

			// if prevId is "0" not found.
			let first;
			if (firsts.length >= 1) {
				first = firsts[0];
			} else {
				console.log("could not find first elem.");
				first = list[0];

				// fix prevId = "0"
				let recommendBranch = this.state.recommendBranches[first];
				recommendBranch.prevId = "0";
				patchIds.push(first);
			}

			let outOfLinks = {};
			list.forEach(id => outOfLinks[id] = null);

			let id, prevId;
			for (id = first;
					list.indexOf(id) >= 0;
					id = this.state.recommendBranches[id].nextId)
			{
				// check out of link.
				prevId = id;
				delete outOfLinks[id];

				recommendBranches.push(this.state.recommendBranches[id]);
				
				// check if nextId is loop
				const nextId = this.state.recommendBranches[id].nextId;
				if (list.indexOf(nextId) >= 0 &&
						!outOfLinks.hasOwnProperty(nextId)
				) {
					console.log("recommend branches is loop!");
					// fix netxtId to zero.
					let recommendBranch = this.state.recommendBranches[id];
					recommendBranch.nextId = "0";
					patchIds.push(id);
					break; // last recommendBranches is outOfLinks
				}
			}

			// if link is broken. concat last recommendBranches.
			if (Object.keys(outOfLinks).length > 0) {
				patchIds.push(prevId);

				Object.keys(outOfLinks).forEach((id) => {
					console.log(`link list is broken. so fix it. ${parentId}`);

					let prev = this.state.recommendBranches[prevId];
					prev.nextId = id;

					let recommendBranch = this.state.recommendBranches[id];
					recommendBranch.prevId = prevId;
					recommendBranch.nextId = "0";
					recommendBranches.push(recommendBranch);

					patchIds.push(id);
					prevId = id;
				});
			}

			patchIds.forEach((id) => {
				patchAPI(`/api/recommend-branches/${id}`, {
					prevId: this.state.recommendBranches[id].prevId,
					nextId: this.state.recommendBranches[id].nextId,
				});
			});

		} else {
			// if recommend branch is empty.
			// but do not addRecommendBranch.
			// Because recommendBranches is empty when ComponentDidMount() called.
		}

		return recommendBranches;
	};

	getReviewList(recommendBranchId) {
		return Object.keys(this.state.reviews).filter((id) => {
			return this.state.reviews[id].recommendBranchId === recommendBranchId;
		})
		.map(id => this.state.reviews[id]);
	}

	getChildRecommendBranches = (parentId, level, parentChecked) => {
		return this.getRecommendBranchesList(parentId).map((recommendBranch) => {
			const reviews = this.getReviewList(recommendBranch.id);
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
	reviewCallback = (review, recommend) => {
		this.setState({
			reviews: Object.assign({[review.id]: review}, this.state.reviews),
			recommends: Object.assign( {[recommend.url]: recommend}, this.state.recommends),
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
						addSubRecommendBranch={this.addSubRecommendBranch}
						deleteRecommendBranch={this.deleteRecommendBranch}
						searchRecommendBranch={this.searchRecommendBranch}
						searchParent
						getParentRecommendBranchName={this.getParentRecommendBranchName}
						submitCallback={this.reviewCallback}
					/>
				</div>
				<RecommendToolbox
					setHandleCheck={this.setHandleCheck}
					moveDownRecommendBranch={this.moveDownRecommendBranch}
					moveUpRecommendBranch={this.moveUpRecommendBranch}
					moveRecommendBranches={this.moveRecommendBranches}
					addRecommendBranch={this.addRecommendBranch}
					addSubRecommendBranch={this.addSubRecommendBranch}
					deleteRecommendBranch={this.deleteRecommendBranch}
					deleteAllRecommendBranch={this.deleteAllRecommendBranch}
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
