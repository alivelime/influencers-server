import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';


import Link from 'modules/components/Link';
import {getAPI} from 'modules/utils/Request';

const styleSheet = theme => ({
	paper: {
		padding: theme.spacing.unit * 2,
		marginLeft: theme.spacing.unit * 2,
	},
	item: {
		paddingTop: 0,
		paddingBottom: 0,
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center',
	},
	progressDiv: {
		textAlign: 'center',
	},
	progress: {
		margin: theme.spacing.unit * 2,
	},
	user: {
		display: 'flex',
		flexDirection: 'column',
	},
	flex: {
		display: 'flex',
	},
	nowrap: {
		maxWidth: 640,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	avatar: {
		margin: theme.spacing.unit * 1.5,
		width: 60,
		height: 60,
	},
});

class Ranking extends React.Component {

	state = {nowLoading: true, users: []};
	async componentDidMount() {
		const users = await getAPI('/api/users');
		this.setState({nowLoading: false, users});
	}

	render() {
		const { classes } = this.props;
		if (this.state.nowLoading) {
			return (
				<Paper>
					<div className={classes.progressDiv}>
						<CircularProgress
							className={classes.progress}
							size={100}
						/>
					</div>
				</Paper>
			)
		}
		if (!this.state.users || this.state.users.length === 0) {
			return null;
		}

		return (
			<Paper className={classes.paper}>
				<Typography variant="display1">話題のインフルエンサーず</Typography>
				<List component="nav">
					{this.state.users.map(user => (
						<ListItem key={user.id} className={classes.item}>
							<div className={classes.root}>
								<Typography variant="display1">{user.influCount}</Typography>
								<Avatar src={user.avatar} className={classes.avatar}/>
								<div className={classes.user}>
									<div className={classes.flex} >
										<Link to={`/users/${user.id}`} >
											<Typography variant="headline">
												{user.name}
											</Typography>
										</Link>
									</div>
									<div className={classes.flex} >
										<Typography variant="title" className={classes.nowrap}>
											{user.memo}
										</Typography>
									</div>
								</div>
							</div>
						</ListItem>
					))}
				</List>
			</Paper>
		);
	}
}

Ranking.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Ranking);
