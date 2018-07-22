import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


import Link from 'modules/components/Link';
import My from 'modules/components/User/Profile/My';
import Other from 'modules/components/User/Profile/Other';

const styleSheet = theme => ({
	header: {
		display: "flex",
		padding: theme.spacing.unit * 2,
	},
	image: {
		width: "100%",
	},
	icon: {
		marginLeft: "auto",
		width: '1.6em',
		height: '1.6em',
	},
});

class Profile extends React.Component {

	state = {
		isOpen: !this.props.isMine,
	};
	componentDidMount() {
		this.props.loadUser();
	}

	render() {
		const { user, classes } = this.props;
		if (!user || Object.keys(user).length === 0) return null; 

		return (
			<Paper>
				<a href={user.snsUrl}>
					{user.image && user.image.length > 0 &&
						<img src={user.image} alt="profile" className={classes.image} />
					}
				</a>
				<div className={classes.header}>
					<Link to={user.snsUrl} variant="primary">
						<Avatar src={user.avatar} />
					</Link>
					<Link to={user.link} variant="primary">
						<Typography variant="display1">{user.name}さん</Typography>
					</Link>
					<IconButton
						className={classes.icon}
						onClick={() => {this.setState({isOpen: !this.state.isOpen})}}
					>
						{this.state.isOpen ? <ExpandLess className={classes.icon}/> : <ExpandMore className={classes.icon}/>}
					</IconButton>
				</div>
				<Collapse in={this.state.isOpen} tomeout="auto">
					{this.props.isMine
						? <My
							user={this.props.user}
							updateUser={this.props.updateUser}
							deleteUser={this.props.deleteUser}
							loadAffiliate={this.props.loadAffiliate}
							updateAffiliate={this.props.updateAffiliate}
						/>
						: <Other user={this.props.user}/>
					}
				</Collapse>
			</Paper>
		);
	}

}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Profile);
