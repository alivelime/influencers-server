
export default (state = {word: ''}, action) => {
	switch (action.type) {
		case 'CHANGE_SEARCH_WORD':
			return {word: action.word};

		case 'CLEAR_SEARCH_WORD':
			return {word: ""};

		default:
			return state;
	}
};

