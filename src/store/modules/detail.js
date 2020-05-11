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
			return (Object.assign({image:{},
				xsimgs: [],
				relatedpage:0,
				relateimgs:[]},JSON.parse(theImg)))
		}
		return {image:{},
				xsimgs: [],
				relatedpage:0,
				relateimgs:[]}
	}
}

export default {
    namespaced: true,
    state,
    mutations,
	getters
}