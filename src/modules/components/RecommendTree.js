import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import RecommendBranch from 'modules/components/RecommendBranch';
import { getAPI, postAPI, deleteAPI } from 'modules/utils/DevUtils';

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
		});
	}

	addRecommendBranch = (id) => {
		postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.state.data[id].userId,
			prevId: id,
			nextId: this.state.data[id].nextId,
		}, res => {
			let data = Object.assign({}, this.state.data);
			data[id].nextId = res.id;
			data[res.id] = res;
			if (res.nextId !== "0") { data[res.nextId].prevId = res.id; }

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

		console.log(data);
		this.setState({data: data});
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
			for (let id = first;
					this.state.data.hasOwnProperty(id);
					id = this.state.data[id].nextId)
			{
				recommendBranches.push(
					<RecommendBranch
						key={id}
						data={this.state.data[id]}
						addRecommendBranch={this.addRecommendBranch}
						deleteRecommendBranch={this.deleteRecommendBranch}
					/>
				);
			}
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
