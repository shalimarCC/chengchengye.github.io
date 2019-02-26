<template>
    <div>
       <!-- web商城模板预览 -->
       <div class="shopView" v-if="this.templateData.clientType == 4">
            <div class="view-pcbanner">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="img in AllbannerLists[0]"><img :src="img.imgUrl"></swiper-slide>
                </swiper>
                <div class="swiper-pagination"></div>
            </div>
            <div class="view-goodlists" v-for="imgCards in AllimgCards">
                <div id="img_card" :style="'margin-top:'+instMargin+'px'" v-if="show">
                    <div class="margin">
                        <ul class="clearfix">
                            <li v-for="info in imgCards">
                                <div class="column-title">
                                    <h3>{{info.iconName}}</h3>
                                    <p>{{info.summary}}</p>
                                </div>
                                <div class="column-img"><img :src="info.imgUrl"></div>
                                <span class="column-btn">去看看</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="view-goodlists" v-for="iconObj in AlliconObjs">
                <div id="icon_logo" :style="'margin-top:20px;'" v-if="show">
                    <div class="margin clearfix">
                        <div id="main_l">
                            <img :src="iconObj[0].imagetextUrl" />
                        </div>
                        <div id="main_r">
                            <ul class="clearfix">
                                <li v-for="(info,key) in iconObj" v-if="key!=0">
                                    <img :src="info.imagetextUrl" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="view-goodlists" v-for="bannerGoodsObj in AllbannerGoodsObjs">
                <div id="banner_goods" v-if="show" :style="'margin-top:'+instMargin+'px'">
                    <div class="margin clearfix">
                        <div class="title" :style="'background-color:'+bannerGoodsObj.suList.titleColor" @click="goodsMore(bannerGoodsObj.suList.sucId)">
                            <h5>{{bannerGoodsObj.suList.titleName}}</h5>
                        </div>
                        <div class="main clearfix">
                            <div class="main_l">
                                <div class="banner">
                                    <swiper :options="swiperOptiongoods">
                                        <swiper-slide v-for="info in bannerGoodsObj.imagetextBanner.imagetextList"><img :src="info.imagetextUrl"></swiper-slide>
                                    </swiper>
                                    <div id="pagegoods">
                                        <div class="swiper-pagination2 clearfix"></div>
                                    </div>
                                </div>

                                <div class="main_l_goods clearfix">
                                    <div class="main_l_goods_card main_l_goods_card_l">
                                        <img :src="bannerGoodsObj.imagetext.imagetextList[0].imagetextUrl"/>
                                    </div>
                                    <div class="main_l_goods_card main_l_goods_card_r">
                                        <img :src="bannerGoodsObj.imagetext.imagetextList[1].imagetextUrl"/>
                                    </div>
                                </div>
                            </div>
                            <div class="main_r">
                                <ul class="clearfix">
                                    <li v-for="info in bannerGoodsObj.suList.goodsList">
                                        <img :src="info.suImgUrl" />
                                        <h6>{{info.suName}}</h6>
                                        <p>
                                            <span>{{info.salePrice.toFixed(2)}}积分</span>
                                            <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="view-goodlists" v-for="imgGoodsObj in AllimgGoodsObjs">
                <div id="banner_goods2" :style="'margin-top:'+instMargin+'px'" v-if="show">
                    <div class="margin clearfix">
                        <div class="title" :style="'background-color:'+imgGoodsObj.suList.titleColor"  @click="goodsMore(imgGoodsObj.suList.sucId)">
                            <h5>{{imgGoodsObj.suList.titleName}}</h5>
                        </div>
                        <div class="main clearfix">
                            <div class="main_l">
                                <div class="main_l_goods_card main_l_goods_card_l">
                                    <img :src="imgGoodsObj.imagetext.imagetextList[0].imagetextUrl" @click="linkSkip(imgGoodsObj.imagetext.imagetextList[0])" />
                                </div>
                                <div class="main_l_goods_card main_l_goods_card_r">
                                    <img :src="imgGoodsObj.imagetext.imagetextList[1].imagetextUrl" @click="linkSkip(imgGoodsObj.imagetext.imagetextList[1])" />
                                </div>
                            </div>
                            <div class="main_r">
                                <ul class="clearfix">
                                    <li v-for="info in imgGoodsObj.suList.goodsList" @click="goodsSkip(info)">
                                        <img :src="info.suImgUrl" />
                                        <h6>{{info.suName}}</h6>
                                        <p>
                                            <span>{{info.salePrice.toFixed(2)}}积分</span>
                                            <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="view-goodlists" v-for="goodLists in AllgoodLists1">
              <div id="goods_list" v-if="show" >
                <div class="margin clearfix">
                    <div class="ftit">
                        <h3>{{goodLists.titleName}}</h3>
                    </div>
                    <ul class="clearfix">
                        <li v-for="info in goodLists.goodsList">
                            <img :src="info.suImgUrl" />
                            <h6>{{info.suName}}</h6>
                            <p>
                                <span>{{info.salePrice.toFixed(2)}}积分</span>
                                <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                            </p>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
            <div class="view-goodlists" v-for="goodLists2 in AllgoodLists2">
                <div id="goods_list2" v-if="show">
                    <div class="margin clearfix">
                        <div class="title">
                            <h3>{{goodLists2.titleName}}</h3>
                        </div>
                        <ul class="clearfix">
                            <li v-for="info in goodLists2.goodsList">
                                <img :src="info.suImgUrl" />
                                <p>
                                    <span>{{info.salePrice.toFixed(2)}}积分</span>
                                    <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                                </p>
                                <h6>{{info.suName}}</h6>
                                <div class="btn" @click="goodsSkip(info)">
                                    查看详情
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="view-goodlists" v-for="goodLists3 in AllgoodLists3">
                <div id="goods_list3" :style="'margin-top:'+instMargin+'px'" v-if="show">
                    <div class="margin clearfix">
                        <div class="title">
                            <h3>{{goodLists3.titleName}}</h3>
                            <div class="swiper-pagination3 clearfix"></div>
                        </div>
                        <div  class="banner">
                            <swiper :options="swiperOption3">
                                <swiper-slide v-for="info in goodLists3.goodsList">
                                    <div class="bd">
                                        <img :src="info.suImgUrl" />
                                        <p>
                                            <span>{{info.salePrice.toFixed(2)}}积分</span>
                                            <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                                        </p>
                                        <h6>{{info.suName}}</h6>
                                        <div class="btn">查看详情</div>
                                    </div>
                                </swiper-slide>
                            </swiper>
                            <div class="swiper-button-prev swiper_btn"></div>
                            <div class="swiper-button-next swiper_btn"></div>
                        </div>

                    </div>
                </div>
            </div>
       </div>

       <!-- 微信商城模板预览 -->
       <div class="shopView-wap" v-if="this.templateData.clientType == 2">
            <div id="banner-wap" v-if="show">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="img in bannerList"><img :src="img.imgUrl"></swiper-slide>
                </swiper>
                <div class="swiper-pagination"></div>
            </div>
            <div id="viewWapLabel" v-if="show" v-for="MlabelObj in AllMlabelObj" :style="'margin-top:'+instMargin+'px'">
                <div class="label" v-if="show">
                    <ul>
                        <li v-for="info in MlabelObj.lableList">
                            <img :src="MlabelObj.imgUrl" />
                            <span>{{info.labelName}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapGoods1" v-if="show" v-for="MgoodList1 in AllMgoodList1" :style="'margin-top:'+instMargin+'px'">
                <div class="goods1">
                    <div class="title">
                        <h3><b></b>{{MgoodList1.titleName}}<b></b></h3>
                        <span v-if="MgoodList1.showType==101 || MgoodList1.showType==102">更多<i class="iconfont icon-more"></i></span>

                    </div>
                    <div class="goods_banner" v-if="MgoodList1.banner">
                        <img v-if="MgoodList1.banner && MgoodList1.banner.imgUrl" :src="MgoodList1.banner.imgUrl" alt="">
                        <!-- <img src="../../../../static/img/goods_error.png" v-else alt=""> -->
                    </div>
                    <div class="goodslist" v-if="MgoodList1.goodsList && MgoodList1.goodsList.length>0">
                        <ul class="clear">
                            <li v-for="info in MgoodList1.goodsList">
                                <img v-if="info.suImgUrl" :src="info.suImgUrl"/>
                                <!-- <img src="../../../../static/img/goods_error.png" style="border:1px solid #fff" v-else alt=""> -->
                                <h6>{{info.suName}}</h6>
                                <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                                <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="wapicons" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="miconObj in AllmiconObj">
                <div class="title">
                    <h3><b></b>{{miconObj.titleName}}<b></b></h3>
                </div>
                <ul>
                    <li v-for="info in miconObj.iconList">
                        <img v-if="info.imgUrl" :src="info.imgUrl" />
                        <p>{{info.iconName}}</p>
                    </li>
                </ul>
            </div>
            <div id="wapGoods2" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="mgoodList2 in AllmgoodList2">
                <div class="title">
                    <h3><b></b>{{mgoodList2.titleName}}<b></b></h3>
                    <span v-if="mgoodList2.showType==105 || mgoodList2.showType==106">更多<i class="iconfont icon-more"></i></span>
                </div>
                <div class="goods_banner" v-if="mgoodList2.banner && mgoodList2.banner.imgUrl">
                    <img v-if="mgoodList2.banner && mgoodList2.banner.imgUrl" :src="mgoodList2.banner.imgUrl" alt="">
                    <!-- <img src="../../../../static/img/goods_error.png" v-else alt=""> -->
                </div>

                <div class="goodslist" v-if="mgoodList2.goodsList">
                    <ul>
                        <li v-for="info in mgoodList2.goodsList">
                            <img v-if="info.suImgUrl" :src="info.suImgUrl"/>
                            <!-- <img src="../../../../static/img/goods_error.png" style="border:1px solid #fff" v-else alt=""> -->
                            <h6>{{info.suName}}</h6>
                            <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                            <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapGoods2" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="mgoodList3 in AllmgoodList3">
                <div class="title">
                    <h3><b></b>{{mgoodList3.titleName}}<b></b></h3>
                    <span v-if="mgoodList3.showType==109 || mgoodList3.showType==110">更多<i class="iconfont icon-more"></i></span>
                </div>
                <div class="goods_banner" v-if="mgoodList3.banner && mgoodList3.banner.imgUrl">
                    <img v-if="mgoodList3.banner && mgoodList3.banner.imgUrl" :src="mgoodList3.banner.imgUrl" alt="">
                    <!-- <img src="../../../../static/img/goods_error.png" v-else alt=""> -->
                </div>
                <div class="goodslist" v-if="mgoodList3.goodsList">
                    <ul>
                        <li v-for="info in mgoodList3.goodsList">
                            <img :src="info.suImgUrl"  v-if="info.suImgUrl!=''" />
                            <!-- <img src="../../../../static/img/goods_error.png" style="border:1px solid #fff" v-else alt=""> -->
                            <h6>{{info.suName}}</h6>
                            <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                            <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapGoods2" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="mgoodList4 in AllmgoodList4">
                <div class="title">
                    <h3><b></b>{{mgoodList4.titleName}}<b></b></h3>
                </div>
                <div class="goods_banner" v-if="mgoodList4.banner && mgoodList4.banner.imgUrl">
                    <img v-if="mgoodList4.banner && mgoodList4.banner.imgUrl" :src="mgoodList4.banner.imgUrl" alt="">
                    <!-- <img v-else src="../../../../static/img/goods_error.png" alt=""> -->
                </div>
                <div class="goodslist" v-if="mgoodList4.goodsList">
                    <ul class="clear">
                        <li v-for="info in mgoodList4.goodsList">
                            <img v-if="info.suImgUrl" :src="info.suImgUrl"/>
                            <!-- <img  v-else src="../../../../static/img/goods_error.png" style="border:1px solid #fff" alt=""> -->
                            <div class="goods_font">
                                <h6>{{info.suName}}</h6>
                                <div>
                                    <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                                    <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                                </div>
                            </div>

                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapimgtext" class="imgtext" :style="'padding-top:'+instMargin+'px'" v-if="show" v-for="mimgtextObj in AllimgtextObj">
                <div class="title">
                    <h3><b></b>{{mimgtextObj.groupTitle}}<b></b></h3>
                </div>
                <div class="imgtext1">
                    <img :src="mimgtextUrlTop.imagetextUrl" alt="">
                </div>
                <div class="imgtext2">
                    <div class="imgtext2_l">
                        <img :src="mimgtextUrlTop.imagetextUrl" alt="">
                    </div>
                    <div class="imgtext2_r">
                        <img :src="imgtextmain.imagetextUrl" v-for="imgtextmain in mimgtextUrlMain" alt="">
                    </div>
                </div>
            </div>
       </div>

       <!-- APP商城预览 -->
       <div class="shopView-wap" v-if="this.templateData.clientType == 1">
            <div id="banner-wap" v-if="show">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="img in bannerList"><img :src="img.imgUrl"></swiper-slide>
                </swiper>
                <div class="swiper-pagination"></div>
            </div>
            <div id="viewWapLabel" v-if="show" v-for="MlabelObj in AllMlabelObj" :style="'margin-top:'+instMargin+'px'">
                <div class="label" v-if="show">
                    <ul>
                        <li v-for="info in MlabelObj.lableList">
                            <img :src="MlabelObj.imgUrl" />
                            <span>{{info.labelName}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapGoods1" v-if="show" v-for="MgoodList1 in AllMgoodList1" :style="'margin-top:'+instMargin+'px'">
                <div class="goods1">
                    <div class="title">
                        <h3><b></b>{{MgoodList1.titleName}}<b></b></h3>
                        <span v-if="MgoodList1.showType==101 || MgoodList1.showType==102">更多<i class="iconfont icon-more"></i></span>

                    </div>
                    <div class="goods_banner" v-if="MgoodList1.banner">
                        <img v-if="MgoodList1.banner && MgoodList1.banner.imgUrl" :src="MgoodList1.banner.imgUrl" alt="">
                        <!-- <img src="../../../../static/img/goods_error.png" v-else alt=""> -->
                    </div>
                    <div class="goodslist" v-if="MgoodList1.goodsList && MgoodList1.goodsList.length>0">
                        <ul class="clear">
                            <li v-for="info in MgoodList1.goodsList">
                                <img v-if="info.suImgUrl" :src="info.suImgUrl"/>
                                <!-- <img src="../../../../static/img/goods_error.png" style="border:1px solid #fff" v-else alt=""> -->
                                <h6>{{info.suName}}</h6>
                                <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                                <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="wapicons" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="miconObj in AllmiconObj">
                <div class="title">
                    <h3><b></b>{{miconObj.titleName}}<b></b></h3>
                </div>
                <ul>
                    <li v-for="info in miconObj.iconList">
                        <img v-if="info.imgUrl" :src="info.imgUrl" />
                        <p>{{info.iconName}}</p>
                    </li>
                </ul>
            </div>
            <div id="wapGoods2" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="mgoodList2 in AllmgoodList2">
                <div class="title">
                    <h3><b></b>{{mgoodList2.titleName}}<b></b></h3>
                    <span v-if="mgoodList2.showType==105 || mgoodList2.showType==106">更多<i class="iconfont icon-more"></i></span>
                </div>
                <div class="goods_banner" v-if="mgoodList2.banner && mgoodList2.banner.imgUrl">
                    <img v-if="mgoodList2.banner && mgoodList2.banner.imgUrl" :src="mgoodList2.banner.imgUrl" alt="">
                    <!-- <img src="../../../../static/img/goods_error.png" v-else alt=""> -->
                </div>

                <div class="goodslist" v-if="mgoodList2.goodsList">
                    <ul>
                        <li v-for="info in mgoodList2.goodsList">
                            <img v-if="info.suImgUrl" :src="info.suImgUrl"/>
                            <!-- <img src="../../../../static/img/goods_error.png" style="border:1px solid #fff" v-else alt=""> -->
                            <h6>{{info.suName}}</h6>
                            <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                            <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapGoods2" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="mgoodList3 in AllmgoodList3">
                <div class="title">
                    <h3><b></b>{{mgoodList3.titleName}}<b></b></h3>
                    <span v-if="mgoodList3.showType==109 || mgoodList3.showType==110">更多<i class="iconfont icon-more"></i></span>
                </div>
                <div class="goods_banner" v-if="mgoodList3.banner && mgoodList3.banner.imgUrl">
                    <img v-if="mgoodList3.banner && mgoodList3.banner.imgUrl" :src="mgoodList3.banner.imgUrl" alt="">
                    <!-- <img src="../../../../static/img/goods_error.png" v-else alt=""> -->
                </div>
                <div class="goodslist" v-if="mgoodList3.goodsList">
                    <ul>
                        <li v-for="info in mgoodList3.goodsList">
                            <img :src="info.suImgUrl"  v-if="info.suImgUrl!=''" />
                            <!-- <img src="../../../../static/img/goods_error.png" style="border:1px solid #fff" v-else alt=""> -->
                            <h6>{{info.suName}}</h6>
                            <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                            <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapGoods2" :style="'margin-top:'+instMargin+'px'" v-if="show" v-for="mgoodList4 in AllmgoodList4">
                <div class="title">
                    <h3><b></b>{{mgoodList4.titleName}}<b></b></h3>
                </div>
                <div class="goods_banner" v-if="mgoodList4.banner && mgoodList4.banner.imgUrl">
                    <img v-if="mgoodList4.banner && mgoodList4.banner.imgUrl" :src="mgoodList4.banner.imgUrl" alt="">
                    <!-- <img v-else src="../../../../static/img/goods_error.png" alt=""> -->
                </div>
                <div class="goodslist" v-if="mgoodList4.goodsList">
                    <ul class="clear">
                        <li v-for="info in mgoodList4.goodsList">
                            <img v-if="info.suImgUrl" :src="info.suImgUrl"/>
                            <!-- <img  v-else src="../../../../static/img/goods_error.png" style="border:1px solid #fff" alt=""> -->
                            <div class="goods_font">
                                <h6>{{info.suName}}</h6>
                                <div>
                                    <p>积分价:{{info.salePrice.toFixed(2)}}</p>
                                    <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                                </div>
                            </div>

                        </li>
                    </ul>
                </div>
            </div>
            <div id="wapimgtext" class="imgtext" :style="'padding-top:'+instMargin+'px'" v-if="show" v-for="mimgtextObj in AllimgtextObj">
                <div class="title">
                    <h3><b></b>{{mimgtextObj.groupTitle}}<b></b></h3>
                </div>
                <div class="imgtext1">
                    <img :src="mimgtextUrlTop.imagetextUrl" alt="">
                </div>
                <div class="imgtext2">
                    <div class="imgtext2_l">
                        <img :src="mimgtextUrlTop.imagetextUrl" alt="">
                    </div>
                    <div class="imgtext2_r">
                        <img :src="imgtextmain.imagetextUrl" v-for="imgtextmain in mimgtextUrlMain" alt="">
                    </div>
                </div>
            </div>
       </div>
    </div>
</template>

<script>
    var moment = require('moment');
    moment().format();
    import 'swiper/dist/css/swiper.css';
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    import {templateDetail,queryBannerList,eleAndInstDetail,instContent,templateInstContent} from '../../../api/getData';
    import '../../../../static/css/shopView.css'
    import '../../../../static/css/shopViewWap.css'
    export default{
        data(){
            return {
                templateData:{},
                templateShow:{},
                listLoading: true,
                elementDiffer:[],
                bannerForm:{
                    pageNo:1,
                    pageSize:10,
                    name:'',
                    companyName:'',
                    linkType:''
                },
                show:false,
                bannerList:{},
                goodLists:{},
                goodLists2:{},
                iconObj:{},
                imgCards:{},
                bannerGoodsObj:{},
                imgGoodsObj:{},
                goodLists3:{},
                MlabelObj:{},
                MgoodList1:{},
                miconObj:{},
                mgoodList2:{},
                mgoodList3:{},
                mgoodList4:{},
                mimgtextObj:{},
                elementTypes:{},
                mimgtextObjList:[],
                AllimgtextObj:[],
                AllmgoodList4:[],
                AllmgoodList3:[],
                AllmgoodList2:[],
                AllMgoodList1:[],
                AllgoodLists3:[],
                AllbannerLists:[],
                AllgoodLists1:[],
                AllgoodLists2:[],
                AllimgCards:[],
                AlliconObjs:[],
                AllbannerGoodsObjs:[],
                AllimgGoodsObjs:[],
                AllMlabelObj:[],
                AllmiconObj:[],
                mimgtextUrlTop:[],
                mimgtextUrlMain:[],
                instMargin:'',
                templateShowSid:[],
                templateInsid:[],
                swiperOptiongoods:{
                    autoplay: true,
                    setWrapperSize :true,
                    pagination: {
                         el: '.swiper-pagination2',
                         type: 'custom',
                         renderCustom: function (swiper, current, total) {
                           var _html = '';
                            for ( var i = 1; i <= total; i++ ) {
                                if ( current == i ) {
                                _html += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
                                } else {
                                _html += '<span class="swiper-pagination-customs"></span>';
                                }
                                }
                            return _html;
                            }
                    },
                },
                swiperOption: {
                    autoplay: true,
                    setWrapperSize :true,
                    pagination: {
                         el: '.swiper-pagination',
                         type: 'custom',
                         renderCustom: function (swiper, current, total) {
                           var _html = '';
                            for ( var i = 1; i <= total; i++ ) {
                                if ( current == i ) {
                                _html += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
                                } else {
                                _html += '<span class="swiper-pagination-customs"></span>';
                                }
                                }
                            return _html;
                            }
                    },
                },
                swiperOption3: {
                    notNextTick: true,
                    autoplay: false,
                    setWrapperSize :true,
                    paginationClickable :true,
                    paginationType: 'custom',
                    slidesPerView:6,
                    slidesPerGroup:6,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                         el: '.swiper-pagination3',
                         type: 'custom',
                         renderCustom: function (swiper, current, total) {
                           var _html = '';
                            for ( var i = 1; i <= total; i++ ) {
                                if ( current == i ) {
                                _html += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
                                } else {
                                _html += '<span class="swiper-pagination-customs"></span>';
                                }
                                }
                            return _html;
                            }
                    },
                }

            }
        },
        components:{
            "swiper":swiper,
            "swiperSlide":swiperSlide
        },
        created() {
          this.findShopTemplateDetail();
          this.templateInstContent();
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    let str = curVal.path;
                    str = str.substring(0,17)
                    if(str == "/shopTemplateView"){
                        this.AllimgCards=[];
                        this.AlliconObjs=[];
                        this.AllbannerGoodsObjs=[];
                        this.AllimgGoodsObjs=[];
                        this.AllMlabelObj=[];
                        this.AllmiconObj=[];
                        this.AllimgtextObj=[];
                        this.AllmgoodList4=[];
                        this.AllmgoodList3=[];
                        this.AllmgoodList2=[];
                        this.AllMgoodList1=[];
                        this.AllgoodLists3=[];
                        this.AllbannerLists=[];
                        this.AllgoodLists1=[];
                        this.AllgoodLists2=[];
                        this.findShopTemplateDetail();
                    }
                }
            }
        },
        methods:{
            //预览商城模板
            async findShopTemplateDetail() {
                try {
                    this.listLoading = false;
                    const res = await templateDetail({templateId:this.$route.params.id});
                    if (res.data.code == 0) {
                        this.templateData = res.data.data.template;
                        this.templateShow = this.templateData.elementList;
                        for(var i=0;i<this.templateShow.length;i++){
                            this.templateShowSid = this.templateShow[i].elementId;
                            this.templateInsid = this.templateShow[i].instId
                            this.instContent(this.templateShowSid,this.templateInsid);
                        }
                    } else {
                       this.$message({
                          type: 'error',
                          message: res.data.error
                      });
                    }
                } catch (err) {
                    this.$message({
                          type: 'error',
                          message: '呵呵哒，404了呢~'
                      });
                }
            },
            //预览
            async instContent(eleId,insId) {
                try {
                    const res = await instContent({elementId:eleId,instId:insId});
                    if (res.data.code == 0) {
                        this.elementTypes = res.data.data;

                        console.log(this.elementTypes);
                        if(res.data.data.elementType == 1 || res.data.data.elementType == 0){
                            this.bannerList = res.data.data.inst.bannerList;
                            this.AllbannerLists.push(this.bannerList);
                        }
                        if(res.data.data.elementType == 114){
                            this.show=true;
                            this.goodLists = res.data.data.inst.suList;
                            this.AllgoodLists1.push(this.goodLists);
                        }
                        if(res.data.data.elementType == 115){
                            this.show=true;
                            this.instMargin= res.data.data.instMargin;
                            this.goodLists2 = res.data.data.inst.suList;
                            this.AllgoodLists2.push(this.goodLists2);
                        }
                        if(res.data.data.elementType == 203){
                            this.show=true;
                            this.imgCards = res.data.data.inst.iconGroup.iconList;
                            this.AllimgCards.push(this.imgCards);
                        }
                        if(res.data.data.elementType == 304){
                            this.show=true;
                            this.iconObj = res.data.data.inst.imagetext.imagetextList;
                            this.AlliconObjs.push(this.iconObj);
                        }
                        if(res.data.data.elementType == 601){
                            this.show=true;
                            this.bannerGoodsObj = res.data.data.inst;
                            this.AllbannerGoodsObjs.push(this.bannerGoodsObj);
                        }
                        if(res.data.data.elementType == 501){
                            this.show=true;
                            this.imgGoodsObj = res.data.data.inst;
                            this.AllimgGoodsObjs.push(this.imgGoodsObj);
                        }
                        if(res.data.data.elementType == 116){
                            this.show=true;
                            this.goodLists3 = res.data.data.inst.suList;
                            this.AllgoodLists3.push(this.goodLists3);
                        }
                        if(res.data.data.elementType == 401 || res.data.data.elementType == 400){
                            this.show=true;
                            this.MlabelObj = res.data.data.inst.labelGroup;
                            this.AllMlabelObj.push(this.MlabelObj);
                        }
                        if(res.data.data.elementType == 101 || res.data.data.elementType == 102 || res.data.data.elementType == 103){
                            this.show=true;
                            this.MgoodList1 = res.data.data.inst.suList;
                            this.AllMgoodList1.push(this.MgoodList1);
                        }
                        if(res.data.data.elementType == 200 || res.data.data.elementType == 201){
                            this.show=true;
                            this.miconObj = res.data.data.inst.iconGroup;
                            this.AllmiconObj.push(this.miconObj);
                        }
                        if(res.data.data.elementType == 104 || res.data.data.elementType == 105 || res.data.data.elementType == 106 ||res.data.data.elementType== 107){
                            this.show=true;
                            this.mgoodList2 = res.data.data.inst.suList;
                            this.AllmgoodList2.push(this.mgoodList2);
                        }
                        if(res.data.data.elementType == 108 || res.data.data.elementType == 109 || res.data.data.elementType == 110 ||res.data.data.elementType== 111){
                            this.show=true;
                            this.mgoodList3 = res.data.data.inst.suList;
                            this.AllmgoodList3.push(this.mgoodList3);
                        }
                        if(res.data.data.elementType == 112 || res.data.data.elementType == 113){
                            this.show=true;
                            this.mgoodList4 = res.data.data.inst.suList;
                            this.AllmgoodList4.push(this.mgoodList4);
                        }
                        if(res.data.data.elementType == 301 || res.data.data.elementType == 302 || res.data.data.elementType == 303 || res.data.data.elementType == 304){
                            this.mimgtextObj = res.data.data.inst.imagetext;
                            this.mimgtextObjList = res.data.data.inst.imagetext.imagetextList;
                            this.mimgtextUrlTop = this.mimgtextObjList[0];
                            this.mimgtextUrlMain = this.mimgtextObjList.slice(1);
                            this.show=true;
                            this.AllimgtextObj.push(this.mimgtextObj);
                            console.log(this.mimgtextUrlTop);
                            console.log(this.mimgtextUrlMain);
                        }
                    } else {
                        this.$message({
                          type: 'error',
                          message: '呵呵哒，404~'
                      });
                    }
                } catch (err) {
                     this.$message({
                          type: 'error',
                          message: '呵呵哒，404呢~'
                      });

                }
            },
            //预览
            async templateInstContent(){
                try{
                   const res = await templateInstContent({clientType:4,type:0});
                   if(res.data.code ==0){
                       console.log(res.data.data);
                   }else{
                       console.log("error")
                   }
                }catch (err) {
                    this.$message({
                          type: 'error',
                          message: '呵呵哒，404了呢~'
                      });
                }
            }
		}
    }
</script>

<style scoped>
.view-goodlists{
    min-width:1212px;
    width:100%;
    height:auto;
    margin:0 auto;
}
#goods_list{
    width:100%;
    height:auto;
    overflow:hidden;
}
#goods_list .ftit{
    width: 1210px;
    height: 35px;
    margin: 0 auto;
    background: url(../../../../static/img/dian-ico.png) repeat-x 0 18px;
    text-align: center;
    font-size: 21px;
    line-height: 33px;
}
#goods_list .ftit h3{
    display: inline;
    padding: 0 50px;
    background-color: #fff;
    font-weight: 400;
    font-size: 21px;
    color: #555;
}
#goods_list ul{
    width: calc(100% + 10px);
    width: 1210px;
    margin:25px auto 0 auto;
}
#goods_list ul li{
    float: left;
    width: 210px;
    margin: 0 10px 10px 0;
    border: 1px solid #D2D2D2;
    padding: 10px;
}
#goods_list ul li img{
    width:100%;
    height:210px;
}
#goods_list ul li h6{
    font-size:14px;
    font-weight:100;
    color:#323232;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
}
#goods_list ul li p{
    margin-top:10px;
}
#goods_list ul li p span{
    color:#ff8546;
    font-size:14px;
}
#goods_list ul li p del{
    color:#646464;
    font-size:12px;
}
#goods_list ul li:hover{
    border: 1px solid #ff8546;
}
#goods_list ul li:hover h6{
    color:#ff8546;
}

</style>

<style>
.shopView{
      min-width:1200px;
      width:auto;
      height:auto;
      margin:0 auto;
  }
.shopView img,.shopView-wap img{
      display:block;
      margin:0 auto;
      border:0;
      padding:0;
  }
.view-pcbanner{
    position: relative;
    min-width:1028px;
    width:100%;
    height:500px;
    margin:0 auto;
}
.view-pcbanner .swiper-container{
    width:100%;
}
.view-pcbanner .swiper-pagination{
    bottom:24px;
    left:50%;
    margin-left:-50px;
    display: block;
    position: absolute;
    -webkit-transition: 300ms;
    -moz-transition: 300ms;
    -o-transition: 300ms;
    transition: 300ms;
    -webkit-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    z-index: 10;
    background-color:hsla(0,0%,100%,.3);
    border-radius:10px;
    width: auto;
    padding:0 6px;
}
.swiper-pagination-customs{
        width:10px;
        height:10px;
        border-radius: 100%;
        background-color:rgba(255,255,255,.4);
        margin:0 6px;
        display: block;
        float: left;

}
.swiper-pagination-customs-active{
    background-color:rgba(255,255,255,1);
}

</style>
