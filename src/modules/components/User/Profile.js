import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Link from 'modules/components/Link';

import My from 'modules/components/User/Profile/My';
import Other from 'modules/components/User/Profile/Other';

const styleSheet = theme => ({
	header: {
		padding: theme.spacing.unit * 2,
	},
	image: {
		width: "100%",
	},
});

class Profile extends React.Component {

	componentDidMount() {
		this.props.loadUser();
	}

	render() {
		const { data, classes } = this.props;
		if (Object.keys(data).length === 0) return null; 

		return (
			<Paper>
				<a href={data.snsUrl}>
					<img src={data.image} alt="profile" className={classes.image} />
				</a>
				<div className={classes.header}>
					<Link to={data.link} variant="primary">
						<Avatar src={data.avatar} />
						<Typography variant="display1">{data.name}さん</Typography>
					</Link>
				</div>
				{this.props.isMine
					? <My
						data={this.props.data}
						updateUser={this.props.updateUser}
						deleteUser={this.props.deleteUser}
					/>
					: <Other data={this.props.data}/>
				}
			</Paper>
		);
	}

}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Profile);
