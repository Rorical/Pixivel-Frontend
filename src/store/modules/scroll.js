
const state = {
    top: 0,
}

const mutations = {
    setTop(state, top) {
        state.top = top;
    },
}

export default {
    namespaced: true,
    state,
    mutations
}