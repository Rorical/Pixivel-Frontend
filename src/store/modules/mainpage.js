
const state = {
    rankimg: [],
	rankpics:[],
	tags:[]
}

const mutations = {
    setrankimg(state, rankimg) {
        state.rankimg = rankimg;
    },
	setrankpics(state, rankpics) {
	    state.rankpics = rankpics;
	},
	settags(state, tags) {
	    state.tags = tags;
	},
}

export default {
    namespaced: true,
    state,
    mutations
}