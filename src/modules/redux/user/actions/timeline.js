export const loadTimeline = id => ({
	type: 'LOAD_TIMELINE_REQUEST',
	id,
});

export const clearTimeline = () => ({
	type: 'CLEAR_TIMELINE',
});

