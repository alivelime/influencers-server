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
			this.setState({data: res});
			if (Object.keys(res).length === 0) {
				this.addRecommendBranch("0");
			}
		});
	}

	handleCheck = (id) => {
		this.state.switchRecommendToolbox(id);
	};
	setHandleCheck = (handler) => {
		// do not setState(). avoiding render().
		let state = this.state;
		state.switchRecommendToolbox = handler;
	};

	swapRecommendBranch = (id) => {
		let data = Object.assign({}, this.state.data);

		const B = id;
		const A = this.state.data[B].prevId;
		const C = this.state.data[B].nextId;

		// id is bottom.
		if (C === "0") {
			return;
		}
		const D = this.state.data[C].nextId;
		console.log(`${A} -> ${B} -> ${C} -> ${D}`);

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

	render() {
		console.log("render recommend tree");
		const { classes } = this.props;

		// sort
		let recommendBranches = [];
		if (Object.keys(this.state.data).length > 0) {
			let patchIds = [];

			const firsts = Object.keys(this.state.data).filter((id) => {
				return this.state.data[id].prevId === "0";
			});

			// if prevId is "0" not found.
			let first;
			if (firsts.length >= 1) {
				first = firsts[0];
			} else {
				console.log("could not find first elem.");
				first = Object.keys(this.state.data)[0];

				// fix prevId = "0"
				let data = this.state.data[first];
				data.prevId = "0";
				patchIds.push(first);
			}

			let outOfLinks = Object.assign({}, this.state.data);

			let id, prevId;
			for (id = first;
					this.state.data.hasOwnProperty(id);
					id = this.state.data[id].nextId)
			{
				// check out of link.
				prevId = id;
				delete outOfLinks[id];

				recommendBranches.push(
					<RecommendBranch
						key={id}
						data={this.state.data[id]}
						handleCheck={this.handleCheck}
					/>
				);
				
				// check if nextId is loop
				const nextId = this.state.data[id].nextId;
				if (this.state.data.hasOwnProperty(nextId) &&
						!outOfLinks.hasOwnProperty(this.state.data[id].nextId)
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
					console.log("link list is broken. so fix it.");

					let prev = this.state.data[prevId];
					prev.nextId = id;

					let recommendBranch = this.state.data[id];
					recommendBranch.prevId = prevId;
					recommendBranch.nextId = "0";

					recommendBranches.push(
						<RecommendBranch
							key={id}
							data={this.state.data[id]}
							handleCheck={this.handleCheck}
						/>
					);

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

		return (
				<div className={classes.root}>
					<div className={classes.content}>
					</div>
					<RecommendToolbox
						setHandleCheck={this.setHandleCheck}
						swapRecommendBranch={this.swapRecommendBranch}
						addRecommendBranch={this.addRecommendBranch}
						deleteRecommendBranch={this.deleteRecommendBranch}
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
