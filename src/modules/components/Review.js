import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styleSheet = theme => ({
	image: {
		minWidth: 80,
		maxHeight: 240,
	},
	card: {
		display: 'flex',
		paddingLeft: theme.spacing.unit * 3,
		width: "100%",
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
				<CardMedia
					className={classes.image}
					image={meta.image}
					title={meta.title}
				/>
				<CardContent className={classes.content}>
					<Typography variant="title">{meta.title}</Typography>
					<Typography variant="body1">{this.props.data.memo}</Typography>
					<Typography variant="body2">
						お気に入り度 : {this.props.data.forMe}
						オススメ度 : {this.props.data.forYou}
						日付 : {this.props.data.createdAt.toLocaleDateString()}
					</Typography>
				</CardContent>
			</Card>
		);
	}
}

Review.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Review);


