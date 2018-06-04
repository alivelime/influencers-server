import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import RecommendBranch from 'modules/components/RecommendBranch';
import { getAPI, postAPI, deleteAPI, patchAPI } from 'modules/utils/DevUtils';

const styleSheet = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
	},
});

class RecommendTree extends React.Component {
	state = {
		data: [],
	};
	componentDidMount() {
    this.loadRecommendBranchesFromServer();
	}
	loadRecommendBranchesFromServer() {
		getAPI(`/api/users/${this.props.userId}/recommend-branches`, null, (res) => {
			this.setState({data: res});
			if (Object.keys(res).length === 0) {
				this.addRecommendBranch("0");
			}
		});
	}

	addRecommendBranch = (id) => {
		// if id = 0 then add first branch.
		postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.props.userId,
			prevId: id,
			nextId: (id === "0" ? "0" : this.state.data[id].nextId),
		}, res => {
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
	deleteRecommendBranch = (id) => {
		deleteAPI(`/api/recommend-branches/${id}`);

		let data = Object.assign({}, this.state.data);
		const prev = data[data[id].prevId];
		if (prev) {
			prev.nextId = data[id].nextId;
		}
		const next = data[data[id].nextId];
		if (next) {
			next.prevId = data[id].prevId;
		}
		delete data[id];

		this.setState({data: data});

		// if data is empty then add new branch.
		if (Object.keys(data).length === 0) {	
				this.addRecommendBranch("0");
		}
	};


	render() {
		const { classes } = this.props;

		// sort
		let recommendBranches = [];
		if (Object.keys(this.state.data).length > 0) {
			let first = 0;
			for (first in this.state.data) {
				if (this.state.data[first].prevId === "0") {
					break;
				}
			}

			let outOfLinks = Object.assign({}, this.state.data);
			let id, prevId;
			for (id = first;
					this.state.data.hasOwnProperty(id);
					id = this.state.data[id].nextId)
			{
				prevId = id; // use out of link.
				delete outOfLinks[id];
				recommendBranches.push(
					<RecommendBranch
						key={id}
						data={this.state.data[id]}
						addRecommendBranch={this.addRecommendBranch}
						deleteRecommendBranch={this.deleteRecommendBranch}
					/>
				);
			}

			// if link is broken. concat last data.
			if (Object.keys(outOfLinks).length > 0) {
				let patchIds = [];
				patchIds.push(prevId);

				Object.keys(outOfLinks).forEach((id) => {
					console.log("link list is broken. so fix it.");

					let prev = this.state.data[prevId];
					prev.nextId = id;

					let recommendBranch = this.state.data[id];
					recommendBranch.prevId = prevId;
					recommendBranch.nextId = 0;

					recommendBranches.push(
						<RecommendBranch
							key={id}
							data={this.state.data[id]}
							addRecommendBranch={this.addRecommendBranch}
							deleteRecommendBranch={this.deleteRecommendBranch}
						/>
					);

					patchIds.push(id);
					prevId = id;
				});
				patchIds.forEach((id) => {
					patchAPI(`/api/recommend-branches/${id}`, {
						prevId: this.state.data[id].prevId,
						nextId: this.state.data[id].nextId,
					});
				});
			}

		} else {
			// if recommend branch is empty.
			// but do not addRecommendBranch.
			// Because data is empty when ComponentDidMount() called.
		}

		return (
				<div className={classes.root}>
					<div className={classes.content}>
						<Typography variant="headline">リスト</Typography>
					</div>
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
