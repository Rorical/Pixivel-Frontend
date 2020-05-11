const state = {
	search:{},
	scroll:{}
}

const mutations = {
	setSearch(state, obj) {
		if(!state.search[obj['id']]){
			state.search[obj['id']] = {}
		}
		state.search[obj['id']][obj['key']] = obj['value'];
	},
	setScroll(state, obj){
		state.scroll[obj.id] = obj.top
	}
}

const getters = {
	findById:(state) => (id) => {
		let theImg = JSON.stringify(state.search[id])
		if(theImg){
			return (Object.assign({'images':[],
				'page': 0,
				'checkboxes/exact_match_for_tags': false,
				'checkboxes/date_asc': false
				},JSON.parse(theImg)))
		}
		return {'images':[],
				'page': 0,
				'checkboxes/exact_match_for_tags': false,
				'checkboxes/date_asc': false
				}
	}
}

export default {
    namespaced: true,
    state,
    mutations,
	getters
}