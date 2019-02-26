let localtion = {
  state: {
    STORAGE_COOKIE : 'todos-vuejs'
  },
  mutations: {
    fetch(context){

			return JSON.parse(window.sessionStorage.getItem(
				localtion.state.STORAGE_COOKIE) || '[]')
		},
		save(items){

			window.sessionStorage.setItem(localtion.state.STORAGE_COOKIE,JSON.stringify(
				items))
		}
  }
};

export default localtion;