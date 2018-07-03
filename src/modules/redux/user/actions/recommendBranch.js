
export const addRecommendBranch = (id, state) => ({
	type: 'ADD_RECOMMEND_BRANCH_REQUEST',
	data: {
		name: "新しいリスト",
		userId: state.user.id,
		parentId: state.recommendBranches[id].parentId,
		prevId: id,
		nextId: (id === "0" ? "0" : state.recommendBranches[id].nextId),
	},
})

export const addSubRecommendBranch = (parentId, state) => {
	const last = Object.keys(state.recommendBranches).find((id) => {
		return (state.recommendBranches[id].parentId === parentId && state.recommendBranches[id].nextId === "0");
	});

	return {
	type: 'ADD_RECOMMEND_BRANCH_REQUEST',
	data: {
		name: "新しいリスト",
		userId: state.user.id,
		parentId: parentId,
		prevId: last || "0",
		nextId: "0",
	};
}

export const deleteRecommendBranches = ids => ({
	type: 'DELETE_RECOMMEND_BRANCHES_REQUEST',
	ids,
})

export const moveUpRecommendBranch = (id, state) => {
	const prevId = state.recommendBranches[id].prevId;
	if (prevId !== "0") {
		return moveDownRecommendBranch(prevId, state);
	}
	return null;
}

export const moveDownRecommendBranch = (id, state) => {
	let recommendBranches = Object.assign({}, state.recommendBranches);
	let patchRecommendBranches = [];

	const B = id;
	const A = state.recommendBranches[B].prevId;
	const C = state.recommendBranches[B].nextId;

	// id is bottom.
	if (C === "0") {
		return null;
	}
	const D = state.recommendBranches[C].nextId;

	// set prev id
	if (A !== "0") {
		recommendBranches[A].nextId = C;
		patchRecommendBranches.push({
			id: A,
			nextId: C,
		});
	}

	recommendBranches[B].prevId = C;
	recommendBranches[B].nextId = D;
	patchRecommendBranches.push({
		id: B,
		prevId: C,
		nextId: D,
	});

	recommendBranches[C].prevId = A;
	recommendBranches[C].nextId = B;
	patchRecommendBranches({
		id: C,
		prevId: A,
		nextId: B,
	});

	if (D !== "0") {
		recommendBranches[D].prevId = B;
		patchRecommendBranches({
			id: D,
			prevId: B,
		});
	}

	return {
		type: 'UPDATE_RECOMMEND_BRANCHES_REQUEST',
		data: patchRecommendBranches,
	}

};

// make update patch -> response change recommendBranches.
// 
// but this function should be in reducer... and dispatch patch data??
export const moveRecommendBranches = (ids, to, state) => {
	let patchRecommendBranches = {};

	let last = Object.keys(state.recommendBranches).find((id) => {
		return state.recommendBranches[id].parentId === to && state.recommendBranches[id].nextId === "0";
	});

	ids.forEach((id) => {
		if (last === id) { console.log("skip " + id + " is last."); return;}

		if (last in state.recommendBranches) {
			if (!(last in patchRecommendBranches)) {
				patchRecommendBranches[last] = Object.assign({}, state.recommendBranches[last]);
			}
			patchRecommendBranches[last].nextId = id;
		}
		
		// remove from old branch.
		const prevId = state.recommendBranches[id].prevId;
		if (prevId in state.recommendBranches) {
			if (!(prevId in patchRecommendBranches)) {
				patchRecommendBranches[prevId] = Object.assign({}, state.recommendBranches[prevId]);
			}
			patchRecommendBranches[prevId].nextId = state.recommendBranches[id].nextId;
		}
		const nextId = state.recommendBranches[id].nextId;
		if (nextId in state.recommendBranches) {
			if (!(nextId in patchRecommendBranches)) {
				patchRecommendBranches[nextId] = Object.assign({}, state.recommendBranches[nextId]);
			}
			patchRecommendBranches[nextId].prevId = state.recommendBranches[id].prevId;
		}

		// set new data.
		patchRecommendBranches[id] = {
			parentId: to,
			prevId: (last ? last : "0"),
			nextId: "0",
		};

		last = id;
	});

	const data = Object.keys(patchRecommendBranches).map((id) => {
		return {
			id: id,
			parentId: patchRecommendBranches[id].parentId,
			nextId: patchRecommendBranches[id].nextId,
			prevId: patchRecommendBranches[id].prevId,
		}
	});

	return {
		type: 'UPDATE_RECOMMEND_BRANCHES_REQUEST',
		data: 
	}
};

export const updateRecommendBranch = data => {
	return updateRecommendBranches([data]);
}

export const updateRecommendBranches = data => ({
	type: 'UPDATE_RECOMMEND_BRANCHES_REQUEST',
	data,
})

export const openRecommendBranch = id => ({
	type: 'OPEN_RECOMMEND_BRANCHES',
	id,
});

export const closeRecommendBranch = id => ({
	type: 'CLOSE_RECOMMEND_BRANCHES',
	id,
});


