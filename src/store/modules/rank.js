Date.prototype.format = function(fmt)
	{ 
		var o = {
			"M+" : this.getMonth()+1,
			"d+" : this.getDate(),
			"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12,
			"H+" : this.getHours(),
			"m+" : this.getMinutes(),
			"s+" : this.getSeconds(),
			"q+" : Math.floor((this.getMonth()+3)/3),
			"S" : this.getMilliseconds()
		};
		if(/(y+)/.test(fmt))
			fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("("+ k +")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		return fmt;
	}
const state = {
    rankimg: [],
    page: 0,
    mode: "day",
	modedesc: "日榜",
    date: (new Date((new Date())-129600000).format("yyyy-MM-dd"))
}

const mutations = {
    setImages (state, images) {
        state.rankimg = images;
    },
    setPage (state, page) {
        state.page = page;
    },
    setMode (state, mode) {
        state.mode = mode.mode;
		state.modedesc = mode.modedesc;
    },
    setDate (state, date) {
        state.date = date;
    }
}

export default {
    namespaced: true,
    state,
    mutations
}