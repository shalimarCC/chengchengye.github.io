import Vue from 'vue';
import Vuex from 'vuex';

import Cookie from './modules/localtion';

Vue.use(Vuex);

let store = new Vuex.Store({
	state : {

		Cookie,
		tabList: [
				{
					name:'首页',
					path:'/readme'
				}
		],
		activeTab:'/readme',
	},
	mutations: {
    addleTabList (state,obj) {
			state.tabList.push(obj)
    },
		deteleTabList (state,obj) {
			state.tabList.push(obj)
    },
		editActiveTab (state,str) {
			state.activeTab = str;
		},
		editTabList (state,tabs) {
			state.tabList = tabs;
		},
  },
	actions: {
    addleTabList (context,obj) {

      context.commit('addleTabList',obj)
    },
		deteleTabList (context,obj) {

      context.commit('deteleTabList',obj)
    },
		editActiveTab (context,str) {

			context.commit('editActiveTab',str)
		},
		editTabList (context,tabs) {

			context.commit('editTabList',tabs)
		}
  }


})

export default store
