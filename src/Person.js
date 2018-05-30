import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import RecommendTree from 'modules/components/RecommendTree';
import ReviewForm from 'modules/components/ReviewForm';

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

class  Person extends React.Component {
	state = {
		name: '',
	};

	componentDidMount() {
    this.loadPersonFromServer();
	}

	loadPersonFromServer() {
	  const { id } = this.props.match.params

		fetch(new Request(`/api/persons/${id}`))
		.then((response) => {
				return response.json();
		}, (err) => {console.log(err);})
		.then((res) => {
			console.log(res);
			this.setState({name: res.name});
		});
	}

	render() {
		const { classes } = this.props;

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
					</Paper>
				</div>
				<div className={classes.content}>
					<ReviewForm branch={0}/>
				</div>
				<div className={classes.content}>
					<RecommendTree />
				</div>
			</div>
		);
	}
}
Person.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Person);
