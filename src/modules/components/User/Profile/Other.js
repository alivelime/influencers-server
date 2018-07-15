import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styleSheet = theme => ({
});

class Profile extends React.Component {

	render() {
		const { data } = this.props;

		return (
			<Paper>
				<Typography variant="body2">{data.memo}</Typography>
			</Paper>
		);
	}

}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Profile);

