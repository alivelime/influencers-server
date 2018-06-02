import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import RecommendBranch from 'modules/components/RecommendBranch';
import { getAPI } from 'modules/utils/DevUtils';

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

	render() {
		const { classes } = this.props;
		const recommendBranches = Object.keys(this.state.data).map( id => {
			return (
				<RecommendBranch key={id} data={this.state.data[id]} />
			);
		});

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
