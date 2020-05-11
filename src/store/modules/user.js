const state = {
	image:{},
	scroll:{}
}

const mutations = {
	setImage(state, obj) {
		if(!state.image[obj['id']]){
			state.image[obj['id']] = {}
		}
		state.image[obj['id']][obj['key']] = obj['value'];
	},
	setScroll(state, obj){
		state.scroll[obj.id] = obj.top
	}
}

const getters = {
	findById:(state) => (id) => {
		let theImg = JSON.stringify(state.image[id])
		if(theImg){
			return (Object.assign({model: {},
				xsimgs:[],
				"radio/iorb":"i",
				imgs:[],
				bookmarks:[],
				page:0,
				bpage:0},JSON.parse(theImg)))
		}
		return {model: {},
				xsimgs:[],
				"radio/iorb":"i",
				imgs:[],
				bookmarks:[],
				page:0,
				bpage:0}
	}
}

export default {
    namespaced: true,
    state,
    mutations,
	getters
}