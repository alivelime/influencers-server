export const addRecommendBranch = (id, userId, recommendBranches, token) => ({
	type: 'ADD_RECOMMEND_BRANCH_REQUEST',
	data: {
		name: "新しいリスト",
		userId: userId,
		parentId: recommendBranches[id].parentId,
		prevId: id,
		nextId: recommendBranches[id].nextId,
	},
	token,
})

export const addSubRecommendBranch = (parentId, userId, recommendBranches, token) => {
	const last = Object.keys(recommendBranches).find((id) => {
		return (recommendBranches[id].parentId === parentId && recommendBranches[id].nextId === "0");
	});

	return {
		type: 'ADD_RECOMMEND_BRANCH_REQUEST',
		data: {
			name: "新しいリスト",
			userId: userId,
			parentId: parentId,
			prevId: last || "0",
			nextId: "0",
		}
		token,
	};
}

export const deleteRecommendBranches = (ids, token) => ({
	type: 'DELETE_RECOMMEND_BRANCHES_REQUEST',
	ids,
	token,
})

export const moveUpRecommendBranch = (id, state, token) => {
	const prevId = state.recommendBranches[id].prevId;
	if (prevId !== "0") {
		return moveDownRecommendBranch(prevId, state, token);
	}
	return {type:null};
}

export const moveDownRecommendBranch = (id, state, token) => {
	let recommendBranches = Object.assign({}, state.recommendBranches);
	let patchArray = [];

	const B = id;
	const A = state.recommendBranches[B].prevId;
	const C = state.recommendBranches[B].nextId;

	// id is bottom.
	if (C === "0") {
		return {type:null};
	}
	const D = state.recommendBranches[C].nextId;

	// set prev id
	if (A !== "0") {
		recommendBranches[A].nextId = C;
		patchArray.push({
			id: A,
			nextId: C,
		});
	}

	recommendBranches[B].prevId = C;
	recommendBranches[B].nextId = D;
	patchArray.push({
		id: B,
		prevId: C,
		nextId: D,
	});

	recommendBranches[C].prevId = A;
	recommendBranches[C].nextId = B;
	patchArray.push({
		id: C,
		prevId: A,
		nextId: B,
	});

	if (D !== "0") {
		recommendBranches[D].prevId = B;
		patchArray.push({
			id: D,
			prevId: B,
		});
	}

	return {
		type: 'UPDATE_RECOMMEND_BRANCHES_REQUEST',
		data: patchArray,
		token, token,
	}

};

// make update patch -> response change recommendBranches.
// 
// but this function should be in reducer... and dispatch patch data??
export const moveRecommendBranches = (ids, to, state, token) => {
	let patches = {};

	let last = Object.keys(state.recommendBranches).find((id) => {
		return state.recommendBranches[id].parentId === to && state.recommendBranches[id].nextId === "0";
	});

	ids.forEach((id) => {
		if (last === id) { console.log("skip " + id + " is last."); return;}

		if (last in state.recommendBranches) {
			if (!(last in patches)) {
				patches[last] = Object.assign({}, state.recommendBranches[last]);
			}
			patches[last].nextId = id;
		}
		
		// remove from old branch.
		const prevId = state.recommendBranches[id].prevId;
		if (prevId in state.recommendBranches) {
			if (!(prevId in patches)) {
				patches[prevId] = Object.assign({}, state.recommendBranches[prevId]);
			}
			patches[prevId].nextId = state.recommendBranches[id].nextId;
		}
		const nextId = state.recommendBranches[id].nextId;
		if (nextId in state.recommendBranches) {
			if (!(nextId in patches)) {
				patches[nextId] = Object.assign({}, state.recommendBranches[nextId]);
			}
			patches[nextId].prevId = state.recommendBranches[id].prevId;
		}

		// set new data.
		patches[id] = {
			parentId: to,
			prevId: (last ? last : "0"),
			nextId: "0",
		};

		last = id;
	});

	const data = Object.keys(patches).map((id) => {
		return {
			id: id,
			parentId: patches[id].parentId,
			nextId: patches[id].nextId,
			prevId: patches[id].prevId,
		}
	});

	return {
		type: 'UPDATE_RECOMMEND_BRANCHES_REQUEST',
		data,
		token,
	};
};

export const updateRecommendBranch = (data, token) => {
	return updateRecommendBranches([data], token);
}

export const updateRecommendBranches = (data, token) => ({
	type: 'UPDATE_RECOMMEND_BRANCHES_REQUEST',
	data,
	token,
})

export const openRecommendBranch = id => ({
	type: 'OPEN_RECOMMEND_BRANCH',
	id,
});

export const closeRecommendBranch = id => ({
	type: 'CLOSE_RECOMMEND_BRANCH',
	id,
});

export const openALLRecommendBranch = () => ({
	type: 'OPEN_ALL_RECOMMEND_BRANCHES',
});

export const closeAllRecommendBranch = () => ({
	type: 'CLOSE_ALL_RECOMMEND_BRANCHES',
});


