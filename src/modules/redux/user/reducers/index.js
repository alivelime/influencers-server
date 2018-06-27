import { combineReducers } from 'redux';
import { reducer } from 'redux-form'

import user from 'modules/redux/user/reducers/user';
import checker from 'modules/redux/user/reducers/checker';
import recommendBranches from 'modules/redux/user/reducers/recommendBranches';
import recommends from 'modules/redux/user/reducers/recommends';
import reviews from './reviews';

export default combineReducers({
	user,
	checker,
	recommendBranches,
	recommends,
	reviews,
	reviewForm: reducer,
});
