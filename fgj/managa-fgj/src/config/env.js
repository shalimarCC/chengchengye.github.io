/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let routerMode = 'history';
let header = window.location.protocol;
//let baseImgPath = header + '//upload-z1.qiniu.com';
let baseImgPath = header + '//upload-z1.qiniup.com';
//let baseImgPath = 'image.51gouxiang.com';
let baseImgUrl = '';
let qrCodeUrl = '';

//baseUrl = 'http://192.168.0.111:2080';
// baseUrl = 'http://192.168.0.77';
baseUrl = 'http://192.168.0.57';
//  baseUrl = window.location.origin;

if (baseUrl == header + '//www.51fugj.com') {
    baseImgUrl = header + '//image.51fugj.com/'; //图片地址 正式环境
} else {
    baseImgUrl = header + '//image.51gouxiang.com/'; //图片地址  测试环境
}

//二维码域名配置
if (baseUrl == header + '//www.51fugj.com') {
    qrCodeUrl = 'https://www.51fugj.com/muu/#';
} else if(baseUrl == header + '//www.51fugj.net') {
    qrCodeUrl = 'http://www.51fugj.net/muu/#';
} else {
    qrCodeUrl = 'http://192.168.0.77/muu/#';
}
export {
    baseUrl,
    routerMode,
    baseImgPath,
    baseImgUrl,
    qrCodeUrl
}
