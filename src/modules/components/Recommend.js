import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import { getOGPData } from 'modules/utils/OGP';
import { isURL } from 'modules/utils/Validation';

const styleSheet = theme => ({
	image: {
		width: 160,
	},
	card: {
		display: 'flex',
		padding: theme.spacing.unit * 2,
	},
});

class Recommend extends React.Component {

	render() {
		const { classes } = this.props;

		if (!isURL(this.props.url)) {
			return null;
		}

		let ogp = {title: '', image: '', description: ''}
		ogp = getOGPData(this.props.url);

		return (
			<Card className={classes.card}>
				<CardMedia
					className={classes.image}
					image={ogp.image}
					title={ogp.title}
				/>
				<CardContent className={classes.content}>
					<Typography variant="title">{ogp.title}</Typography>
					<Typography variant="body1">{ogp.description}</Typography>
				</CardContent>
			</Card>
		);
	}
}

Recommend.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};

export default withStyles(styleSheet)(Recommend);

