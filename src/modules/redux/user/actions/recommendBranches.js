export const addRecommendBranch = (id, userId, recommendBranches, token) => ({
	type: 'ADD_RECOMMEND_BRANCH_REQUEST',
	data: {
		name: "新しいリスト",
		recommendId: "",
		userId: userId,
		parentId: recommendBranches[id].parentId,
		prevId: id,
		nextId: recommendBranches[id].nextId,
	},
	patch:{
		prevId: id,
		nextId: (id in recommendBranches ? recommendBranches[id].nextId : "0"),
	},
	token,
})

export const addSubRecommendBranch = (parentId, userId, recommendId, recommendBranches, token) => {
	const last = Object.keys(recommendBranches).find((id) => {
		return (recommendBranches[id].parentId === parentId && recommendBranches[id].nextId === "0");
	});

	return {
		type: 'ADD_RECOMMEND_BRANCH_REQUEST',
		data: {
			name: "新しいリスト",
			recommendId: recommendId,
			userId: userId,
			parentId: parentId,
			prevId: last || "0",
			nextId: "0",
		},
		patch:{
			prevId: last || "0",
			nextId: "0",
		},
		token,
	};
}

export const deleteRecommendBranches = (ids, token) => ({
	type: 'DELETE_RECOMMEND_BRANCHES_REQUEST',
	ids,
	token,
})

export const moveUpRecommendBranch = (id, recommendBranches, token) => {
	const prevId = recommendBranches[id].prevId;
	if (prevId !== "0") {
		return moveDownRecommendBranch(prevId, recommendBranches, token);
	}
	return {type:null};
}

export const moveDownRecommendBranch = (id, _recommendBranches, token) => {
	let recommendBranches = Object.assign({}, _recommendBranches);
	let patchArray = [];

	const B = id;
	const A = _recommendBranches[B].prevId;
	const C = _recommendBranches[B].nextId;

	// id is bottom.
	if (C === "0") {
		return {type:null};
	}
	const D = _recommendBranches[C].nextId;

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
		token,
	}

};

// make update patch -> response change recommendBranches.
// 
// but this function should be in reducer... and dispatch patch data??
export const moveRecommendBranches = (ids, to, recommendBranches, token) => {
	let patches = {};

	let last = Object.keys(recommendBranches).find((id) => {
		return recommendBranches[id].parentId === to && recommendBranches[id].nextId === "0";
	});

	ids.forEach((id) => {
		if (last === id) { console.log("skip " + id + " is last."); return;}

		if (last in recommendBranches) {
			if (!(last in patches)) {
				patches[last] = Object.assign({}, recommendBranches[last]);
			}
			patches[last].nextId = id;
		}
		
		// remove from old branch.
		const prevId = recommendBranches[id].prevId;
		if (prevId in recommendBranches) {
			if (!(prevId in patches)) {
				patches[prevId] = Object.assign({}, recommendBranches[prevId]);
			}
			patches[prevId].nextId = recommendBranches[id].nextId;
		}
		const nextId = recommendBranches[id].nextId;
		if (nextId in recommendBranches) {
			if (!(nextId in patches)) {
				patches[nextId] = Object.assign({}, recommendBranches[nextId]);
			}
			patches[nextId].prevId = recommendBranches[id].prevId;
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


