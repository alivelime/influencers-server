import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Link from 'modules/components/Link';

import * as config from 'config';

const styleSheet = theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	progressDiv: {
		textAlign: 'center',
	},
	progress: {
		margin: theme.spacing.unit * 2,
	},
	icon: {
		marginLeft: "auto",
		width: '1.6em',
		height: '1.6em',
	},
	timeline: {
		display: "flex",
		width: "100%",
		padding: theme.spacing.unit * 2,
	},
	flex: {
		display: 'flex',
	},
});

function makeYourMessage(data, users, reviews) {
	switch (data.event) {
		case config.TIMELINE_IIYO:
			// TODO 
			return `${data.what}を"いいよ"しました。`
		case config.TIMELINE_IINE:
			return `${data.what}を"いいね"しました。`
		case config.TIMELINE_FOLLOW:
			return `${data.u}さんをフォローしました。`
		default:
			throw new Error("no implement type "+data.event);
	}
};

class Timeline extends React.Component {

	state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

	componentDidMount() {
		this.props.loadTimeline();
	}

	render() {
		const { timeline, classes } = this.props;

		// now loading...
		if (timeline.state === "loading") {
			return (
				<div className={classes.progressDiv}>
					<CircularProgress
						className={classes.progress}
						size={100}
					/>
				</div>
			);
		}

		return (
			<div className={classes.root}>
				<AppBar position="static" color="default">
				<Tabs
					className={classes.tabs}
					value={this.state.value}
					onChange={this.handleChange}
					indicatorColor="primary"
					textColor="primary"
					fullWidth
				>
					<Tab className={classes.tab} label="お知らせ" />
					<Tab className={classes.tab} label="フォロー" disabled/>
					<Tab className={classes.tab} label="履歴" />
				</Tabs>
			</AppBar>
				<List component="nav">
					{this.state.value === 0 && (timeline.data.me.length > 0
						? timeline.data.me.map(data => {
							return (
								<ListItem>
									<Paper className={classes.timeline}>
										<Link to={`/users/${data.i}`} >
											<div className={classes.flex} >
												<Avatar src={timeline.users[data.i].avatar} />
												<div>{`${timeline.users[data.i].name}さん`}</div>
											</div>
										</Link>
										<div className={classes.flexMain} >
											が{makeYourMessage(data, timeline.users, timeline.reviees)}
										</div>
									</Paper>
								</ListItem>
							)})
						:	<p>データがありません。</p>
					)}
					{this.state.value === 1 && <p>follower</p>
					}
					{this.state.value === 2 && <p>i</p>
					}
				</List>
			</div>
		);
	}

}

Timeline.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Timeline);

