import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import RecommendTree from 'modules/components/RecommendTree';
import ReviewForm from 'modules/components/ReviewForm';
import { postAPI, getAPI, putAPI } from 'modules/utils/DevUtils';

const styleSheet = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    maxWidth: theme.spacing.unit * 110,
    margin: 'auto',
	},
	header: {
		padding: theme.spacing.unit * 2,
	},
});

class  User extends React.Component {
	state = {
		name: '',
	};

	componentDidMount() {
    this.loadUserFromServer();
	}

	postTestData = event =>  {
	  const { id } = this.props.match.params;

		const user = {
			name: "テスト" + Date.now().toString(),
		};
		putAPI(`/api/users/${id}`, user, null);

		postAPI('/api/recommend-branches', {
			userId: id,
			name: "とりあえず1",
		}, (res) => {
			postAPI('/api/recommend-branches', {
				userId: id,
				name: "二つ目",
				prevId: res.id,
			}, (res) => {
				postAPI('/api/recommend-branches', {
					userId: id,
					name: "三つ目",
					prevId: res.id,
				});
			});
		});
	};

	loadUserFromServer() {
	  const { id } = this.props.match.params

		getAPI(`/api/users/${id}`, null, (res) => {
			this.setState({name: res.name});
		});
	}

	render() {
		const { classes } = this.props;
	  const { id } = this.props.match.params;

		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<Paper>
						<div className={classes.header}>
							<Typography
								className={classes.logo}
								variant="display2"
							>{this.state.name}
							</Typography>
						</div>
						<div><button onClick={this.postTestData} >テストデータ投入</button></div>
					</Paper>
				</div>
				<div className={classes.content}>
					<ReviewForm branch={0}/>
				</div>
				<div className={classes.content}>
					<RecommendTree userId={id} />
				</div>
			</div>
		);
	}
}
User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(User);
