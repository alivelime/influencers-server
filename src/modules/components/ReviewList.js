import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import RecommendList from 'modules/containers/RecommendList';
import Recommend from 'modules/components/Recommend';
import Review from 'modules/components/Review';

const styleSheet = theme => ({
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	container:{
		paddingTop: theme.spacing.unit * 0.5,
		paddingBottom: theme.spacing.unit * 0.5,
	},
});

class ReviewList extends React.Component {

	render() {
		if (!this.props.found) { return nill; }

		const { classes } = this.props;
		return this.props.reviews.map((review) => {
			return (
				<ListItem key={review.id} className={classes.review} >
					<Review data={review} />
				</ListItem>
			);
		});
	}
}

ReviewList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(ReviewList);



