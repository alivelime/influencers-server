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

		let ogp = {title: '', image: '', description: ''}

		if (this.props.url && isURL(this.props.url)) {
			ogp = getOGPData(this.props.url);
		} else if (this.props.data) {
			if ("title" in this.props.data && this.props.data.title.length > 0) {
				ogp = this.props.data;
			} else {
				// if title is null, get title and images.
				ogp = getOGPData(this.props.data.url);
			}
		} else {
			return null;
		}

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
};

export default withStyles(styleSheet)(Recommend);

