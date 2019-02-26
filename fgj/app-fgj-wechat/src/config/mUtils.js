//IOS事件初始化
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

var ua = navigator.userAgent.toLowerCase();
let localtion = {
  state: {
    STORAGE_COOKIE : 'todos-vuejs'
  },
  mutations: {
    fetch(context){
      if (/iphone|ipad|ipod/.test(ua)) {
        let _promise = new Promise((reslove,reject) => {
          setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('sendUserCookieIdToJS' , '' , function responseCallback(responseData) {
              reslove(responseData);
            });
          })
        })
        // return Promise.race([timeOutPromise, _promise]);
      } else if (/android/.test(ua)) {
        let _promise = new Promise((reslove,reject) => {
          var data = JSON.parse(Android.JsCallUserToken())
          reslove(data);
        })
        // return Promise.race([timeOutPromise, _promise]);
      }
			return JSON.parse(window.sessionStorage.getItem(
				localtion.state.STORAGE_COOKIE) || '[]')
    },
    save(items){
        window.sessionStorage.setItem(localtion.state.STORAGE_COOKIE,JSON.stringify(items))
    },
    delete(){

        window.sessionStorage.removeItem(localtion.state.STORAGE_COOKIE)
    },
    setCookie(c_name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    },
    getCookie(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return 1;
    }
  }
};
export default localtion;
