import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ThumbUp from '@material-ui/icons/ThumbUp';
import CallMerge from '@material-ui/icons/CallMerge';
import CallSplit from '@material-ui/icons/CallSplit';

import Login from 'modules/components/Login';
import Link from 'modules/components/Link';

import { MY_PAGE } from 'config';

const styleSheet = theme => ({
	image: {
		minWidth: 80,
		minHeight: 80,
		maxHeight: 240,
	},
	card: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		paddingLeft: theme.spacing.unit * 3,
		width: "100%",
		backgroundColor: 'inherit',
	},
	icon: {
		width: '1.6em',
		height: '1.6em',
		color: theme.palette.secondary.main,
	},
	iconDisable: {
		width: '1.6em',
		height: '1.6em',
		color: theme.palette.grey[500],
	},
	content: {
		flex: 1,
	},
	main: {
		flex: 1,
	},
	iconBox: {
		flex: 0,
		padding: theme.spacing.unit * 1,
	},
	margin: {
    margin: theme.spacing.unit * 2,
  },
});

class Review extends React.Component {

	render() {
		const { classes } = this.props;

		let meta = {url: '', title: '', image: '', description: ''}

		if (this.props.data.meta) {
			meta = this.props.data.meta;
		}

		return (
			<Card className={classes.card}>
				{meta.image &&
					<CardMedia
						className={classes.image}
						image={meta.image}
						title={meta.title}
					/>
				}
				<CardContent className={classes.content}>
					<Link to={this.props.data.evidence} target="new" rel="noopener noreferrer">
						<Typography variant="title">{this.props.data.memo}</Typography>
						<Typography variant="body1">{meta.title}</Typography>
					</Link>
					<Typography variant="body2">
						お気に入り度 : {this.props.data.forMe}
						オススメ度 : {this.props.data.forYou}
						日付 : {this.props.data.createdAt.toLocaleDateString()}
					</Typography>
				</CardContent>
				{this.props.data.iineId !== "0" &&
					<div className={classes.iconBox}>
						<Link to={`/users/${this.props.data.iineUserId}`}>
							<IconButton>
								<CallMerge className={classes.icon} />
							</IconButton>
						</Link>
					</div>
				}
				{this.props.data.iineCount > 0 &&
					<div className={classes.iconBox}>
						<Badge className={classes.margin} badgeContent={Number(this.props.data.iineCount)} color="secondary">
							<CallSplit className={classes.iconDisable} />
						</Badge>
					</div>
				}
				{!this.props.isMine &&
					<div className={classes.iconBox}>
						{this.props.myUserId ? (
							<Link to={`/users/${this.props.myUserId}/iine/${this.props.data.id}`}>
								<IconButton>
									<ThumbUp className={classes.icon} />
								</IconButton>
							</Link>
						) : (
							<Login redirect={`${MY_PAGE}/iine/${this.props.data.id}`}>
								<IconButton>
									<ThumbUp className={classes.icon} />
								</IconButton>
							</Login>
						)}
					</div>
				}
			</Card>
		);
	}
}

Review.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Review);


