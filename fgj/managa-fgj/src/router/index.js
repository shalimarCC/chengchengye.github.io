import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router);

export default new Router({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [{
            path: '/',
            redirect: '/login'

        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),

            children: [{
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve),
                    name: '首页',
                },
                {
                    path: '/productList',
                    component: resolve => require(['../components/page/product/productList.vue'], resolve),
                    name: '产品列表',
                },
                {
                    path: '/product/addProduct',
                    component: resolve => require(['../components/page/product/addProduct.vue'], resolve),
                    name: '新增产品',
                },
                {
                    path: '/product/editProduct/:productId',
                    component: resolve => require(['../components/page/product/editProduct.vue'], resolve),
                    name: '编辑产品',
                },
                {
                    path: '/product/seeProduct/:productId',
                    component: resolve => require(['../components/page/product/seeProduct.vue'], resolve),
                    name: '查看产品',
                },
                {
                    path: '/product/seeProduct2/:productId',
                    component: resolve => require(['../components/page/product/seeProduct2.vue'], resolve),
                    name: '查看产品',
                },
                {
                    path: '/product/auditProduct',
                    component: resolve => require(['../components/page/product/auditProduct.vue'], resolve),
                    name: '审核列表',
                },
                {
                    path: '/typeTreeList',
                    component: resolve => require(['../components/page/typeTree/typeTreeList.vue'], resolve),
                    name: '类目列表',
                },
                {
                    path: '/editTypeTree/:typeId',
                    component: resolve => require(['../components/page/typeTree/editTypeTree.vue'], resolve),
                    name: '编辑类目',
                },
                {
                    path: '/propertyList',
                    component: resolve => require(['../components/page/property/propertyList.vue'], resolve),
                    name: '属性列表',
                },
                {
                    path: '/property/addProperty',
                    component: resolve => require(['../components/page/property/addProperty.vue'], resolve),
                    name: '新增属性',
                },
                {
                    path: '/property/editProperty/:propertyId',
                    component: resolve => require(['../components/page/property/editProperty.vue'], resolve),
                    name: '编辑属性',
                },
                {
                    path: '/goodsList',
                    component: resolve => require(['../components/page/goods/goodsList.vue'], resolve),
                    name: '商品列表',
                },
                {
                    path: '/goods/addGoods',
                    component: resolve => require(['../components/page/goods/addGoods.vue'], resolve),
                    name: '新增商品',
                },
                {
                    path: '/goods/goodsTabs/:goodsId',
                    component: resolve => require(['../components/page/goods/goodsTabs.vue'], resolve),
                    name: '编辑商品',
                },
                {
                    path: '/goods/auditGoods',
                    component: resolve => require(['../components/page/goods/auditGoods.vue'], resolve),
                    name: '商品审核',
                },
                {
                    path: '/feedBackGoods',
                    component: resolve => require(['../components/page/goods/feedBackGoods.vue'], resolve),
                    name: '商品反馈',
                },
                {
                    path: '/skuList',
                    component: resolve => require(['../components/page/goods/skuList.vue'], resolve),
                    name: 'SKU列表',
                },
                {
                    path: '/labelList',
                    component: resolve => require(['../components/page/goods/labelList.vue'], resolve),
                    name: '标签管理',
                },
                {
                    path: '/goodsList/:id',
                    component: resolve => require(['../components/page/goods/relateGoodsList.vue'], resolve),
                    name: '关联列表',
                },
                {
                    path: '/freightTemplate',
                    component: resolve => require(['../components/page/goods/freightTemplate.vue'], resolve),
                    name: '运费模板',
                },
                {
                    path: '/topSearch',
                    component: resolve => require(['../components/page/goods/topSearch.vue'], resolve),
                    name: '热搜管理',
                },
                {
                    path: '/sellPlatform',
                    component: resolve => require(['../components/page/sellPlatform/sellPlatformList.vue'], resolve),
                    name: '比价平台管理',
                },

                {
                    path: '/repertory',
                    component: resolve => require(['../components/page/repertory/repertory.vue'], resolve),
                    name: '在线库存列表',
                },
                {
                    path: '/repertoryRecord',
                    component: resolve => require(['../components/page/repertory/repertoryRecord.vue'], resolve),
                    name: '在线库存流水',
                },
                {
                    path: '/couponList',
                    component: resolve => require(['../components/page/repertory/couponList.vue'], resolve),
                    name: 'Unit库存管理',
                },
                {
                    path: '/repertoryCombination',
                    component: resolve => require(['../components/page/repertory/repertoryCombination.vue'], resolve),
                    name: '库存关联管理',
                },
                {
                    path: '/editCombination/:mid/:id',
                    component: resolve => require(['../components/page/repertory/editCombination.vue'], resolve),
                    name: '关联商品',
                },
                {
                    path: '/couponUnit/:id',
                    component: resolve => require(['../components/page/repertory/couponUnit.vue'], resolve),
                    name: '卡券unit',
                },
                {
                    path: '/couponRecord',
                    component: resolve => require(['../components/page/repertory/couponRecord.vue'], resolve),
                    name: 'Unit流水批次',
                },
                {
                    path: '/couponRecordContent/:id',
                    component: resolve => require(['../components/page/repertory/couponRecordContent.vue'], resolve),
                    name: '批次详情',
                },
                {
                    path: '/orderList',
                    component: resolve => require(['../components/page/order/orderList.vue'], resolve),
                    name: '订单列表',
                },
                {
                    path: '/childrenOrder',
                    component: resolve => require(['../components/page/order/childrenOrder.vue'], resolve),
                    name: '子订单列表',
                },
                {
                    path: '/orderDetail/:orderId',
                    component: resolve => require(['../components/page/order/orderTab.vue'], resolve),
                    meta: { keepAlive: true },
                    name: '订单详情',
                },
                {
                    path: '/refundOrder',
                    component: resolve => require(['../components/page/order/refundOrder.vue'], resolve),
                    name: '退款订单',
                },
                {
                    path: '/refundUnit',
                    component: resolve => require(['../components/page/order/refundUnit.vue'], resolve),
                    name: '退款单管理',
                },
                {
                    path: '/bannerList',
                    component: resolve => require(['../components/page/banner/bannerList.vue'], resolve),
                    name: 'Banner',
                },
                {
                    path: '/couponDemo',
                    component: resolve => require(['../components/page/banner/couponDemo.vue'], resolve),
                    name: '卡券模板',
                },
                {
                    path: '/func',
                    component: resolve => require(['../components/page/banner/func.vue'], resolve),
                    name: '功能管理',
                },
                {
                    path: '/firmList',
                    component: resolve => require(['../components/page/firm/firmList.vue'], resolve),
                    name: '企业r列表',
                },
                {
                    path: '/section/:id',
                    component: resolve => require(['../components/page/firm/section.vue'], resolve),
                    name: '机构设置',
                },
                {
                    path: '/staffFirm',
                    component: resolve => require(['../components/page/staff/staffList.vue'], resolve),
                    name: '员工列表',
                },
                {
                    path: '/loginRecord',
                    component: resolve => require(['../components/page/staff/loginRecord.vue'], resolve),
                    name: '员工登录记录',
                },
                {
                    path: '/billList',
                    component: resolve => require(['../components/page/staff/billList.vue'], resolve),
                    name: '资产管理',
                },
                {
                    path: '/prepaidRecords',
                    component: resolve => require(['../components/page/staff/prepaidRecords.vue'], resolve),
                    name: '充值记录',
                },
                {
                    path: '/staffFlowList/:id',
                    component: resolve => require(['../components/page/staff/staffFlowList.vue'], resolve),
                    name: '查看流水',
                },
                {
                    path: '/activityList',
                    component: resolve => require(['../components/page/activity/activityList.vue'], resolve),
                    name: '活动管理',
                },
                {
                    path: '/addActivity',
                    component: resolve => require(['../components/page/activity/editActivity.vue'], resolve),
                    name: '新增活动',
                },
                {
                    path: '/editActivity/:id',
                    component: resolve => require(['../components/page/activity/editActivity.vue'], resolve),
                    name: '修改活动',
                },
                {
                    path: '/activeDetail/:id/:peopleCount',
                    component: resolve => require(['../components/page/activity/activeDetail.vue'], resolve),
                    name: '活动详情',
                },
                {
                    path: '/applyList/:id',
                    component: resolve => require(['../components/page/activity/applyList.vue'], resolve),
                    name: '报名人员',
                },
                {
                    path: '/likeList',
                    component: resolve => require(['../components/page/like/likeList.vue'], resolve),
                    name: '点赞记录',
                },
                {
                    path: '/likeLabel',
                    component: resolve => require(['../components/page/like/likeLabel.vue'], resolve),
                    name: '点赞标签',
                },
                {
                    path: '/likeRemark',
                    component: resolve => require(['../components/page/like/likeRemark.vue'], resolve),
                    name: '点赞评语',
                },
                {
                    path: '/commodityList',
                    component: resolve => require(['../components/page/commodity/commodityList.vue'], resolve),
                    name: '闲置交换',
                },
                {
                    path: '/recommendBook',
                    component: resolve => require(['../components/page/read/recommendBook.vue'], resolve),
                    name: '推荐书籍',
                },
                {
                    path: '/commentBook',
                    component: resolve => require(['../components/page/read/commentBook.vue'], resolve),
                    name: '悦评管理',
                },
                {
                    path: '/awardRegulation',
                    component: resolve => require(['../components/page/read/awardRegulation.vue'], resolve),
                    name: '投稿规则',
                },
                {
                    path: '/versionsList',
                    component: resolve => require(['../components/page/versions/versionsList.vue'], resolve),
                    name: '版本管理',
                },
                {
                    path: '/channelList',
                    component: resolve => require(['../components/page/versions/channelList.vue'], resolve),
                    name: '渠道管理',
                },
                {
                    path: '/channelActivityList',
                    component: resolve => require(['../components/page/versions/channelActivityList.vue'], resolve),
                    name: '渠道活动管理',
                },
                {
                    path: '/download',
                    component: resolve => require(['../components/page/versions/download.vue'], resolve),
                    name: '下载管理',
                },
                {
                    path: '/financeList',
                    component: resolve => require(['../components/page/finance/financeList.vue'], resolve),
                    name: '账户管理',
                },
                {
                    path: '/accountDetails/:id',
                    component: resolve => require(['../components/page/finance/accountDetails.vue'], resolve),
                    name: '账户明细',
                },
                {
                    path: '/auditDetails',
                    component: resolve => require(['../components/page/finance/auditDetails.vue'], resolve),
                    name: '账户审核',
                },
                {
                    path: '/batchList',
                    component: resolve => require(['../components/page/finance/batchList.vue'], resolve),
                    name: '批次管理',
                },
                {
                    path: '/batchFlowList/:id',
                    component: resolve => require(['../components/page/finance/batchFlowList.vue'], resolve),
                    name: '批次流水',
                },
                {
                    path: '/flowList',
                    component: resolve => require(['../components/page/finance/flowList.vue'], resolve),
                    name: '流水管理',
                },
                {
                    path: '/reasonList',
                    component: resolve => require(['../components/page/finance/reasonsList.vue'], resolve),
                    name: '数据词典',
                },
                {
                    path: '/birthday',
                    component: resolve => require(['../components/page/birthday/birthday.vue'], resolve),
                    name: '生日祝福',
                },
                {
                    path: '/categoryTree',
                    component: resolve => require(['../components/page/cms/categoryTree.vue'], resolve),
                    name: '类目树管理',
                },
                {
                    path: '/standardCombination',
                    component: resolve => require(['../components/page/cms/standardCombination.vue'], resolve),
                    name: '商品组合',
                },
                {
                    path: '/editStandardCombination/:id',
                    component: resolve => require(['../components/page/cms/editStandardCombination.vue'], resolve),
                    name: '关联商品',
                },
                {
                    path: '/cetegory/:id',
                    component: resolve => require(['../components/page/cms/cetegory.vue'], resolve),
                    name: '类目管理',
                },
                {
                    path: '/goodsTemplate',
                    component: resolve => require(['../components/page/cms/goodsTemplate.vue'], resolve),
                    name: '商品模板',
                },
                {
                    path: '/shopTemplate',
                    component: resolve => require(['../components/page/cms/shopTemplate.vue'], resolve),
                    name: '商城模板',
                },
                {
                    path: '/applyTemplate',
                    component: resolve => require(['../components/page/cms/applyTemplate.vue'], resolve),
                    name: '应用模板',
                },
                {
                    path: '/addShopTemplate/:id',
                    component: resolve => require(['../components/page/cms/addShopTemplate.vue'], resolve),
                    name: '模板编辑',
                },
                {
                    path: '/addShopTemplate/:id',
                    component: resolve => require(['../components/page/cms/addShopTemplate.vue'], resolve),
                    name: '模板编辑',
                },
                {
                    path: '/shopTemplateView/:id',
                    component: resolve => require(['../components/page/cms/shopTemplateView.vue'], resolve),
                    name: '商城模板预览',
                },
                {
                    path: '/log',
                    component: resolve => require(['../components/page/log/log.vue'], resolve),
                    name: '日志查询',
                },
                {
                    path: '/logDatail/:id/:type',
                    component: resolve => require(['../components/page/log/logDatail.vue'], resolve),
                    name: '日志明细',
                },
                {
                    path: '/applyList',
                    component: resolve => require(['../components/page/firm/applyList.vue'], resolve),
                    name: '试用申请管理',
                },
                {
                    path: '/discountList',
                    component: resolve => require(['../components/page/coupon/discountList.vue'], resolve),
                    name: '优惠券列表',
                },
                {
                    path: '/addDiscount',
                    component: resolve => require(['../components/page/coupon/addDiscount.vue'], resolve),
                    name: '新增优惠券',
                },
                {
                    path: '/editDiscount/:id',
                    component: resolve => require(['../components/page/coupon/editDiscount.vue'], resolve),
                    name: '编辑优惠券',
                },
                {
                    path: '/grantDiscount/:id/:type',
                    component: resolve => require(['../components/page/coupon/grantDiscount.vue'], resolve),
                    name: '发放优惠券/组',
                },
                {
                    path: '/couponGroup',
                    component: resolve => require(['../components/page/coupon/couponGroup.vue'], resolve),
                    name: '优惠券分组',
                },
                {
                    path: '/couponBatch',
                    component: resolve => require(['../components/page/coupon/couponBatch.vue'], resolve),
                    name: '优惠券批次',
                },
                {
                    path: '/editGrantDiscount/:id',
                    component: resolve => require(['../components/page/coupon/editGrantDiscount.vue'], resolve),
                    name: '编辑优惠券批次',
                },
                {
                    path: '/seeDiscount/:id',
                    component: resolve => require(['../components/page/coupon/seeCoupon.vue'], resolve),
                    name: '查看优惠券',
                },
                {
                    path: '/couponUnit',
                    component: resolve => require(['../components/page/coupon/couponUnit.vue'], resolve),
                    name: '优惠券unit管理',
                },
                {
                    path: '/limitRule',
                    component: resolve => require(['../components/page/limitRule/limitRule.vue'], resolve),
                    name: '限购规则管理',
                },
                {
                    path: '/addLimitRule',
                    component: resolve => require(['../components/page/limitRule/addLimitRule.vue'], resolve),
                    name: '新增限购规则',
                },
                {
                    path: '/editLimitRule/:id',
                    component: resolve => require(['../components/page/limitRule/editLimitRule.vue'], resolve),
                    name: '编辑限购规则',
                },
                {
                    path: '/limitRuleRecord',
                    component: resolve => require(['../components/page/limitRule/limitRuleRecord.vue'], resolve),
                    name: '限购规则购买记录',
                },
                {
                    path: '/bottomInfo',
                    component: resolve => require(['../components/page/cms/bottomInfo.vue'], resolve),
                    name: '底部信息栏管理',
                },
                {
                    path: '/topInfo',
                    component: resolve => require(['../components/page/cms/topInfo.vue'], resolve),
                    name: '页首导航栏管理',
                },
                {
                    path: '/topActivityImg',
                    component: resolve => require(['../components/page/cms/topActivityImg.vue'], resolve),
                    name: '顶部活动图配置',
                },
                {
                    path: '/tabManage',
                    component: resolve => require(['../components/page/cms/tabManage.vue'], resolve),
                    name: 'web商城分页tab管理',
                },
                {
                    path: '/message/messageTemplate',
                    component: resolve => require(['../components/page/message/messageTemplate.vue'], resolve),
                    name: '消息模板',
                },
                {
                    path: '/message/messageList',
                    component: resolve => require(['../components/page/message/messageList.vue'], resolve),
                    name: '消息列表',
                },
                {
                    path: '/paymentConfig',
                    component: resolve => require(['../components/page/config/paymentConfig.vue'], resolve),
                    name: '第三方支付配置',
                },
                {
                    path: '/tabbarConfig',
                    component: resolve => require(['../components/page/config/tabbarConfig.vue'], resolve),
                    name: '移动端分页配置',
                },
                {
                    path: '/storeList',
                    component: resolve => require(['../components/page/store/storeList.vue'], resolve),
                    name: '门店管理',
                },
                {
                    path: '/storeMenuList/:id',
                    component: resolve => require(['../components/page/store/storeMenuList.vue'], resolve),
                    name: '门店菜单管理',
                },
                {
                    path: '/storeRepertory',
                    component: resolve => require(['../components/page/store/storeRepertory.vue'], resolve),
                    name: '门店库存管理',
                },
                {
                    path: '/stockChangeApply/:id/:storeId',
                    component: resolve => require(['../components/page/store/stockChangeApply.vue'], resolve),
                    name: '门店库存流水',
                },
                {
                    path: '/stockAudit',
                    component: resolve => require(['../components/page/store/stockAudit.vue'], resolve),
                    name: '门店库存审核',
                },

                {
                    path: '/membershipList',
                    component: resolve => require(['../components/page/membership/membershipList.vue'], resolve),
                    name: '会籍管理',
                },
                {
                    path: '/membershipUser/:id',
                    component: resolve => require(['../components/page/membership/membershipUser.vue'], resolve),
                    name: '会籍会员列表',
                },
                {
                    path: '/merchantList',
                    component: resolve => require(['../components/page/merchant/merchantList.vue'], resolve),
                    name: '运营方管理',
                },
                {
                    path: '/toNewList',
                    component: resolve => require(['../components/page/coupon/toNewList.vue'], resolve),
                    name: '以旧换新列表',
                },
                {
                    path: '/addToNewAct',
                    component: resolve => require(['../components/page/coupon/addToNewAct.vue'], resolve),
                    name: '新增以旧换新活动',
                },
                {
                    path: '/editToNewAct/:id',
                    component: resolve => require(['../components/page/coupon/editToNewAct.vue'], resolve),
                    name: '编辑以旧换新活动',
                },
                {
                    path: '/exchangeList',
                    component: resolve => require(['../components/page/coupon/exchangeList.vue'], resolve),
                    name: '兑换记录列表',
                },
                {
                    path: '/prListTemplate',
                    component: resolve => require(['../components/page/cms/prListTemplate.vue'], resolve),
                    name: '商品列表页模板',
                },
                {
                    path: '/newShopTemList',
                    component: resolve => require(['../components/page/cms/newShopTemList.vue'], resolve),
                    name: '商品列表页管理',
                },
                {
                    path: '/addToNewShTemp',
                    component: resolve => require(['../components/page/cms/addToNewShTemp.vue'], resolve),
                    name: '增加商品列表页',
                },
                {
                    path: '/editToNewShTemp/:id',
                    component: resolve => require(['../components/page/cms/editToNewShTemp.vue'], resolve),
                    name: '编辑商品列表页模板',
                },
                {
                    path: '/activeTempList',
                    component: resolve => require(['../components/page/cms/activeTempList.vue'], resolve),
                    name: '活动页模板',
                },
                {
                    path: '/addActTemp',
                    component: resolve => require(['../components/page/cms/addActTemp.vue'], resolve),
                    name: '新增活动页模板',
                },
                {
                    path: '/editActTemp/:id',
                    component: resolve => require(['../components/page/cms/editActTemp.vue'], resolve),
                    name: '编辑活动页模板',
                },
                {
                    path: '/activePageList',
                    component: resolve => require(['../components/page/cms/activePageList.vue'], resolve),
                    name: '活动页面管理',
                },
                {
                    path: '/addActivePage/:companyType',
                    component: resolve => require(['../components/page/cms/addActivePage.vue'], resolve),
                    name: '新增活动页面',
                },
                {
                    path: '/editActivePage/:id',
                    component: resolve => require(['../components/page/cms/editActivePage.vue'], resolve),
                    name: '编辑活动页面',
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve),
            name: '登陆页'
        },
    ]
})
