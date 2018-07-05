import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import user from 'modules/redux/user/reducers/user';
import checker from 'modules/redux/user/reducers/checker';
import recommendBranches from 'modules/redux/user/reducers/recommendBranches';
import recommends from 'modules/redux/user/reducers/recommends';
import reviews from 'modules/redux/user/reducers/reviews';
import reviewForm from 'modules/redux/user/reducers/reviewForm';
import reviewFormPlugin from 'modules/redux/user/reducers/reviewFormPlugin';

export default combineReducers({
	user,
	checker,
	recommendBranches,
	recommends,
	reviews,
	reviewForm,
	form: formReducer.plugin({reviewForm: reviewFormPlugin}),
});
