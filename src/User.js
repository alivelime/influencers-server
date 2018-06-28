import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'

import UserRecommendTree from 'modules/containers/UserRecommendTree';
import UserProfile from 'modules/containers/UserProfile';
import userReducer from 'modules/redux/user/reducers'
import userSaga from 'modules/redux/user/saga';

const styleSheet = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    maxWidth: theme.spacing.unit * 160,
    margin: 'auto',
	},
	header: {
		padding: theme.spacing.unit * 2,
	},
});

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  userReducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(userSaga);

class  User extends React.Component {

	render() {
		const { classes } = this.props;
	  const { id, recommendBranchId, iineId } = this.props.match.params;

		return (
			<Provider store={store} >
				<div className={classes.root}>
					<div className={classes.content}>
						<UserProfile id={id} />
					</div>
					<div className={classes.content}>
						<UserRecommendTree
							userId={id}
							recommendBranchId={recommendBranchId || "0"}
							iineId={iineId}
						/>
					</div>
				</div>
			</Provider>
		);
	}
}
User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(User);
