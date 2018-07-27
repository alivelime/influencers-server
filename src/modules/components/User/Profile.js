import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Timeline from '@material-ui/icons/Timeline';
import Map from '@material-ui/icons/Map';
import PersonAdd from '@material-ui/icons/PersonAdd';

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
		width: '1.6em',
		height: '1.6em',
	},
	number: {
		fontSize: '24pt',
		maxWidth: '1.6em',
		maxHeight: '1.6em',
		margin: theme.spacing.unit,
	},
	iconBox: {
		display: "flex",
		padding: theme.spacing.unit,
	},
	iconBoxLink: {
		margin: theme.spacing.unit,
	},
	follow: {
		margin: theme.spacing.unit,
	},
	button: {
		minWidth: "60pt",
		display: "flex",
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: '0.6em',
	},
});

class Profile extends React.Component {

	state = {
		isOpen: !this.props.isMine,
	};
	componentDidMount() {
		this.props.loadUser();
		this.props.loadUserFollow();
		this.props.loadUserFollower();
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.props.id !== prevProps.id) {
			this.props.loadUser();
		}
		if (this.state === prevState && this.props.isMine) {
			this.setState({isOpne: false});
		}
	}
	componentWillUnmount() {
		this.props.clearUser();
	}

	render() {
		const { user, classes } = this.props;
		if (user.id === undefined || user.id.length <= 1) return (<p>{user.name}</p>); 

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
							loadAffiliate={this.props.loadAffiliate}
							updateAffiliate={this.props.updateAffiliate}
							clearAffiliate={this.props.clearAffiliate}
						/>
						: <Other user={this.props.user}/>
					}
				</Collapse>
				<div className={classes.iconBox} >
					<Link to={`/users/${this.props.id}/timeline`} className={classes.iconBoxLink}>
						<Badge className={classes.margin} badgeContent={'?'} color="secondary">
							<Button variant="raised" color="primary" size="small">
								<div className={classes.button}>
									<div><Timeline className={classes.icon}/></div>
									<div className={classes.buttonText}>タイムライン</div>
								</div>
							</Button>
						</Badge>
					</Link>
					<Link to={`/users/${this.props.id}`} className={classes.iconBoxLink}>
						<Button variant="raised" color="primary" size="small">
							<div className={classes.button}>
								<div><Map className={classes.icon}/></div>
								<div className={classes.buttonText}>これいいよ</div>
							</div>
						</Button>
					</Link>
					{this.props.myUserId && !this.props.isMine &&
						<Button
							onClick={this.props.handleFollow}
							variant={!this.props.isFollow ? "raised" : "outlined"}
							color="primary"
							size="small"
							className={classes.follow}
						>
							<div className={classes.button}>
								<PersonAdd className={classes.icon} />
								<div className={classes.buttonText}>フォロー{this.props.isFollow ? '中' : 'する'}</div>
							</div>
						</Button>
					}
					<Button variant="outlined" color="primary" size="small" className={classes.follow} >
						<div className={classes.button}>
							<div className={classes.number}>{this.props.user.followIds.length}</div>
							<div className={classes.buttonText}>フォロー</div>
						</div>
					</Button>
					<Button variant="outlined" color="primary" size="small" className={classes.follow} >
						<div className={classes.button}>
							<div className={classes.number}>{this.props.user.followerIds.length}</div>
							<div className={classes.buttonText}>フォロワー</div>
						</div>
					</Button>
				</div>
			</Paper>
		);
	}

}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Profile);
