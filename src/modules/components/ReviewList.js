import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';

import Review from 'modules/components/Review';

const styleSheet = theme => ({
});

class ReviewList extends React.Component {

	render() {
		const { classes } = this.props;
		return this.props.reviews.map((review) => {
			return (
				<ListItem key={review.id} className={classes.review} >
					<Review
						data={review}
						isMine={this.props.isMine}
						myUserId={this.props.myUserId}
					/>
				</ListItem>
			);
		});
	}
}

ReviewList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(ReviewList);
