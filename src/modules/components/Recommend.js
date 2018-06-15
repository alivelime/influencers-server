import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Link from 'modules/components/Link';

const styleSheet = theme => ({
	image: {
		minWidth: 80,
		maxHeight: 240,
	},
	card: {
		display: 'flex',
		padding: theme.spacing.unit * 2,
		width: '100%',
	},
});

class Recommend extends React.Component {

	render() {
		const { classes } = this.props;

		if (!this.props.data.title || this.props.data.title.length === 0) {
			return null;
		}

		if (this.props.enableLink) {
			return (
				<Card className={classes.card}>
					<CardMedia
						className={classes.image}
						image={this.props.data.image}
						title={this.props.data.title}
					/>
					<Link to={this.props.data.url}>
						<CardContent className={classes.content}>
							<Typography variant="title">{this.props.data.title}</Typography>
							<Typography variant="body1">{this.props.data.description}</Typography>
						</CardContent>
					</Link>
				</Card>
			);
		} else {
			return (
				<Card className={classes.card}>
					<CardMedia
						className={classes.image}
						image={this.props.data.image}
						title={this.props.data.title}
					/>
					<CardContent className={classes.content}>
						<Typography variant="title">{this.props.data.title}</Typography>
						<Typography variant="body1">{this.props.data.description}</Typography>
					</CardContent>
				</Card>
			);
		}
	}
}

Recommend.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Recommend);

