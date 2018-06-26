import { combineReducers } from 'redux';
import { reducer } from 'redux-form'

import user from './user';
import checker from './checker';
import reviewForm from './reviewForm';
import recommendBranches from './recommendBranches';
import recommends from './recommends';
import reviews from './reviews';

export default combineReducers({
	user,
	reviewForm,
	checker,
	recommendBranches,
	recommends,
	reviews,
	reviewForm: reducer,
});
