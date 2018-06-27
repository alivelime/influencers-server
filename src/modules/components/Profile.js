import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styleSheet = theme => ({
	header: {
		padding: theme.spacing.unit * 2,
	},
});
class  Profile extends React.Component {

	componentDidMount() {
		this.props.loadUser(this.props.id);
	}

	testData = () => {
		return {
			id: 1,
			name: "テスト" + Date.now().toString(),
		};
	};

	render() {
		const { data, updateUser, classes } = this.props;

		return (
			<Paper>
				<div className={classes.header}>
					<Typography variant="display2" >{data.name} </Typography>
				</div>
				<div><button onClick={() => {updateUser(this.testData())}} >テストデータ投入</button></div>
			</Paper>
		);
	}

}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Profile);
