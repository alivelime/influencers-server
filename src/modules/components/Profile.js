import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class  Profile extends React.Component {

	componentDidMount() {
		this.props.loadUser(this.props.id);
	}

	testData = () {
		return {
			id: this.props.data.id,
			name: "テスト" + Date.now().toString(),
		};
	}

	render() {
		const { data, setUser } = this.props;

		return (
			<Paper>
				<div className={classes.header}>
					<Typography
						className={classes.logo}
						variant="display2"
					>{data.name}
					</Typography>
				</div>
				<div><button onClick={() => {setUser(this.testData())} >テストデータ投入</button></div>
			</Paper>
		);
	}

}

User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Profile);
