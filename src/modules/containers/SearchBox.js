import { connect } from 'react-redux';
import ReactGA from 'react-ga';

import * as actions from 'modules/redux/user/actions';
import SearchBox from 'modules/components/SearchBox';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = (state, props) => ({
	searchWord: state.searchWord,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,
	handleChange: (e) => {
		dispatch(actions.changeSearchWord(e.target.value)); 
		if (e.target.value) {
			ReactGA.event({
				category: 'site',
				action: 'search',
				value: e.target.value,
			});
		}
	},
	handleClear: () => dispatch(actions.clearSearchWord()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(SearchBox);

