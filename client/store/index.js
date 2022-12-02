//引用Vuex
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

//实例store对象
const store = new Vuex.Store({
	state: {
		count: 6
	},
	mutations: {
		/*......*/
	}
})

//导出store对象
export default store
