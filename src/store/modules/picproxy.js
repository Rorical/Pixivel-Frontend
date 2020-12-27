import CONFIG from '@/config.json'
import storage from 'good-storage'

var plist = {}
var pid = 1
for(var pName in CONFIG["IMAGE_PROXY_HOSTS"]){
	plist[pName] = pid
	plist[pid] = pName
	pid++
}

const state = {
	ProxyIdList : plist,
	ProxyMap:storage.get("proxyMap",{})
}

const mutations = {
	setProxy(state, payload) {
		var rand = Math.random()
		
		var proxyName = ''
		for(var pName in CONFIG["IMAGE_PROXY_HOSTS"]){
			var range = CONFIG["IMAGE_PROXY_HOSTS"][pName]
			if(rand > range[0] && rand < range[1]){
				proxyName = pName
				break
			}
		}
		
		state["ProxyMap"][payload.id] = state["ProxyIdList"][proxyName]
		
		if(Object.keys(state["ProxyMap"]).length > 30000){
			state["ProxyMap"] = {}
			storage.set("proxyMap",{})
		}
		storage.set("proxyMap",state["ProxyMap"])
	},
}

const getters = {
	getProxy:(state) => (id) => {
		var proxy = state["ProxyMap"][id]
		if(proxy){
			return state["ProxyIdList"][proxy]
		}else{
			return false
		}
	}
}

export default {
    namespaced: true,
    state,
    mutations,
	getters
}