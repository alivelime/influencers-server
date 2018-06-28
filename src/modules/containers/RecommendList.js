import { connect } from 'react-redux'

import { loadUserRecommendData } from 'modules/redux/user/actions'
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,
	recommendBranches: getChild(props.id, props.parentChecked),
});

/*
 * this.state.recommendBranches, recommends, reviews is one level list.
 * do not make complex as nested object.
 */
function getChild(parentId, parentIsChecked) {
	
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendTree);


