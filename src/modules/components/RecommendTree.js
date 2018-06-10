import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

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
	 * this.state.data is one level list.
	 * do not make complex as nested object.
	 */
	state = {
		data: [],
		switchRecommendToolbox: () => {
			console.log("please replace this function.");
		},
	};
	componentDidMount() {
    this.loadRecommendBranchesFromServer();
	}
	loadRecommendBranchesFromServer() {
		getAPI(`/api/users/${this.props.userId}/recommend-branches`)
		.then((res) => {
			if (Object.keys(res).length > 0) {
				this.setState({data: res});
			} else {
				this.addRecommendBranch("0");
			}
		});
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
		const prevId = this.state.data[id].prevId;
		if (prevId !== "0") {
			this.moveDownRecommendBranch(prevId);
		}
	}
	moveDownRecommendBranch = (id) => {
		let data = Object.assign({}, this.state.data);

		const B = id;
		const A = this.state.data[B].prevId;
		const C = this.state.data[B].nextId;

		// id is bottom.
		if (C === "0") {
			return;
		}
		const D = this.state.data[C].nextId;

		// set prev id
		if (A !== "0") {
			data[A].nextId = C;
			patchAPI(`/api/recommend-branches/${A}`, {
				nextId: C,
			});
		}

		data[B].prevId = C;
		data[B].nextId = D;
		patchAPI(`/api/recommend-branches/${B}`, {
			prevId: C,
			nextId: D,
		});

		data[C].prevId = A;
		data[C].nextId = B;
		patchAPI(`/api/recommend-branches/${C}`, {
			prevId: A,
			nextId: B,
		});

		if (D !== "0") {
			data[D].prevId = B;
			patchAPI(`/api/recommend-branches/${D}`, {
				prevId: B,
			});
		}

		this.setState({data: data});
	}

	addRecommendBranch = (id) => {
		// if id = 0 then add first branch.
		postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.props.userId,
			prevId: id,
			nextId: (id === "0" ? "0" : this.state.data[id].nextId),
		})
		.then( res => {
			let data = Object.assign({}, this.state.data);
			data[res.id] = res;

			// set nextId of prev branch.
			if (id !== "0") {
				data[id].nextId = res.id;
			}
			// set prevId of next branch.
			if (res.nextId !== "0") {
				data[res.nextId].prevId = res.id;
			}

			this.setState({data: data});
		});
	};

	addSubRecommendBranch = async (id) => {
		// insert sub last branch.
		const target = Object.keys(this.state.data).find((id) => {
			return (this.state.data[id].parentId === id && this.state.data[id].nextId === "0");
		});

		const res = await postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.props.userId,
			parentId: id,
			prevId: (target !== undefined ? "0" : target),
			nextId: "0",
		})

		let data = Object.assign({}, this.state.data);
		data[res.id] = res;
		if (target !== undefined) {
			data[target].nextId = res.id;
		}

		this.setState({data: data});
	}

	deleteRecommendBranch = (ids) => {

		(async () => {
			for (let id of ids) {
				await deleteAPI(`/api/recommend-branches/${id}`);
			}
	 })();

		let data = Object.assign({}, this.state.data);
		ids.forEach((id) => {
			const prev = data[data[id].prevId];
			if (prev) {
				prev.nextId = data[id].nextId;
			}
			const next = data[data[id].nextId];
			if (next) {
				next.prevId = data[id].prevId;
			}
			delete data[id];
		});

		this.setState({data: data});

		// if data is empty then add new branch.
		if (Object.keys(data).length === 0) {	
				this.addRecommendBranch("0");
		}
	};

	// get 1 level list. and fix broken list.
	getRecommendList = (parentId) => {
		let recommendBranches = [];

		// find parent id.
		const list = Object.keys(this.state.data).filter((id) => {
			return this.state.data[id].parentId === parentId;
		});
		if (list.length > 0) {
			let patchIds = [];

			const firsts = list.filter((id) => {
				return this.state.data[id].prevId === "0";
			});

			// if prevId is "0" not found.
			let first;
			if (firsts.length >= 1) {
				first = firsts[0];
			} else {
				console.log("could not find first elem.");
				first = list[0];

				// fix prevId = "0"
				let data = this.state.data[first];
				data.prevId = "0";
				patchIds.push(first);
			}

			let outOfLinks = {};
			list.forEach(id => outOfLinks[id] = null);

			let id, prevId;
			for (id = first;
					list.indexOf(id) >= 0;
					id = this.state.data[id].nextId)
			{
				// check out of link.
				prevId = id;
				delete outOfLinks[id];

				recommendBranches.push(this.state.data[id]);
				
				// check if nextId is loop
				const nextId = this.state.data[id].nextId;
				if (list.indexOf(nextId) >= 0 &&
						!outOfLinks.hasOwnProperty(nextId)
				) {
					console.log("recommend branches is loop!");
					// fix netxtId to zero.
					let data = this.state.data[id];
					data.nextId = "0";
					patchIds.push(id);
					break; // last data is outOfLinks
				}
			}

			// if link is broken. concat last data.
			if (Object.keys(outOfLinks).length > 0) {
				patchIds.push(prevId);

				Object.keys(outOfLinks).forEach((id) => {
					console.log(`link list is broken. so fix it. ${parentId}`);

					let prev = this.state.data[prevId];
					prev.nextId = id;

					let recommendBranch = this.state.data[id];
					recommendBranch.prevId = prevId;
					recommendBranch.nextId = "0";
					recommendBranches.push(recommendBranch);

					patchIds.push(id);
					prevId = id;
				});
			}

			patchIds.forEach((id) => {
				patchAPI(`/api/recommend-branches/${id}`, {
					prevId: this.state.data[id].prevId,
					nextId: this.state.data[id].nextId,
				});
			});

		} else {
			// if recommend branch is empty.
			// but do not addRecommendBranch.
			// Because data is empty when ComponentDidMount() called.
		}

		return recommendBranches;
	};

	getRecommendLeaves = (parentId) => {
		return [];
	};

	render() {
		console.log("render recommend tree");
		const { classes } = this.props;

		// get first level list.
		const recommendBranches = this.getRecommendList("0").map((recommendBranch) => {
			return (
					<RecommendBranch
						key={recommendBranch.id}
						data={recommendBranch}
						getRecommendList={this.getRecommendList}
						handleCheck={this.handleCheck}
						level={0}
					/>
				);
		});

		const recommendLeaves = this.getRecommendLeaves("0").map((recommendLeaf) => {
			return (
					<div></div>
			);
		});

		return (
			<div className={classes.root}>
				<div className={classes.content}>
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
					{recommendLeaves}
				</List>
			</div>
		);
	}
}

RecommendTree.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendTree);
