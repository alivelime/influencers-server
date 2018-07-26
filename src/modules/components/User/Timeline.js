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
		flexWrap: 'wrap',
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
		flexWrap: 'wrap',
		alignItems: 'center', 
		width: "100%",
		padding: theme.spacing.unit * 2,
	},
	flex: {
		display: 'flex',
		alignItems: 'center', 
		alignContent: 'center',
	},
	flexMain: {
		display: 'flex',
		alignItems: 'center', 
		alignContent: 'center',
		flex: 1,
	},
	thumbnail: {
		maxHeight: '4em',
		margin: theme.spacing.unit,
	},
});

function makeMessage(classes, data, users, reviews, recommends) {
	switch (data.event) {
		case config.TIMELINE_IIYO:
		{
			const review = reviews[data.what];
			const recommend = recommends[review.recommendId];
			return (
				<div className={classes.flexMain} >
					{recommend.image && <img src={recommend.image} className={classes.thumbnail} alt="iiyo" /> }
					<div>
						<Link to={`/users/${data.i}/recommend-branches/${review.recommendBranchId}`}>
							{recommend.title}
						</Link>
						<span>を"いいよ"しました。</span>
					</div>
				</div>
			);
		}
		case config.TIMELINE_IINE:
		{
			const review = reviews[data.what];
			const recommend = recommends[review.recommendId];
			return (
				<div className={classes.flexMain} >
					{recommend.image ? <img src={recommend.image} className={classes.thumbnail} alt="iiyo" /> : null}
					<div>
						{recommend.title}の"いいよ"に
						<Link to={`/users/${data.i}/recommend-branches/${review.recommendBranchId}`}>
							"いいね"
						</Link>
						しました。
					</div>
				</div>
			);
		}
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
	componentDidUpdate(prevProps) {
		if (this.props.userId !== prevProps.userId) {
			this.props.loadTimeline();
		}
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

		const makeTimeline = (data, i) => {
			return (
				<ListItem key={i}>
					<Paper className={classes.timeline}>
						{data.i !== this.props.userId &&
							<div>
								<Link to={`/users/${data.i}`} >
									<div className={classes.flex} >
										<Avatar src={timeline.users[data.i].avatar} />
										<div>{`${timeline.users[data.i].name}`}</div>
									</div>
								</Link>
								<div>さんが</div>
							</div>
						}
						{data.u !== "0" && data.u !== this.props.userId &&
							<div>
								<Link to={`/users/${data.u}`} >
									<div className={classes.flex} >
										<Avatar src={timeline.users[data.u].avatar} />
										<div>{`${timeline.users[data.u].name}`}</div>
									</div>
								</Link>
								<div>さんの</div>
							</div>
						}
						{makeMessage(classes, data, timeline.users, timeline.reviews, timeline.recommends)}
					</Paper>
				</ListItem>
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
						? timeline.data.me.map(makeTimeline)
						:	<p>データがありません。</p>
					)}
					{this.state.value === 1 && <p>follower</p>
					}
					{this.state.value === 2 && (timeline.data.i.length > 0
						? timeline.data.i.map(makeTimeline)
						:	<p>データがありません。</p>
					)}
				</List>
			</div>
		);
	}

}

Timeline.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Timeline);

