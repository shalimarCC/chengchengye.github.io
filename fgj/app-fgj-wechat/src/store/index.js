import Vue from 'vue';
import Vuex from 'vuex';
import Cookie from './localtion';


Vue.use(Vuex);

let store = new Vuex.Store({
	state : {
        skuObj:{},
        selected:'',
        cartNum:'',
        Cookie,
        siteId:0,
        invoiceId:0,
        invoiceType:'',
        invoiceForm:'',
        cardTitle:'',
        goodsType:1,
        shopCartNum:0,
        checkActivity:[],
        checkMemorial:[],
        commonInvoiceId: '',
        titleContent: '',
        taxpayerIdentificationCode: '',
        invoiceTitleType: '',
        contentType: '',
        changeMode:'',
        iscoupon:'',
        feedback:'',
        couponId: '',
        skuId:'',
        useCouponId:'',
        invoiceIds: [],
        searchName:'',
        fromCoupon:'',
        isShowEffectTimeRange:'',
        orderInfo:{}
    },

	mutations: {
        setSkuObj (state,obj) {
            state.skuObj = obj;
        },
        setSelected (state,str) {
            state.selected = str;
        },
        setCartNum (state,num) {
            state.cartNum = num;
        },
        setSiteId (state,num) {
            state.siteId = num;
        },
        setInvoiceId (state,num) {
            state.invoiceId = num;
        },

        setInvoiceType (state,num) {
            state.invoiceType = num;
        },
        setInvoiceForm(state, num) {
            state.invoiceForm = num;
        },
        setInvoiceDetail(state, num) {
            state.invoiceDetail = num;
        },
        setCardTitle (state,num) {
            state.cardTitle = num;
        },
        setGoodsType (state,num) {
            state.goodsType = num;
        },
        setShopCartNum (state,num) {
            state.shopCartNum = num;
        },
        setCheckActivity (state,num) {
            state.checkActivity = num;
        },
        setCheckMemorial (state,num) {
            state.checkMemorial = num;
        },
        setCommonInvoiceId(state, num) {
            state.commonInvoiceId = num;
        },
        setTitleContent(state, num) {
            state.titleContent = num;
        },
        setTaxpayerIdentificationCode(state, num) {
            state.taxpayerIdentificationCode = num;
        },
        setInvoiceTitleType(state, num) {
            state.invoiceTitleType = num;
        },
        setContentType(state, num) {
            state.contentType = num;
        },
        setChangeMode(state,num){
            state.changeMode = num;
        },
        setIscoupon(state,num){
            state.iscoupon= num;
        },
        setFeedback(state,num){
            state.feedback = num;
        },
        setCouponId(state, num) {
            state.couponId = num;
        },
        setUseCouponId(state, num) {
            state.useCouponId = num;
        },
        setSkuId(state,num){
            state.skuId = num;
        },
        setInvoiceIds(state, num) {
            state.invoiceIds = num;
        },
        setSearchName(state, num) {
            state.searchName = num;
        },
        setFromCoupon(state, num) {
            state.fromcoupon = num;
        },
        setIsShowEffectTimeRange(state, num) {
            state.isShowEffectTimeRange = num;
        },
        setOrderInfo(state, num) {
            state.orderInfo = num;
        },


    },
	actions: {
        setSkuObj (context,obj) {
           context.commit('setSkuObj',obj)
        },
        setSelected (context,str) {
            context.commit('setSelected',str)
        },
        setCartNum (context,num) {
            context.commit('setCartNum',num)
        },
        setSiteId (context,num) {
            context.commit('setSiteId',num)
        },
        setInvoiceId (context,num) {
            context.commit('setInvoiceId',num)
        },
        setInvoiceType (context,num) {
            context.commit('setInvoiceType',num)
        },
        setInvoiceForm(context, num) {
            context.commit('setInvoiceForm', num)
        },
        setInvoiceDetail(context, num) {
          context.commit('setInvoiceDetail', num)
        },
        setCardTitle (context,num) {
            context.commit('setCardTitle',num)
        },
        setGoodsType (context,num) {
            context.commit('setGoodsType',num)
        },
        setShopCartNum (context,num) {
            context.commit('setShopCartNum',num)
        },
        setCheckActivity (context,num) {
            context.commit('setCheckActivity',num)
        },
        setCheckMemorial (context,num) {
            context.commit('setCheckMemorial',num)
        },
        setCommonInvoiceId(context, num) {
            context.commit('setCommonInvoiceId', num)
        },
        setTitleContent(context, num) {
            context.commit('setTitleContent', num)
        },
        setTaxpayerIdentificationCode(context, num) {
            context.commit('setTaxpayerIdentificationCode', num)
        },
        setInvoiceTitleType(context, num) {
            context.commit('setInvoiceTitleType', num)
        },
        setContentType(context, num) {
            context.commit('setContentType', num)
        },
        setChangeMode(context,num){
            context.commit('setChangeMode',num)
        },
        setIscoupon(context,num){
            context.commit('setIscoupon',num)
        },
        setFeedback(context,num){
            context.commit('setFeedback',num)
        },
        setCouponId(context, num) {
            context.commit('setCouponId', num)
        },
        setUseCouponId(context, num) {
            context.commit('setUseCouponId', num)
        },
        setSkuId(context,num){
            context.commit('setSkuId',num)
        },
        setInvoiceIds(context, num) {
            context.commit('setInvoiceIds', num)
        },
        setSearchName(context, num) {
            context.commit('setSearchName', num)
        },
        setFromCoupon(context, num) {
            context.commit('setFromCoupon', num)
        },
        setIsShowEffectTimeRange(context, num) {
            context.commit('setIsShowEffectTimeRange', num)
        },
        setOrderInfo(context, num) {
            context.commit('setOrderInfo', num)
        },
    }


})

export default store
