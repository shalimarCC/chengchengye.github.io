
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
		},
		delete(){

			window.sessionStorage.removeItem(localtion.state.STORAGE_COOKIE)
		}
  }
};

export default localtion;