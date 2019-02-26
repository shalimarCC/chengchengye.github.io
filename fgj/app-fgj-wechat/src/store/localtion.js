
let localtion = {
  state: {
    STORAGE_COOKIE : 'userId'
  },
  mutations: {
        fetch(store){
            return JSON.parse(window.sessionStorage.getItem(store) || '[]')
		},
		save(items,store){

			window.sessionStorage.setItem(store,JSON.stringify(items))
		},
		delete(store){
            window.sessionStorage.removeItem(store)
        },
        setCookie(c_name,value,expiredays){
            var exdate=new Date()
            exdate.setDate(exdate.getDate()+expiredays)
            document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
        },
        getCookie(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
            else
            return 1;
        }

  }
};

export default localtion;