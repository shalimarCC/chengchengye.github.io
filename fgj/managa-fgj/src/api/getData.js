import fetch from '../config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/back-user-web/auth/login/login.do', data, 'POST');

/**
 * 获取验证码接口
 */

export const gainVerificationode = data => fetch('/back-user-web/user/user/gainVerificationode.do', data, 'POST');

/**
 * 注册
 */

export const registerForAdmin = data => fetch('/back-user-web/user/user/registerForAdmin.do', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/back-user-web/auth/login/signout.do');

/**
 * 修改密码
 */

export const updateUserPassword = data => fetch('/back-user-web/user/user/updateUserPassword.do', data, 'POST');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/back-user-web/auth/login/indexLogin.do');

/**
 * 根据权限获取菜单列表
 */

export const getAdminMemu = () => fetch('/back-user-web/user/menu/showList.do');

/**
 * 获取七牛的Token
 */

export const getQiNiuToken = () => fetch('/back-user-web/auth/login/getQiNiuToken.do');

/**
 * 导入模版下载接口
 */

export const findImportTemplateDictUrlByType = data => fetch('/back-cms-web/cms/importTemplateDict/findImportTemplateDictUrlByType.do', data, 'POST');






/**
 * 获取产品列表
 */

export const getProductList = data => fetch('/back-product-web/product/product/productList.do', data, 'POST');

/**
 * 查询所有类目
 */

export const getCategoryList = () => fetch('/back-product-web/product/category/categoryList.do');

/**
 * 查询所有类目
 */

export const idToName = data => fetch('/back-product-web/product/category/idToName.do', data, 'POST');


/**
 * 根据类目Id获取类目属性和属性值
 */

export const categoryAttNameByCId = data => fetch('/back-product-web/product/categoryAttName/categoryAttNameByCId.do', data, 'POST');


/**
 * 新增类目
 */

export const addCategoryTreeNode = data => fetch('/back-product-web/product/categoryTreeNode/addCategoryTreeNode.do', data, 'POST');

/**
 * 新增类目获取类目序列号
 */

export const findMaxSubSerialNumber = data => fetch('/back-product-web/product/categoryTreeNode/findMaxSubSerialNumber.do', data, 'POST');

/**
 * 删除图片
 */

export const deletePicture = data => fetch('/back-product-web/product/picture/deletePicture.do', data, 'POST');


/**
 * 新增产品保存
 */

export const saveProduct = data => fetch('/back-product-web/product/product/saveProduct.do', data, 'POST');

/**
 *编辑保存商品规格
 */

export const saveImgByProductAttValueId = data => fetch('/back-product-web/product/productAttValue/saveImgByProductAttValueId.do', data, 'POST');

/**
 *根据spu规格属性草稿id删除spu规格图片接口
 */

export const delImgByProductAttNameId = data => fetch('/back-product-web/product/productAttValue/delImgByProductAttNameId.do', data, 'POST');

/**
 * 修改产品保存
 */

export const updateProduct = data => fetch('/back-product-web/product/product/updateProduct.do', data, 'POST');

/**
 * 启用/停用产品
 */

export const updateAvailable = data => fetch('/back-product-web/product/product/updateAvailable.do', data, 'POST');

/**
 * 提交产品审核
 */

export const audit = data => fetch('/back-product-web/product/product/audit.do', data, 'POST');

/**
 * 获取产品详情
 */

export const productById = data => fetch('/back-product-web/product/product/productById.do', data, 'POST');


/**
 * 查看产品详情
 */

export const queryStandardProductUnitById = data => fetch('/back-product-web/product/standardProductUnit/queryStandardProductUnitById.do', data, 'POST');


/**
 * 根据属性ID查询规格值
 */

export const findByProductIdAndAttNameId = data => fetch('/back-product-web/product/attributeValue/findByProductIdAndAttNameId.do', data, 'POST');




/**
 * 根据spuID查询属于SPU的规格值
 */

export const attributeValueByProductIdAndCategoryId = data => fetch('/back-product-web/product/attributeName/attributeValueByProductIdAndCategoryId.do', data, 'POST');

/**
 * 根据spuID删除规格值
 */

export const productAttValueDeleteById = data => fetch('/back-product-web/product/productAttValue/delByAttIdAndSpuId.do', data, 'POST');


/**
 * 保存SPU的规格值
 */

export const saveProductAttValueByProductIdAndAttnameId = data => fetch('/back-product-web/product/productAttValue/saveProductAttValueByProductIdAndAttnameId.do', data, 'POST');

/**
 * 获取产品审核列表
 */

export const auditList = data => fetch('/back-product-web/product/product/auditList.do', data, 'POST');

/**
 * 批量通过审核
 */

export const passAllAudit = data => fetch('/back-product-web/product/product/passAllAudit.do', data, 'POST');

/**
 * 通过或不通过审核
 */

export const updateStatus = data => fetch('/back-product-web/product/product/updateStatus.do', data, 'POST');


/**
 * 删除类目
 */

export const deleteCategory = data => fetch('/back-product-web/product/category/deleteCategory.do', data, 'POST');




/**
 * 获取属性列表
 */

export const findPageAttributeName = data => fetch('/back-product-web/product/attributeName/findPageAttributeName.do', data, 'POST');

/**
 * 新增属性
 */

export const saveAttributeName = data => fetch('/back-product-web/product/attributeName/saveAttributeName.do', data, 'POST');

/**
 * 删除属性
 */

export const attributeNameDelete = data => fetch('/back-product-web/product/attributeName/deleteById.do', data, 'POST');

/**
 * 根据ID查询属性详情
 */

export const attributeNameFindById = data => fetch('/back-product-web/product/attributeName/findById.do', data, 'POST');

/**
 * 删除属性值
 */

export const attributeValueDelete = data => fetch('/back-product-web/product/attributeValue/deleteById.do', data, 'POST');

/**
 * 新增属性
 */

export const updateAttributeName = data => fetch('/back-product-web/product/attributeName/updateAttributeName.do', data, 'POST');


/**
 * 根据类目ID查询类目所有信息
 */

export const findCategoryById = data => fetch('/back-product-web/product/category/findCategoryById.do', data, 'POST');

/**
 * 类目删除属性
 */

export const deleteCategoryAttName = data => fetch('/back-product-web/product/categoryAttName/deleteCategoryAttName.do', data, 'POST');


/**
 * 获取可选属性
 */

export const attributeNameByCategoryId = data => fetch('/back-product-web/product/attributeName/attributeNameByCategoryId.do', data, 'POST');

/**
 *搜索可选属性
 */

export const findAllByName = data => fetch('/back-product-web/product/attributeName/findAllByName.do', data, 'POST');

/**
 *保存可选属性
 */

export const saveCategoryAttNameByCategoryId = data => fetch('/back-product-web/product/categoryAttName/saveCategoryAttNameByCategoryId.do', data, 'POST');


/**
 * 获取已选属性
 */

export const showCategoryAttName = data => fetch('/back-product-web/product/categoryAttName/showCategoryAttName.do', data, 'POST');

/**
 *保存编辑属性
 */

export const isRequired = data => fetch('/back-product-web/product/categoryAttName/isRequired.do', data, 'POST');


/**
 *保存类目基本信息
 */

export const modifyCategory = data => fetch('/back-product-web/product/category/modifyCategory.do', data, 'POST');


/**
 * 根据类目id查询上级
 */

export const idsByCategoryId = data => fetch('/back-product-web/product/category/idsByCategoryId.do', data, 'POST');











/**
 *商品列表
 */

export const goodsList = data => fetch('/back-product-web/product/merchantProduct/findMerchantProductOfPage.do', data, 'POST');

/**
 *产品列表
 */

export const productByCategoryId = data => fetch('/back-product-web/product/product/productByCategoryId.do', data, 'POST');

/**
 *类目列表
 */

export const categoryList = data => fetch('/back-product-web/product/category/categoryList.do', data, 'POST');

/**
 *根据产品ID查询产品信息
 */

export const merchantProductViwe = data => fetch('/back-product-web/product/standardProductUnit/findStandardProductUnitById.do', data, 'POST');

/**
 *获取所有会籍信息
 */

export const findAllMembership = data => fetch('/back-product-web/product/membership/findAllMembership.do', data, 'POST');

/**
 *新增商品
 */

export const saveMerchantProduct = data => fetch('/back-product-web/product/merchantProduct/insertMerchantProductWithTx.do', data, 'POST');

/**
 *刷新su商品搜索规则数据信息接口
 */

export const syncSaveSuSerachRule = data => fetch('/back-product-web/product/standardUnit/syncSaveSuSerachRule.do', data, 'POST');

/**
 *根据商品id查询商品信息
 */

export const findMerchantProductById = data => fetch('/back-product-web/product/merchantProduct/findMerchantProductById.do', data, 'POST');

/**
 *根据suId查询puname列表
 */

export const findPuNameBySuIdBackStage = data => fetch('/back-product-web/product/merchantProduct/findPuNameBySuIdBackStage.do', data, 'POST');

/**
 *根据商品id查询商品信息
 */

export const queryByStandardUnitId = data => fetch('/back-product-web/product/standardUnit/queryByStandardUnitId.do.do', data, 'POST');

/**
 *编辑保存商品基本信息
 */

export const updateMerchantProductByIdWithTx = data => fetch('/back-product-web/product/merchantProduct/updateMerchantProductByIdWithTx.do', data, 'POST');


/**
 *编辑保存商品规格
 */

export const updateProductUnitByIdWithTx = data => fetch('/back-product-web/product/merchantProduct/updateProductUnitByIdWithTx.do ', data, 'POST');

/**
 *编辑保存商品描述
 */

export const updatMerchantProdDescribe = data => fetch('/back-product-web/product/merchantProduct/updatMerchantProdDescribe.do', data, 'POST');

/**
 *编辑保存商品图片
 */

export const updateMerchantProductPictureByIdWithTx = data => fetch('/back-product-web/product/merchantProduct/updateMerchantProductPictureByIdWithTx.do', data, 'POST');


/**
 *商品审核列表
 */

export const merchantProductaudit = data => fetch('/back-product-web/product/merchantProduct/merchantProductaudit.do', data, 'POST');

/**
 *商品反馈列表
 */

export const findMerchantProductFeedbackOfPage = data => fetch('/back-product-web/product/merchantProductFeedback/findMerchantProductFeedbackOfPage.do', data, 'POST');

/**
 *修改商品反馈受理状态
 */

export const doFeedbackOperator = data => fetch('/back-product-web/product/merchantProductFeedback/doFeedbackOperator.do', data, 'POST');

/**
 *批量通过商品审核
 */

export const passAllAuditWithTx = data => fetch('/back-product-web/product/merchantProduct/passAllAuditWithTx.do', data, 'POST');

/**
 *商品审核通过/不通过
 */

export const merchantProductPassWithTx = data => fetch('/back-product-web/product/merchantProduct/merchantProductPassWithTx.do', data, 'POST');


/**
 *删除商品
 */

export const deleteByProductId = data => fetch('/back-product-web/product/merchantProduct/deleteByProductId.do', data, 'POST');


/**
 *改变商品状态
 */

export const putawaySoldOut = data => fetch('/back-product-web/product/standardUnit/putawaySoldOut.do', data, 'POST');

/**
 *提交审核
 */

export const submitAuditWithTx = data => fetch('/back-product-web/product/merchantProduct/submitAuditWithTx.do', data, 'POST');


/**
 *查看商品审核失败原因
 */

export const findAllGoods = data => fetch('/back-product-web/product/merchantMerchantProdCause/findAll.do', data, 'POST');





/**
 *比价平台列表
 */

export const findSellPlatformOfPage = data => fetch('/back-product-web/product/sellPlatform/findSellPlatformOfPage.do', data, 'POST');

/**
 *新增比价平台信息
 */

export const saveSellPlatform = data => fetch('/back-product-web/product/sellPlatform/insertSellPlatformWithTx.do', data, 'POST');

/**
 *修改比价平台信息
 */

export const updateSellPlatform = data => fetch('/back-product-web/product/sellPlatform/insertSellPlatformWithTx.do', data, 'POST');


/**
 *根据ID查询平台信息
 */

export const findById = data => fetch('/back-product-web/product/sellPlatform/findSellPlatformById.do', data, 'POST');


/**
 *根据ID查询平台信息
 */

export const updateSellPlatformByIdWithTx = data => fetch('/back-product-web/product/sellPlatform/updateSellPlatformByIdWithTx.do', data, 'POST');

/**
 *查询比价反馈说明接口
 */

export const findCommodityProductUnitCompare = data => fetch('/back-product-web/product/commodityProductUnitCompare/findCommodityProductUnitCompare.do', data, 'POST');


/**
 *修改反馈说明接口
 */
export const insertCommodityProductUnitCompareWithTx = data => fetch('/back-product-web/product/commodityProductUnitCompare/insertCommodityProductUnitCompareWithTx.do', data, 'POST');

/**
 *删除活动商品
 */

export const cancelActivity = data => fetch('/back-activity-web/activity/activityBackStage/cancelActivity.do', data, 'POST');

/**
 *根据活动ID查询商品列表
 */

export const activityMerchantProdByMerchantProdName = data => fetch('/back-promotion-web/promotion/activityMerchantProd/activityMerchantProdByMerchantProdName.do', data, 'POST');

/**
 *保存活动商品
 */

export const saveActivityMerchantProd = data => fetch('/back-promotion-web/promotion/activityMerchantProd/saveActivityMerchantProd.do', data, 'POST');

/**
 *保存活动商品排序
 */

export const updateActivityMerchantProd = data => fetch('/back-promotion-web/promotion/activityMerchantProd/updateActivityMerchantProd.do', data, 'POST');


/**
 *库存列表
 */

export const findCommodityProductUnitStockOfPage = data => fetch('/back-product-web/product/commodityProductUnit/findCommodityProductUnitStockOfPage.do', data, 'POST');

/**
 *库存流水列表
 */

export const findCommodityProductUnitStockRunningWaterOfPage = data => fetch('/back-stock-web/stock/commodityProductUnitStockRunningWater/findCommodityProductUnitStockRunningWaterOfPage.do', data, 'POST');

/**
 *根据库存ID查询SKU信息
 */

export const merchantProductByProductId = data => fetch('/back-product-web/product/merchantProduct/merchantProductByProductId.do', data, 'POST');

/**
 *进货
 */

export const addStock = data => fetch('/back-stock-web/stock/commodityProductUnitWarehouseStock/merchandiseStockWithTx.do', data, 'POST');

/**
 *出货
 */

export const comeStock = data => fetch('/back-stock-web/stock/commodityProductUnitWarehouseStock/deliverStockWithTx.do', data, 'POST');




/**
 *订单列表
 */

export const orderList = data => fetch('/back-order-web/order/backStage/orderList.do', data, 'POST');

/**
 *订单列表
 */

export const soChildAllList = data => fetch('/back-order-web/order/backStage/soChildAllList.do', data, 'POST');

/**
 *订单状态列表
 */

export const orderStatusList = data => fetch('/back-order-web/order/backStage/orderStatusList.do', data, 'POST');

/**
 *根据ID获取订单详情
 */

export const findOrderDetail = data => fetch('/back-order-web/order/backStage/findOrderDetail.do', data, 'POST');

/**
 *根据订单id查询第三方订单列表
 */

export const findSoThirdpartyBySoId = data => fetch('/back-order-web/order/soThirdparty/findSoThirdpartyBySoId.do', data, 'POST');

/**
 *将优惠卷批次设置为失效
 */

export const invalidCouponBatchWithTx = data => fetch('/back-promotion-web/promotion/couponBatch/invalidCouponBatchWithTx.do', data, 'POST');

/**
 *查询优惠卷批次详情通过id
 */

export const findCouponBatchInfoById = data => fetch('/back-promotion-web/promotion/couponBatch/findCouponBatchInfoById.do', data, 'POST');

/**
 *优惠卷unit重置为有效
 */

export const resetCouponUnitWithTx = data => fetch('/back-promotion-web/promotion/couponUnit/resetCouponUnitWithTx.do', data, 'POST');

/**
 *显示/隐藏优惠卷批次
 */

export const updateCouponBatchByIdWithTx = data => fetch('/back-promotion-web/promotion/couponBatch/updateCouponBatchByIdWithTx.do', data, 'POST');

/**
 *优惠卷unit列表
 */

export const findCouponUnitOfPage = data => fetch('/back-promotion-web/promotion/couponUnit/findCouponUnitOfPage.do', data, 'POST');

/**
 *根据母订单查询所有子订单
 */

export const findAllSOChildBySoId = data => fetch('/back-order-web/order/backStage/findAllSOChildBySoId.do', data, 'POST');

/**
 *查询子订单的详情
 */

export const findSochildById = data => fetch('/back-order-web/order/backStage/findSochildById.do', data, 'POST');


/**
 *查询拆单时使用的pu列表
 */

export const puInfoForOpenOrder = data => fetch('/back-order-web/order/backStage/puInfoForOpenOrder.do', data, 'POST');


/**
 *拆单保存
 */

export const openOrder = data => fetch('/back-order-web/order/backStage/openOrder.do', data, 'POST');

/**
 *导出子订单
 */

export const exportSoChild = data => fetch('/back-order-web/order/backStage/exportSoChild.do', data, 'POST');

/**
 *根据母单id查询发票公共信息
 */

export const findInvoiceBySoId = data => fetch('/back-order-web/order/soInvoice/findInvoiceBySoId.do', data, 'POST');

/**
 *修改母订单发票信息
 */

export const updateInvoiceInfo = data => fetch('/back-order-web/order/soInvoice/updateInvoiceInfo.do', data, 'POST');

/**
 *根据子单id查询发票信息
 */

export const soChildInvoiceInfo = data => fetch('/back-order-web/order/soInvoice/soChildInvoiceInfo.do', data, 'POST');

/**
 *开具发票保存信息
 */

export const drawInvoice = data => fetch('/back-order-web/order/soInvoice/drawInvoice.do', data, 'POST');

/**
 *修改订单发票类型的信息
 */

export const updateInvoiceTypeInfo = data => fetch('/back-order-web/order/soInvoice/updateInvoiceTypeInfo.do', data, 'POST');

/**
 *修改订单发票类型的信息
 */

export const findInvoiceList = data => fetch('/back-order-web/order/invoice/findInvoiceList.do', data, 'POST');

/**
 *新增或编辑公共发票信息
 */

export const insertOrUpdateInvoiceWithTx = data => fetch('/back-order-web/order/invoice/insertOrUpdateInvoiceWithTx.do', data, 'POST');


/**
 *通过id查询公共发票信息
 */

export const findInvoiceById = data => fetch('/back-order-web/order/invoice/findInvoiceById.do', data, 'POST');

/**
 *更换公共发票信息
 */

export const changeCommonInvoiceInfo = data => fetch('/back-order-web/order/soInvoice/changeCommonInvoiceInfo.do', data, 'POST');

/**
 *根据母订单查询财务信息
 */

export const findFinanceBySoId = data => fetch('/back-order-web/order/backStage/findFinanceBySoId.do', data, 'POST');

/**
 *根据母订单查询收货地址信息
 */

export const receiverInfos = data => fetch('/back-order-web/order/backStage/receiverInfos.do', data, 'POST');

/**
 *根据子订单查询收货地址信息
 */

export const userReceiverInfos = data => fetch('/back-order-web/order/backStage/userReceiverInfos.do', data, 'POST');


/**
 *地址三级联动
 */

export const findProvCityAreaAll = data => fetch('/back-order-web/order/provCityArea/findProvCityAreaAll.do', data, 'POST');

/**
 *新增地址
 */

export const updateReceiverInfo = data => fetch('/back-order-web/order/backStage/updateReceiverInfo.do', data, 'POST');


/**
 *根据母单id查询所有的pu列表
 */

export const findAllSoItemBySoId = data => fetch('/back-order-web/order/soItem/findAllSoItemBySoId.do', data, 'POST');

/**
 *根据母单id查询所有的unit列表
 */

export const findSoItemBySoIdAndUnit = data => fetch('/back-order-web/order/soItem/findSoItemBySoIdAndUnit.do', data, 'POST');

/**
 *根据母订单查询物流信息
 */

export const soDeliveryInfoList = data => fetch('/back-order-web/order/soPackage/soDeliveryInfoList.do', data, 'POST');

/**
 *根据母订单查询物流信息
 */

export const customerServices = data => fetch('/back-order-web/order/backStage/customerServices.do', data, 'POST');

/**
 *订单物流信息新增箱号
 */

export const addBox = data => fetch('/back-order-web/order/soPackage/addBox.do', data, 'POST');

/**
 *根据子订单查询操作记录流水信息
 */

export const soChildOpFlow = data => fetch('/back-order-web/order/backStage/soChildOpFlow.do', data, 'POST');

/**
 *根据母订单查询操作记录流水信息
 */

export const soOpFlow = data => fetch('/back-order-web/order/backStage/soOpFlow.do', data, 'POST');

/**
 *查询订单退款信息
 */

export const soRefundInfo = data => fetch('/back-order-web/order/backStage/soRefundInfo.do', data, 'POST');

/**
 *订单退款详情
 */

export const refundDetail = data => fetch('/back-order-web/order/backStage/refundDetail.do', data, 'POST');

/**
 *订单退款
 */

export const soRefund = data => fetch('/back-order-web/order/backStage/soRefund.do', data, 'POST');

/**
 *退款订单分页列表
 */

export const refundOrderPage = data => fetch('/back-order-web/order/backStage/refundOrderPage.do', data, 'POST');

/**
 *退款单列表
 */

export const findSoRefundOfPage = data => fetch('/back-order-web/order/soRefund/findSoRefundOfPage.do', data, 'POST');

/**
 *更新退款单备注
 */

export const updateSoRefundRemarkWithTx = data => fetch('/back-order-web/order/soRefund/updateSoRefundRemarkWithTx.do', data, 'POST');

/**
 *分拣导出
 */

export const orderSortExport = data => fetch('/back-order-web/order/backStage/orderSortExport.do', data, 'POST');

/**
 *订单信息导出
 */

export const orderExport = data => fetch('/back-order-web/order/backStage/orderExport.do', data, 'POST');

/**
 *轮播图列表
 */
export const findBannerOfPage = data => fetch('/back-product-web/product/blessingCoinBanner/findBlessingCoinBannerOfPage.do', data, 'POST');



/**
 *查询商品(不分页)
 */

export const findActivityMerchantProd = data => fetch('/back-product-web/product/merchantProduct/findAllByPutaway.do', data, 'POST');


/**
 *新增banner
 */

export const saveBanner = data => fetch('/back-cms-web/cms/banner/saveBanner.do', data, 'POST');



/**
 *根据banner id 查询信息
 */

export const findBannerById = data => fetch('/back-cms-web/cms/banner/bannerDetail.do', data, 'POST');

/**
 *获取企业列表(只包含id和名称)
 */

export const findCompanyIdOrName = data => fetch('/back-user-web/user/company/findCompanyIdOrName.do', data, 'POST');

/**
 *模糊搜索商品
 */

export const findStandardUnitIdAndName = data => fetch('/back-product-web/product/standardUnit/findStandardUnitIdAndName.do', data, 'POST');

/**
 *获取卡券模板列表
 */

export const findCardStampsAdministrationOfPage = data => fetch('/back-product-web/product/cardStampsAdministration/findPage.do', data, 'POST');


/**
 *查询所有前端类目接口
 */

export const findLeadingEndCategoryAll = data => fetch('/back-product-web/product/leadingEndCategory/findLeadingEndCategoryAll.do', data, 'POST');

/**
 *虚拟商品模版新增接口
 */

export const insertCardStampsAdministrationWithTx = data => fetch('/back-product-web/product/cardStampsAdministration/insertCardStampsAdministrationWithTx.do', data, 'POST');

/**
 *虚拟商品模版系修改接口
 */

export const updateCardStampsAdministrationByIdWithTx = data => fetch('/back-product-web/product/cardStampsAdministration/updateCardStampsAdministrationByIdWithTx.do', data, 'POST');



/**
 *根据ID 获取虚拟卡券模板信息
 */

export const findCardStampsAdministrationById = data => fetch('/back-product-web/product/cardStampsAdministration/findCardStampsAdministrationById.do', data, 'POST');


/**
 *功能模块分页息
 */

export const findFunctionModuleOfPage = data => fetch('/back-cms-web/cms/functionModule/findFunctionModuleOfPage.do', data, 'POST');

/**
 *查询类目
 */

export const queryAllCategoryTreeNodeByType = data => fetch('/back-product-web/product/categoryTreeNode/queryAllCategoryTreeNodeByType.do', data, 'POST');

/**
 *根据功能模版id更新模版类目节点关系
 */

export const updateFunctionModuleCategoryAllWithTx = data => fetch('/back-cms-web/cms/functionModuleCategory/updateFunctionModuleCategoryAllWithTx.do', data, 'POST');

/**
 *根据功能模版id查询功能模版类目节点关系信息
 */

export const findFunctionModuleCategoryAll = data => fetch('/back-cms-web/cms/functionModuleCategory/categoryTreeNodeIdsByFunctionModuleId.do', data, 'POST');


/**
 *获取企业列表
 */

export const findCompanyOfPage = data => fetch('/back-user-web/user/company/findCompanyOfPage.do', data, 'POST');

/**
 *新增、修改企业保存
 */

export const insertOrUpdateCompanyWithTx = data => fetch('/back-user-web/user/company/insertOrUpdateCompanyWithTx.do', data, 'POST');


/**
 *企业的有效性
 */

export const companyInvalid = data => fetch('/back-user-web/user/company/companyInvalid.do', data, 'POST');

/**
 *根据ID查询企业详情
 */

export const findCompanyById = data => fetch('/back-user-web/user/company/findCompanyById.do', data, 'POST');

/**
 *设置试用申请为已受理状态
 */

export const findTrialApplyById = data => fetch('/back-user-web/user/trialApply/findTrialApplyById.do', data, 'POST');


/**
 *试用申请分页列表
 */

export const findTrialApplyOfPage = data => fetch('/back-user-web/user/trialApply/findTrialApplyOfPage.do', data, 'POST');

/**
 *通过id查询试用申请
 */

export const dealTrialApply = data => fetch('/back-user-web/user/trialApply/dealTrialApply.do', data, 'POST');

/**
 *根据公司id递归查询所有部门信息
 */

export const depTreeByCompany = data => fetch('/back-user-web/user/department/depTreeByCompany.do', data, 'POST');

/**
 *确定导入组织架构
 */

export const assureImportDepartmentAll = data => fetch('/back-user-web/user/department/assureImportDepartmentAll.do', data, 'POST');

/**
 *导出组织架构
 */

export const outImportDepartment = data => fetch('/back-user-web/user/department/outImportDepartment.do', data, 'POST');


/**
 *根据ID查询员工列表
 */

export const userExtendAllOfPage = data => fetch('/back-user-web/user/userExtend/userExtendAllOfPage.do', data, 'POST');

/**
 *设定员工管理员身份接口
 */

export const upadteBackAccountMannager = data => fetch('/back-user-web/user/userExtend/upadteBackAccountMannager.do', data, 'POST');

/**
 *手动清除员工导入缓存
 */
export const clearImportMemoryBackStage = data => fetch('/back-user-web/user/user/clearImportMemoryBackStage.do', data, 'POST');

/**
 *新增或者更新用户接口
 */

export const insertOrUpdate = data => fetch('/back-user-web/user/user/insertOrUpdate.do', data, 'POST');

/**
 *根据用户id查询用户详情接口
 */

export const findAboutUser = data => fetch('/back-user-web/user/user/findAboutUser.do', data, 'POST');

/**
 *员工状态重置
 */

export const resetStatus = data => fetch('/back-user-web/user/userExtend/resetStatus.do', data, 'POST');

/**
 *确认导入用户信息
 */

export const assureImportAboutUser = data => fetch('/back-user-web/user/user/assureImportAboutUser.do', data, 'POST');

/**
 *资产列表
 */

export const userAccountPage = data => fetch('/back-account-web/account/accountBackStage/userAccountPage.do', data, 'POST');

/**
 *员工流水导出
 */

export const userFlowExportBackStage = data => fetch('/back-account-web/account/accountBackStage/userFlowExportBackStage.do', data, 'POST');

/**
 *充值原因
 */

export const accountOperateReasons = data => fetch('/back-account-web/account/accountBackStage/accountOperateReasons.do', data, 'POST');

/**
 *根据类型查充值原因
 */

export const certainTypeReasons = data => fetch('/back-account-web/account/accountBackStage/certainTypeReasons.do', data, 'POST');

/**
 *员工账户充值导入
 */

export const userAccountRecharge = data => fetch('/back-account-web/account/accountBackStage/userAccountRecharge.do', data, 'POST');


/**
 *员工账户充值确定导入
 */

export const impConfirm = data => fetch('/back-account-web/account/accountBackStage/impConfirm.do', data, 'POST');

/**
 *充值记录
 */

export const userAccountRechargeRec = data => fetch('/back-account-web/account/accountBackStage/userAccountRechargeRec.do', data, 'POST');

/**
 *充值记录详情
 */

export const userAccountRechargeRecDetail = data => fetch('/back-account-web/account/accountBackStage/userAccountRechargeRecDetail.do', data, 'POST');

/**
 *流水列表
 */

export const batchFlowPage = data => fetch('/back-account-web/account/accountBackStage/batchFlowPage.do', data, 'POST');



/**
 *获取活动列表
 */

export const activityList = data => fetch('/back-activity-web/activity/activityBackStage/activityList.do', data, 'POST');

/**
 *更改活动可见性
 */

export const changeActivityVisible = data => fetch('/back-activity-web/activity/activityBackStage/changeActivityVisible.do', data, 'POST');

/**
 *活动查询公司列表
 */

export const simpleCompanyList = data => fetch('/back-user-web/user/company/simpleCompanyList.do', data, 'POST');

/**
 *保存活动详情
 */

export const saveActivity = data => fetch('/back-activity-web/activity/activityBackStage/saveActivity.do', data, 'POST');

/**
 *根据ID获取活动详情
 */

export const activityDetail = data => fetch('/back-activity-web/activity/activityBackStage/activityDetail.do', data, 'POST');

/**
 *根据ID获取报名人员信息
 */

export const activityUserPage = data => fetch('/back-activity-web/activity/activityBackStage/activityUserPage.do', data, 'POST');

/**
 *根据ID导出报名人员
 */

export const exportActivityUser = data => fetch('/back-activity-web/activity/activityBackStage/exportActivityUser.do', data, 'POST');



/**
 *获取点赞记录列表
 */

export const praiseRecord = data => fetch('/back-praise-web/praise/praiseBackStage/praiseRecord.do', data, 'POST');

/**
 *获取点赞标签列表
 */

export const praiseTagList = data => fetch('/back-praise-web/praise/praiseBackStage/praiseTagList.do', data, 'POST');

/**
 *根据ID获取点赞标签信息
 */

export const praiseTagDetail = data => fetch('/back-praise-web/praise/praiseBackStage/praiseTagDetail.do', data, 'POST');

/**
 *新增、修改点赞评语
 */

export const savePraiseTag = data => fetch('/back-praise-web/praise/praiseBackStage/savePraiseTag.do', data, 'POST');

/**
 *获取点赞评语列表
 */

export const praiseWordsPage = data => fetch('/back-praise-web/praise/praiseBackStage/praiseWordsPage.do', data, 'POST');

/**
 *新增、修改点赞评语
 */

export const savePraiseWords = data => fetch('/back-praise-web/praise/praiseBackStage/savePraiseWords.do', data, 'POST');

/**
 *根据ID获取点赞评语信息
 */

export const praiseWordsDetail = data => fetch('/back-praise-web/praise/praiseBackStage/praiseWordsDetail.do', data, 'POST');






/**
 *分页查询闲置交换列表
 */

export const commodityOfPage_HT = data => fetch('/back-secondhand-web/secondhand/commodity/commodityOfPage_HT.do', data, 'POST');


/**
 *根据id查询所有二手商品详情接口
 */

export const findCommodityById_HT = data => fetch('/back-secondhand-web/secondhand/commodity/findCommodityById_HT.do', data, 'POST');

/**
 *审核二手商品信息
 */

export const auditCommodityById_HT = data => fetch('/back-secondhand-web/secondhand/commodity/auditCommodityById_HT.do', data, 'POST');


/**
 *条件分页查询所有阅读推荐接口_HT
 */

export const findReadRecommendOfPage_HT = data => fetch('/back-read-web/read/readRecommend/findReadRecommendOfPage_HT.do', data, 'POST');


/**
 *新增阅读推荐
 */

export const insertReadRecommend_HT = data => fetch('/back-read-web/read/readRecommend/insertReadRecommend_HT.do', data, 'POST');

/**
 *修改阅读推荐
 */

export const updateReadRecommendById_HT = data => fetch('/back-read-web/read/readRecommend/updateReadRecommendById_HT.do', data, 'POST');


/**
 *根据id查询阅读推荐阅读信息
 */

export const findReadRecommendById_HT = data => fetch('/back-read-web/read/readRecommend/findReadRecommendById_HT.do', data, 'POST');

/**
 *阅读推荐批量上下架
 */

export const updateReadRecommendBatchStatusByIds_HT = data => fetch('/back-read-web/read/readRecommend/updateReadRecommendBatchStatusByIds_HT.do', data, 'POST');


/**
 *根据ID编辑悦评状态
 */

export const updateTopicStatusById_HT = data => fetch('/back-read-web/read/topic/updateTopicStatusById_HT.do', data, 'POST');

/**
 *新增悦评
 */

export const insertTopicWithTx_HT = data => fetch('/back-read-web/read/topic/insertTopicWithTx_HT.do', data, 'POST');

/**
 *修改悦评
 */

export const updateTopicByIdWithTx_HT = data => fetch('/back-read-web/read/topic/updateTopicByIdWithTx_HT.do', data, 'POST');

/**
 *根据id查询悦评信息
 */

export const topicOfId_HT = data => fetch('/back-read-web/read/topic/topicOfId_HT.do', data, 'POST');

/**
 *分页查询奖励规则信息接口
 */

export const findAwardRegulationOfPage = data => fetch('/back-read-web/read/awardRegulation/findAwardRegulationOfPage.do', data, 'POST');

/**
 *新增奖励规则信息接口
 */

export const insertAwardRegulationWithTx = data => fetch('/back-read-web/read/awardRegulation/insertAwardRegulationWithTx.do', data, 'POST');

/**
 *根据奖励规则id修改奖励规则信息接口
 */

export const updateAwardRegulationByIdWithTx = data => fetch('/back-read-web/read/awardRegulation/updateAwardRegulationByIdWithTx.do', data, 'POST');

/**
 *根据奖励规则id查询奖励规则信息接口
 */

export const findByAwardRegulationId = data => fetch('/back-read-web/read/awardRegulation/findByAwardRegulationId.do', data, 'POST');




/**
 *条件分页查询悦评接口
 */

export const topicOfPage_HT = data => fetch('/back-read-web/read/topic/topicOfPage_HT.do', data, 'POST');





/**
 *条件分页查询电子卡券
 */

export const findSkuECardOfPage = data => fetch('/back-product-web/product/sku/findSkuECardOfPage.do', data, 'POST');

/**
 *根据ID查询卡券UNIT
 */

export const findECardOfPage = data => fetch('/back-promotion-web/promotion/eCard/findECardOfPage.do', data, 'POST');


/**
 *根据ID查询卡券UNIT
 */

export const importECardWithTx = data => fetch('/back-promotion-web/promotion/eCard/importECardWithTx.do', data, 'POST');

/**
 *分页查询卡密导入批次接口
 */

export const findCardBatchOfPage = data => fetch('/back-promotion-web/promotion/cardBatch/findCardBatchOfPage.do', data, 'POST');


/**
 *获取SKU列表
 */

export const findSkuOfPage = data => fetch('/back-product-web/product/sku/findSkuOfPage.do', data, 'POST');

/**
 *启用/停用SKU
 */

export const isAvailableWithTx = data => fetch('/back-product-web/product/sku/isAvailableWithTx.do', data, 'POST');

/**
 *有效/失效SKU
 */

export const updateSkuByIdWithTx = data => fetch('/back-product-web/product/sku/updateSkuByIdWithTx.do', data, 'POST');


/**
 *设置版本状态或设置官方版本
 */

export const updateVersionStatus = data => fetch('/back-user-web/user/versions/updateVersionStatus.do', data, 'POST');

/**
 *版本列表
 */

export const findVersionsOfPage = data => fetch('/back-user-web/user/versions/findVersionsOfPage.do', data, 'POST');



/**
 *新增版本
 */

export const insertVersionsWithTx = data => fetch('/back-user-web/user/versions/insertVersionsWithTx.do', data, 'POST');

/**
 *下载管理列表
 */

export const findDownloadOfPage = data => fetch('/back-user-web/user/download/findDownloadOfPage.do', data, 'POST');

/**
 *新增推广
 */

export const insertDownloadWithTx = data => fetch('/back-user-web/user/download/insertDownloadWithTx.do', data, 'POST');

/**
 *修改推广
 */

export const updateDownloadByIdWithTx = data => fetch('/back-user-web/user/download/updateDownloadByIdWithTx.do', data, 'POST');

/**
 *根据ID查询推广信息
 */

export const findDownloadById = data => fetch('/back-user-web/user/download/findDownloadById.do', data, 'POST');

/**
 *根据版本id修改版本
 */

export const updateVersionsByIdWithTx = data => fetch('/back-user-web/user/versions/updateVersionsByIdWithTx.do', data, 'POST');

/**
 *根据版本id显示版本详情
 */

export const findVersionsById = data => fetch('/back-user-web/user/versions/findVersionsById.do', data, 'POST');

/**
 *分页查询渠道列表接口
 */

export const findChannelOfPage = data => fetch('/back-user-web/user/channel/findChannelOfPage.do', data, 'POST');

/**
 *账户变动原因分页列表
 */

export const reasons = data => fetch('/back-account-web/account/accountBackStage/reasons.do', data, 'POST');

/**
 *编辑/新建财务调整原因
 */

export const saveReason = data => fetch('/back-account-web/account/accountBackStage/saveReason.do', data, 'POST');

/**
 *编辑/新建财务调整原因
 */

export const reasonDetail = data => fetch('/back-account-web/account/accountBackStage/reasonDetail.do', data, 'POST');


/**
 *渠道新增接口
 */

export const insertChannelWithTx = data => fetch('/back-user-web/user/channel/insertChannelWithTx.do', data, 'POST');

/**
 *渠道修改接口
 */

export const updateChannelByIdWithTx = data => fetch('/back-user-web/user/channel/updateChannelByIdWithTx.do', data, 'POST');

/**
 *根据渠道id查询渠道详情接口
 */

export const findChannelById = data => fetch('/back-user-web/user/channel/findChannelById.do', data, 'POST');

/**
 *公司账户分页列表
 */

export const companyAccountPage = data => fetch('/back-account-web/account/accountBackStage/companyAccountPage.do', data, 'POST');

/**
 *普通公司账户列表
 */

export const normalAccounts = data => fetch('/back-account-web/account/accountBackStage/normalAccounts.do', data, 'POST');

/**
 *账户充值/调整提交审核
 */

export const raSubmitForExam = data => fetch('/back-account-web/account/accountBackStage/raSubmitForExam.do', data, 'POST');

/**
 *改变公司账户有效性
 */

export const changeAccountDisable = data => fetch('/back-account-web/account/accountBackStage/changeAccountDisable.do', data, 'POST');

/**
 *账户批次分页列表
 */

export const accountBatchPage = data => fetch('/back-account-web/account/accountBackStage/accountBatchPage.do', data, 'POST');

/**
 *账户批次分页列表
 */

export const accountFlowPage = data => fetch('/back-account-web/account/accountBackStage/userFinFlowPage.do', data, 'POST');


/**
 *全部流水分页列表
 */

export const flowPage = data => fetch('/back-account-web/account/accountBackStage/flowPage.do', data, 'POST');

/**
 *查询所有流水类型
 */

export const flowTypeList = data => fetch('/back-account-web/account/accountBackStage/flowTypeList.do', data, 'POST');


/**
 *查询流水失败原因
 */

export const batchExamReason = data => fetch('/back-account-web/account/accountBackStage/batchExamReason.do', data, 'POST');

/**
 *全部批次分页列表
 */

export const fullBatchPage = data => fetch('/back-account-web/account/accountBackStage/fullBatchPage.do', data, 'POST');


/**
 *待审核账户充值与金额调整记录分页列表
 */

export const batchTmpPage = data => fetch('/back-account-web/account/accountBackStage/batchTmpPage.do', data, 'POST');

/**
 *批次审核通过/不通过
 */

export const batchExam = data => fetch('/back-account-web/account/accountBackStage/batchExam.do', data, 'POST');

/**
 *祝福语列表分页
 */

export const congrWordsPage = data => fetch('/back-congratulation-web/congratulation/congratulationBackStage/congrWordsPage.do', data, 'POST');


/**
 *单个祝福留言详情查询
 */

export const congrWordsDetail = data => fetch('/back-congratulation-web/congratulation/congratulationBackStage/congrWordsDetail.do', data, 'POST');


/**
 *新增/编辑祝福语
 */

export const saveCongrWords = data => fetch('/back-congratulation-web/congratulation/congratulationBackStage/saveCongrWords.do', data, 'POST');





/**
 *分页查询前台类目树接口
 */

export const findCategoryTreeOfPage = data => fetch('/back-product-web/product/categoryTree/findCategoryTreeOfPage.do', data, 'POST');

/**
 *新增类目树信息接口
 */

export const addCategoryTree = data => fetch('/back-product-web/product/categoryTree/addCategoryTree.do', data, 'POST');

/**
 *修改类目树信息接口
 */

export const updateCategoryTree = data => fetch('/back-product-web/product/categoryTree/updateCategoryTree.do', data, 'POST');

/**
 *根据类目树id查询类目树信息接口
 */

export const findByCategoryTreeId = data => fetch('/back-product-web/product/categoryTree/findByCategoryTreeId.do', data, 'POST');


/**
 *根据类目树id启用类目树接口
 */

export const categoryTreeStartUsing = data => fetch('/back-product-web/product/categoryTree/categoryTreeStartUsing.do', data, 'POST');

/**
 *显示所有类目树模版信息接口
 */

export const findCategoryTreeTemplateAll = data => fetch('/back-cms-web/cms/categoryTreeTemplate/findCategoryTreeTemplateAll.do', data, 'POST');

/**
 *分页查询su组合信息接口
 */

export const findStandardUnitCombinationOfPage = data => fetch('/back-product-web/product/standardUnitCombination/findStandardUnitCombinationOfPage.do', data, 'POST');

/**
 *新增商品组合接口
 */

export const insertStandardUnitCombinationWithTx = data => fetch('/back-product-web/product/standardUnitCombination/insertStandardUnitCombinationWithTx.do', data, 'POST');

/**
 *根据id查询商品组合
 */

export const findStandardUnitCombinationById = data => fetch('/back-product-web/product/standardUnitCombination/findStandardUnitCombinationById.do', data, 'POST');

/**
 *根据商品组合商品id修改商品组合接口
 */

export const updateStandardUnitCombinationByIdWithTx = data => fetch('/back-product-web/product/standardUnitCombination/updateStandardUnitCombinationByIdWithTx.do', data, 'POST');


/**
 *查询所有类目树接口
 */

export const findCategoryTreeAll = data => fetch('/back-product-web/product/categoryTree/findCategoryTreeAll.do', data, 'POST');


/**
 *根据su组合id查询su商品列表接口
 */

export const findByStandardUnitCombinationIdOfPage = data => fetch('/back-product-web/product/standardUnitCombinationSu/findByStandardUnitCombinationIdOfPage.do', data, 'POST');


/**
 *根据su商品组合Id查询su商品列表接口
 */

export const findBaseByConditionOfPage = data => fetch('/back-product-web/product/standardUnit/findBaseByConditionOfPage.do', data, 'POST');


/**
 *根据su组合id和su商品id批量保存其关系接口
 */

export const saveStandardUnitCombinationSuAll = data => fetch('/back-product-web/product/standardUnitCombinationSu/saveStandardUnitCombinationSuAll.do', data, 'POST');


/**
 *根据su组合和su关系id删除关系接口
 */

export const deleteStandardUnitCombinationSuWithTx = data => fetch('/back-product-web/product/standardUnitCombinationSu/deleteStandardUnitCombinationSuWithTx.do', data, 'POST');

/**
 *根据su组合与su关系id修改排序接口
 */

export const sortValueByStandardUnitCombinationId = data => fetch('/back-product-web/product/standardUnitCombinationSu/sortValueByStandardUnitCombinationId.do', data, 'POST');


/**
 *根据类目树id查询类目节点信息接口
 */

export const findByCategoryTreeIdNode = data => fetch('/back-product-web/product/categoryTreeNode/findByCategoryTreeId.do', data, 'POST');

/**
 *根据前台类目树节点查询关联的商品组合ID
 */

export const findStandardUnitCombinationByCategoryId = data => fetch('/back-product-web/product/standardUnitCombinationCategory/findStandardUnitCombinationByCategoryId.do', data, 'POST');


/**
 *添加su组合与前台类目节点的关系接口
 */

export const saveStandardUnitCombinationCategoryAll = data => fetch('/back-product-web/product/standardUnitCombinationCategory/saveStandardUnitCombinationCategoryAll.do', data, 'POST');

/**
 *su商品组合标签关系新增接口
 */

export const saveStandardUnitCombinationTag = data => fetch('/back-product-web/product/standardUnitCombinationTag/saveStandardUnitCombinationTag.do', data, 'POST');


/**
 *添加类目节点接口
 */

export const saveCategoryTreeNode = data => fetch('/back-product-web/product/categoryTreeNode/saveCategoryTreeNode.do', data, 'POST');

/**
 *修改类目节点接口
 */

export const updateCategoryTreeNode = data => fetch('/back-product-web/product/categoryTreeNode/updateCategoryTreeNode.do', data, 'POST');


/**
 *根据类目节点id删除类目节点信息接口
 */

export const delByCategoryTreeNodeId = data => fetch('/back-product-web/product/categoryTreeNode/delByCategoryTreeNodeId.do', data, 'POST');


/**
 *根据前台类目节点id查询前台类目节点信息接口
 */

export const findByCategoryTreeNodeId = data => fetch('/back-product-web/product/categoryTreeNode/findByCategoryTreeNodeId.do', data, 'POST');


/**
 *根据前台类目节点id查询后台类目节点id接口
 */

export const findCategoryTreeNodeId = data => fetch('/back-product-web/product/categoryTreeNodeCategory/findCategoryTreeNodeId.do', data, 'POST');

/**
 *批量添加前台类目节点与后台类目节点关系接口（关联方式）
 */

export const insertCategoryTreeNodeCategoryAllWithTx = data => fetch('/back-product-web/product/categoryTreeNodeCategory/insertCategoryTreeNodeCategoryAllWithTx.do', data, 'POST');

/**
 *分页查询商品模版类型接口
 */

export const queryCommodityTemplateOfPage = data => fetch('/back-cms-web/cms/commodityTemplate/queryCommodityTemplateOfPage.do', data, 'POST');


/**
 *根据商品模版id启用商品模版接口
 */

export const showCommodityTemplate = data => fetch('/back-cms-web/cms/commodityTemplate/showCommodityTemplate.do', data, 'POST');


/**
 *分页查询商品模版类型接口
 */

export const templatePage = data => fetch('/back-cms-web/cms/template/templatePage.do', data, 'POST');

/**
 *组件字典列表
 */

export const elementDict = data => fetch('/back-cms-web/cms/element/elementDict.do', data, 'POST');

/**
 *新建空白模板
 */

export const createEmptyTmpl = data => fetch('/back-cms-web/cms/template/createEmptyTmpl.do', data, 'POST');


/**
 *查询所有su分组信息接口
 */

export const queryStandardUnitCombinationAll = data => fetch('/back-product-web/product/standardUnitCombination/queryStandardUnitCombinationAll.do', data, 'POST');


/**
 *根据su商品名称查询所有su商品接口
 */

export const findByStandardUnitName = data => fetch('/back-product-web/product/standardUnit/findByStandardUnitName.do', data, 'POST');

/**
 *查询所有外部链接接口
 */

export const findExternalLinkAll = data => fetch('/back-cms-web/cms/externalLink/findExternalLinkAll.do', data, 'POST');


/**
 *选择轮播图列表
 */

export const queryBannerList = data => fetch('/back-cms-web/cms/banner/queryBannerList.do', data, 'POST');


/**
 *新增/编辑组件和实例
 */

export const saveEleAndInst = data => fetch('/back-cms-web/cms/inst/saveEleAndInst.do', data, 'POST');


/**
 *查询组件和实例详情
 */

export const eleAndInstDetail = data => fetch('/back-cms-web/cms/inst/eleAndInstDetail.do', data, 'POST');

/**
 * 查询模板结构
 */

export const templateConstruct = data => fetch('/back-cms-web/cms/template/templateConstruct.do', data, 'POST');

/**
 * 查询实例内容
 */

export const instContent = data => fetch('/back-cms-web/cms/inst/instContent.do', data, 'POST');

/**
 *我的体检轮播图列表接口
 */

export const queryBannerListByType = data => fetch('/back-cms-web/cms/banner/queryBannerListByType.do', data, 'POST');

/**
 *查询模板详情
 */

export const templateDetail = data => fetch('/back-cms-web/cms/template/templateDetail.do', data, 'POST');

/**
 *查询商城模板详情
 */

export const templateInstContent = data => fetch('/back-cms-web/cms/template/templateInstContent.do', data, 'POST');

/**
 *删除组件
 */

export const deleteElement = data => fetch('/back-cms-web/cms/element/deleteElement.do', data, 'POST');


/**
 *启用模板
 */

export const useTemplate = data => fetch('/back-cms-web/cms/template/useTemplate.do', data, 'POST');



/**
 *新增/编辑模板
 */

export const saveTemplate = data => fetch('/back-cms-web/cms/template/saveTemplate.do', data, 'POST');


/**
 *本地参数配置
 */

export const localParamList = data => fetch('/back-cms-web/cms/localParam/localParamList.do', data, 'POST');


/**
 *根据类型选择商品模版接口
 */

export const findCommodityTemplateByType = data => fetch('/back-cms-web/cms/commodityTemplate/findCommodityTemplateByType.do', data, 'POST');


/**
 *分页查询所有标签接口
 */

export const findTagOfPage = data => fetch('/back-product-web/product/tag/findTagOfPage.do', data, 'POST');

/**
 *新增标签
 */

export const insertTagWithTx = data => fetch('/back-product-web/product/tag/insertTagWithTx.do', data, 'POST');

/**
 *根据标签id修改标签接口
 */

export const updateTagByIdWithTx = data => fetch('/back-product-web/product/tag/updateTagByIdWithTx.do', data, 'POST');

/**
 *根据标签id清除记录
 */

export const tagClearRecordByTagId = data => fetch('/back-product-web/product/tag/tagClearRecordByTagId.do', data, 'POST');

/**
 *根据标签id查询标签信息接口
 */

export const findTagById = data => fetch('/back-product-web/product/tag/findTagById.do', data, 'POST');

/**
 *根据标签id启用停用标签接口
 */

export const updateTagTypeByIdWithTx = data => fetch('/back-product-web/product/tag/updateTagTypeByIdWithTx.do', data, 'POST');


/**
 *分页查询所有运费模版信息接口
 */

export const findFreightTemplateOfPage = data => fetch('/back-product-web/product/freightTemplate/findFreightTemplateOfPage.do', data, 'POST');

/**
 *添加运费模版接口
 */

export const insertFreightTemplateWithTx = data => fetch('/back-product-web/product/freightTemplate/insertFreightTemplateWithTx.do', data, 'POST');

/**
 *根据运费模版id修改运费模版接口
 */

export const updateFreightTemplateByIdWithTx = data => fetch('/back-product-web/product/freightTemplate/updateFreightTemplateByIdWithTx.do', data, 'POST');

/**
 *根据运费模版id查询运费模版信息接口
 */

export const findFreightTemplateById = data => fetch('/back-product-web/product/freightTemplate/findFreightTemplateById.do', data, 'POST');


/**
 *根据运费模版id启用运费模版接口
 */

export const startFreightTemplateWithTx = data => fetch('/back-product-web/product/freightTemplate/startFreightTemplateWithTx.do', data, 'POST');


/**
 *根据商家id查询启用运费模版接口
 */

export const freightTemplateByMerchantId = data => fetch('/back-product-web/product/freightTemplate/freightTemplateByMerchantId.do', data, 'POST');



/**
 *查询日志列表或单个对象的日志集合
 */

export const findLogInfoOfPage = data => fetch('/back-log-web/log/log/findLogInfoOfPage.do', data, 'POST');


/**
 *查询日志字典
 */

export const findAllLogDict = data => fetch('/back-log-web/log/logDict/findAllLogDict.do', data, 'POST');


/**
 *查询所有管理员用户接口
 */

export const userAdminAll = data => fetch('/back-user-web/user/userExtend/userAdminAll.do', data, 'POST');



/**
 *优惠卷列表
 */

export const findCouponOfPage = data => fetch('/back-promotion-web/promotion/coupon/findCouponOfPage.do', data, 'POST');


/**
 *模糊查询su分组信息
 */

export const findStandardUnitCombinationAllByBlurry = data => fetch('/back-product-web/product/standardUnitCombination/findStandardUnitCombinationAllByBlurry.do', data, 'POST');


/**
 *查询优惠卷的相关商品
 */

export const findCouponGoodsAll = data => fetch('/back-promotion-web/promotion/coupon/findCouponGoodsAll.do', data, 'POST');

/**
 *优惠卷的所属公司列表
 */

export const findCouponCompanyOfPage = data => fetch('/back-promotion-web/promotion/coupon/findCouponCompanyOfPage.do', data, 'POST');

/**
 *优惠卷的商品列表
 */

export const queryStandardUnitListByBlurry = data => fetch('/back-product-web/product/standardUnit/queryStandardUnitListByBlurry.do', data, 'POST');


/**
 *优惠卷新增或编辑
 */

export const insertOrUpdateCouponWithTx = data => fetch('/back-promotion-web/promotion/coupon/insertOrUpdateCouponWithTx.do', data, 'POST');

/**
 *优惠卷新增或编辑
 */

export const deleteCouponWithTx = data => fetch('/back-promotion-web/promotion/coupon/deleteCouponWithTx.do', data, 'POST');

/**
 *通过id查询优惠卷详情
 */

export const findCouponById = data => fetch('/back-promotion-web/promotion/coupon/findCouponById.do', data, 'POST');

/**
 *新建或编辑优惠卷批次
 */

export const insertOrUpdateCouponBatchWithTx = data => fetch('/back-promotion-web/promotion/couponBatch/insertOrUpdateCouponBatchWithTx.do', data, 'POST');

/**
 *通过id查询优惠卷分组详情
 */

export const findCouponGroupById = data => fetch('/back-promotion-web/promotion/couponGroup/findCouponGroupById.do', data, 'POST');


/**
 *优惠卷分组列表
 */

export const findCouponGroupOfPage = data => fetch('/back-promotion-web/promotion/couponGroup/findCouponGroupOfPage.do', data, 'POST');


/**
 *删除优惠卷分组
 */

export const deleteCouponGroupWithTx = data => fetch('/back-promotion-web/promotion/couponGroup/deleteCouponGroupWithTx.do', data, 'POST');

/**
 *优惠卷批次列表
 */

export const findCouponBatchOfPage = data => fetch('/back-promotion-web/promotion/couponBatch/findCouponBatchOfPage.do', data, 'POST');

/**
 *查询优惠卷批次已选择的员工
 */

export const findEmployeeByCouponBatch = data => fetch('/back-promotion-web/promotion/couponBatch/findEmployeeByCouponBatch.do', data, 'POST');


/**
 *创建或更新优惠卷分组
 */

export const insertOrUpdateCouponGroupWithTx = data => fetch('/back-promotion-web/promotion/couponGroup/insertOrUpdateCouponGroupWithTx.do', data, 'POST');



/**
 *分页显示限购规则接口
 */

export const findLimitRuleOfPage = data => fetch('/back-order-web/order/limitRule/findLimitRuleOfPage.do', data, 'POST');

/**
 *新增限购规则信息接口
 */

export const insertLimitRuleWithTx = data => fetch('/back-order-web/order/limitRule/insertLimitRuleWithTx.do', data, 'POST');

/**
 *根据限购规则id查询限购规则信息接口
 */

export const findLimitRuleById = data => fetch('/back-order-web/order/limitRule/findLimitRuleById.do', data, 'POST');

/**
 *根据限购规则Id修改限购规则信息接口
 */

export const updateLimitRuleByIdWithTx = data => fetch('/back-order-web/order/limitRule/updateLimitRuleByIdWithTx.do', data, 'POST');

/**
 *根据限购规则id及状态启用停用限购规则接口
 */

export const isLimitRuleStartWithTx = data => fetch('/back-order-web/order/limitRule/isLimitRuleStartWithTx.do', data, 'POST');


/**
 *分页查询限购记录接口
 */

export const findLimitRuleRecordOfPage = data => fetch('/back-order-web/order/limitRuleRecord/findLimitRuleRecordOfPage.do', data, 'POST');

/**
 *分页显示热搜信息接口
 */

export const findTopSearchOfPage = data => fetch('/back-product-web/product/topSearch/findTopSearchOfPage.do', data, 'POST');


/**
 *新增热搜信息接口
 */

export const insertTopSearchWithTx = data => fetch('/back-product-web/product/topSearch/insertTopSearchWithTx.do', data, 'POST');


/**
 *根据热搜id更新热搜信息接口
 */

export const updateTopSearchByIdWithTx = data => fetch('/back-product-web/product/topSearch/updateTopSearchByIdWithTx.do', data, 'POST');


/**
 *根据热搜id查询热搜信息接口
 */

export const findTopSearchById = data => fetch('/back-product-web/product/topSearch/findTopSearchById.do', data, 'POST');

/**
 *根据热搜id启用停用热搜信息接口
 */

export const startStopTopSearch = data => fetch('/back-product-web/product/topSearch/startStopTopSearch.do', data, 'POST');


/**
 *新增或编辑导航栏标签
 */

export const insertOrUpdateNavigationLableWithTx = data => fetch('/back-cms-web/cms/navigationBar/insertOrUpdateNavigationLableWithTx.do', data, 'POST');

/**
 *删除导航栏标签
 */

export const deleteNavigationLableWithTx = data => fetch('/back-cms-web/cms/navigationBar/deleteNavigationLableWithTx.do', data, 'POST');


/**
 *查询导航栏标签详情通过id
 */

export const findNavigationLableById = data => fetch('/back-cms-web/cms/navigationBar/findNavigationLableById.do', data, 'POST');

/**
 *新增或编辑导航栏
 */

export const insertOrUpdateNavigationBarWithTx = data => fetch('/back-cms-web/cms/navigationBar/insertOrUpdateNavigationBarWithTx.do', data, 'POST');

/**
 *导航栏列表
 */

export const findNavigationBarOfPage = data => fetch('/back-cms-web/cms/navigationBar/findNavigationBarOfPage.do', data, 'POST');


/**
 *查询导航栏详情通过id
 */

export const findNavigationBarById = data => fetch('/back-cms-web/cms/navigationBar/findNavigationBarById.do', data, 'POST');



/**
 *删除导航栏详情通过id
 */

export const deleteNavigationBarWithTx = data => fetch('/back-cms-web/cms/navigationBar/deleteNavigationBarWithTx.do', data, 'POST');



/**
 *重置轮播图的状态(停用/启用)
 */

export const resetBannerStatusById = data => fetch('/back-cms-web/cms/banner/resetBannerStatusById.do', data, 'POST');

/**
 *分页tab列表
 */

export const findPageTabOfPage = data => fetch('/back-cms-web/cms/pageTab/findPageTabOfPage.do', data, 'POST');

/**
 *新增或编辑分页tab
 */

export const insertOrUpdatePageTabWithTx = data => fetch('/back-cms-web/cms/pageTab/insertOrUpdatePageTabWithTx.do', data, 'POST');

/**
 *新增或编辑分页tab
 */

export const findPageTabById = data => fetch('/back-cms-web/cms/pageTab/findPageTabById.do', data, 'POST');


/**
 *通过模版id查询tab分页
 */

export const findSimplePageTabAll = data => fetch('/back-cms-web/cms/pageTab/findSimplePageTabAll.do', data, 'POST');

/**
 *通过模版id查询tab分页
 */

export const deletePageTabWithTx = data => fetch('/back-cms-web/cms/pageTab/deletePageTabWithTx.do', data, 'POST');


/**
 *通过模版id查询tab分页
 */

export const findCmsDictByParentId = data => fetch('/back-cms-web/cms/cmsDict/findCmsDictByParentId.do', data, 'POST');


/**
 *消息模版分页查询接口
 */

export const findInfoTemplateOfPage = data => fetch('/back-user-web/user/infoTemplate/findInfoTemplateOfPage.do', data, 'POST');


/**
 *查询所有消息发送方式接口
 */

export const findSendWayTypeAll = data => fetch('/back-user-web/user/sendWayType/findSendWayTypeAll.do', data, 'POST');


/**
 *根据消息模版id查询消息模版信息
 */

export const findInfoTemplateById = data => fetch('/back-user-web/user/infoTemplate/findInfoTemplateById.do', data, 'POST');


/**
 *根据消息模版id查询消息模版信息
 */

export const findInfoTemplateParameterAll = data => fetch('/back-user-web/user/infoTemplateParameter/findInfoTemplateParameterAll.do', data, 'POST');

/**
 *根据消息模版id修改消息模版信息接口
 */

export const updateInfoTemplateByIdWithTx = data => fetch('/back-user-web/user/infoTemplate/updateInfoTemplateByIdWithTx.do', data, 'POST');

/**
 *根据消息模版id启用停用消息模版
 */

export const isStartByIdWithTx = data => fetch('/back-user-web/user/infoTemplate/isStartByIdWithTx.do', data, 'POST');

/**
 *消息列表接口
 */

export const findInfoOfPage = data => fetch('/back-user-web/user/info/findInfoOfPage.do', data, 'POST');

/**
 *通过轮播图id查询公司列表
 */

export const queryCompanyListByBannerId = data => fetch('/back-cms-web/cms/banner/queryCompanyListByBannerId.do', data, 'POST');

/**
 *通过导航栏id查询公司信息
 */

export const findNavigationBarCompanyOfPage = data => fetch('/back-cms-web/cms/navigationBar/findNavigationBarCompanyOfPage.do', data, 'POST');


/**
 *群发消息接口
 */

export const insertInfoWithTx = data => fetch('/back-user-web/user/info/insertInfoWithTx.do', data, 'POST');


/**
 *群发消息接口
 */

export const findUserInfoOfPage = data => fetch('/back-user-web/user/userInfo/findUserInfoOfPage.do', data, 'POST');


/**
 *查询所有已配置的第三方支付方式
 */

export const findAllClientPayType = data => fetch('/back-cms-web/cms/clientPayTypeConfig/findAllClientPayType.do', data, 'POST');

/**
 *获取修改前收货地址数据
 */

export const receiverAddressById = data => fetch('/back-order-web/order/backStage/receiverAddressById.do', data, 'POST');

/**
 *提交修改后收货地址数据
 */

export const updateAddressCreateByBackStage = data => fetch('/back-order-web/order/backStage/updateAddressCreateByBackStage.do', data, 'POST');

/**
 *根据clientid获取客户端全部配置信息
 */

export const findClientPayTypeByClientId = data => fetch('/back-cms-web/cms/clientPayTypeConfig/findClientPayTypeByClientId.do', data, 'POST');

/**
 *更新客户端的第三方支付方式配置
 */

export const updateClientPayTypeByClientId = data => fetch('/back-cms-web/cms/clientPayTypeConfig/updateClientPayTypeByClientId.do', data, 'POST');

/**
 *新增店铺
 */

export const insertStoreTreeNodeWithTx = data => fetch('/back-product-web/product/storeTreeNode/insertStoreTreeNodeWithTx.do', data, 'POST');


/**
 *总店列表
 */

export const findStoreAllInfo = data => fetch('/back-product-web/product/store/findStoreAllInfo.do', data, 'POST');

/**
 *总店列表
 */

export const findChannelAll = data => fetch('/back-user-web/user/channel/findChannelAll.do', data, 'POST');

/**
 *根据门店id查询门店菜单列表接口
 */

export const findByStoreIdOfPage = data => fetch('/back-product-web/product/storeMenuNode/findByStoreIdOfPage.do', data, 'POST');


/**
 *根据门店id查询门店菜单列表接口
 */

export const insertStoreMenuNodeWithTx = data => fetch('/back-product-web/product/storeMenuNode/insertStoreMenuNodeWithTx.do', data, 'POST');

/**
 *根据门店菜单id修改门店菜单分类接口
 */

export const updateStoreMenuNodeByIdWithTx = data => fetch('/back-product-web/product/storeMenuNode/updateStoreMenuNodeByIdWithTx.do', data, 'POST');


/**
 *根据门店菜单id查询门店菜单信息接口
 */

export const findStoreMenuNodeById = data => fetch('/back-product-web/product/storeMenuNode/findStoreMenuNodeById.do', data, 'POST');


/**
 *根据门店菜单id查询门店菜单信息接口
 */

export const findStandardUnitStoreAll = data => fetch('/back-product-web/product/standardUnitStore/findStandardUnitStoreAll.do', data, 'POST');

/**
 *根据门店菜单id添加su商品关系接口
 */

export const insertAllWithTx = data => fetch('/back-product-web/product/storeMenuNodeStandardUnit/insertAllWithTx.do', data, 'POST');

/**
 *根据门店菜单id删除门店菜单接口
 */

export const deleteStoreMenuNodeWithTx = data => fetch('/back-product-web/product/storeMenuNode/deleteStoreMenuNodeWithTx.do', data, 'POST');



/**
 *查询所属门店接口
 */

export const findCouponStore = data => fetch('/back-product-web/product/store/findCouponStore.do', data, 'POST');

/**
 *查询已选择门店接口
 */

export const findCouponStoreOfPage = data => fetch('/back-product-web/product/store/findCouponStoreOfPage.do', data, 'POST');


/**
 *查询已选择门店接口
 */

export const standardUnitStoreByStandardUnitId = data => fetch('/back-product-web/product/standardUnitStore/standardUnitStoreByStandardUnitId.do', data, 'POST');

/**
 *根据门店id查询商品接口
 */

export const findStandardUnitStoreOfPage = data => fetch('/back-product-web/product/standardUnitStore/findStandardUnitStoreOfPage.do', data, 'POST');


/**
 *根据门店id查询商品接口
 */

export const findStoreProductUnitOfPage = data => fetch('/back-product-web/product/storeProductUnit/findStoreProductUnitOfPage.do', data, 'POST');

/**
 *根据id修改店铺信息
 */

export const updateStoreByIdWithTx = data => fetch('/back-product-web/product/store/updateStoreByIdWithTx.do', data, 'POST');

/**
 *总店列表
 */

export const findRootStoreAll = data => fetch('/back-product-web/product/store/findRootStoreAll.do', data, 'POST');

/**
 *根据门店树的id查询下面所有店铺信息
 */

export const findStoreAllByTreeId = data => fetch('/back-product-web/product/store/findStoreAllByTreeId.do', data, 'POST');

/**
 *根据id查找店铺详情
 */

export const findStoreById = data => fetch('/back-product-web/product/store/findStoreById.do', data, 'POST');


/**
 *门店库存变动申请接口
 */

export const insertStoreStockChangeApplyWithTx = data => fetch('/back-stock-web/stock/storeStockChangeApply/insertStoreStockChangeApplyWithTx.do', data, 'POST');


/**
 *根据类型查询字典消息接口
 */

export const findStockDictAll = data => fetch('/back-stock-web/stock/stockDict/findStockDictAll.do', data, 'POST');

/**
 *分页查询门店库存变更信息接口
 */

export const findStoreStockChangeApplyOfPage = data => fetch('/back-stock-web/stock/storeStockChangeApply/findStoreStockChangeApplyOfPage.do', data, 'POST');


/**
 *分页查询门店库存变更信息接口
 */

export const findStorePuStockRunningWaterOfPage = data => fetch('/back-stock-web/stock/storePuStockRunningWater/findStorePuStockRunningWaterOfPage.do', data, 'POST');


/**
 *根据门店pu库存变动id查看凭证接口
 */

export const findStoreStockChangeApplyPictureAll = data => fetch('/back-stock-web/stock/storeStockChangeApplyPicture/findStoreStockChangeApplyPictureAll.do', data, 'POST');

/**
 *根据门店库存申请id同意或拒绝接口
 */

export const updateStoreStockChangeApplyByIdWithTx = data => fetch('/back-stock-web/stock/storeStockChangeApply/updateStoreStockChangeApplyByIdWithTx.do', data, 'POST');

/**
 *管理员列表
 */

export const userStoreAdmin = data => fetch('/back-user-web/user/userExtend/userStoreAdmin.do', data, 'POST');


/**
 *卡券unit状态[有效/失效]设置接口
 */

export const setStatus = data => fetch('/back-promotion-web/promotion/eCard/setStatus.do', data, 'POST');

/**
 *根据tagId查询商品详情列表
 */

export const queryMpByTagId = data => fetch('/back-product-web/product/tag/queryMpByTagId.do', data, 'POST');

/**
 *标签所关联的商品列表
 */

export const findCommodityDetailsOfPage = data => fetch('/back-product-web/product/merchantProduct/findCommodityDetailsOfPage.do', data, 'POST');

/**
 *商品标签页删除引用关联关系
 */

export const delMpTagInfo = data => fetch('/back-product-web/product/tag/delMpTagInfo.do', data, 'POST');

/**
 *分页显示渠道信息接口
 */

export const findChannelActivityOfPage = data => fetch('/back-user-web/user/channelActivity/findChannelActivityOfPage.do', data, 'POST');

/**
 *渠道活动新增接口
 */

export const insertChannelActivityWithTx = data => fetch('/back-user-web/user/channelActivity/insertChannelActivityWithTx.do', data, 'POST');


/**
 *根据渠道id修改渠道活动信息接口
 */

export const updateChannelActivityByIdWithTx = data => fetch('/back-user-web/user/channelActivity/updateChannelActivityByIdWithTx.do', data, 'POST');

/**
 *商品详情展示
 */

export const querySuByCategoryTreeNodeIds = data => fetch('/back-product-web/product/standardUnit/querySuByCategoryTreeNodeIds.do', data, 'POST');

/**
 *商品组合关联前台类目树,商品组合列表展示
 */

export const findSucTitleOfPage = data => fetch('/back-product-web/product/standardUnitCombination/findSucTitleOfPage.do', data, 'POST');

/**
 *根据条件查询会籍列表
 */

export const findMembershipOfPage = data => fetch('/back-product-web/product/membership/findMembershipOfPage.do', data, 'POST');

/**
 *根据会籍id查询权限信息
 */

export const findMembershipAuthorityByMembershipId = data => fetch('/back-product-web/product/membershipAuthority/findMembershipAuthorityByMembershipId.do', data, 'POST');

/**
 *更新会籍详情
 */

export const updateMembershipAuthorityByMembershipId = data => fetch('/back-product-web/product/membershipAuthority/updateMembershipAuthorityByMembershipId.do', data, 'POST');

/**
 *根据会籍id查询会籍详情
 */

export const findMembershipById = data => fetch('/back-product-web/product/membership/findMembershipById.do', data, 'POST');

/**
 *查询所有的会籍sku
 */

export const getMembershipSkuVO = data => fetch('/back-product-web/product/sku/getMembershipSkuVO.do', data, 'POST');

/**
 *查询拥有会籍的所有用户
 */

export const findMembershipUserAll = data => fetch('/back-product-web/product/membershipUser/findMembershipUserAll.do', data, 'POST');

/**
 *设置会员会籍失效
 */

export const stopUserMembership = data => fetch('/back-product-web/product/membershipUser/stopUserMembership.do', data, 'POST');

/**
 *延长有效期
 */

export const extendUserMembershipDate = data => fetch('/back-product-web/product/membershipUser/extendUserMembershipDate.do', data, 'POST');

/**
 *导入会员
 */

export const membershipUserImport = data => fetch('/back-product-web/product/membershipUser/membershipUserImport.do', data, 'POST');

/**
 *确定导入会员
 */

export const assureMembershipUserImport = data => fetch('/back-product-web/product/membershipUser/assureMembershipUserImport.do', data, 'POST');

/**
 *前台目录树关联后台目录树,商品组合
 */

export const insertCtnAndSuc = data => fetch('/back-product-web/product/categoryTreeNodeCategory/insertCtnAndSuc.do', data, 'POST');

/**
 *前台目录树关联后台目录树,商品组合
 */

export const insertStoreAdminWithTx = data => fetch('/back-user-web/user/storeAdmin/manageStoreAdminWithTx.do', data, 'POST');


/**
 *根据渠道id和活动id更新rdid接口
 */

export const updateRdidByChannelIdCampaignId = data => fetch('/back-user-web/user/qrCode/updateRdidByChannelIdCampaignId.do', data, 'POST');


/**
 *根据渠道id和活动id查询rdid接口
 */

export const findRdidByChannelIdCampaignId = data => fetch('/back-user-web/user/qrCode/findRdidByChannelIdCampaignId.do', data, 'POST');

/**
 * 手动输入外部skuid
 */

export const updateExternalSkuIdBackStage = data => fetch('/back-product-web/product/sku/updateExternalSkuIdBackStage.do', data, 'POST');

/**
 * 手动输入外部skuid或者条形码
 */

export const updateSkuParamsBackStage = data => fetch('/back-product-web/product/sku/updateSkuParamsBackStage.do', data, 'POST');

/**
 * 查询运营方列表
 */

export const findMerchantOfPage = data => fetch('/back-product-web/product/merchant/findMerchantOfPage.do', data, 'POST');

/**
 * 新增/编辑运营方
 */

export const insertMerchantWithTx = data => fetch('/back-product-web/product/merchant/insertMerchantWithTx.do', data, 'POST');

/**
 * 运营方设置停用
 */

export const updateMerchantStopByIdWithTx = data => fetch('/back-product-web/product/merchant/updateMerchantStopByIdWithTx.do', data, 'POST');

/**
 * 获取所有已启用的运营方
 */
export const findStartedMerchantList = data => fetch('/back-product-web/product/merchant/findStartedMerchantList.do', data, 'POST');

/**
 * 根据渠道查询活动列表
 */
export const findChannelActivityByChannelId = data => fetch('/back-user-web/user/channelActivity/findChannelActivityByChannelId.do', data, 'POST');

/**
 * 导出couponUnit集合
 */
export const exportCouponUnit = data => fetch('/back-promotion-web/promotion/couponBatch/exportCouponUnit.do', data, 'POST');

/**
 * 分页查询以旧换新活动列表
 */
export const findExchangeOfPage = data => fetch('/back-promotion-web/promotion/exchangeActivity/findExchangeActivityOfPage.do', data, 'POST');

/**
 * 模糊查询以旧换新活动列表
 */
export const searchExchangeOfPage = data => fetch('/back-promotion-web/promotion/exchangeActivity/fuzzQueryExchangeActivityOfPage.do', data, 'POST');

/**
 * 列表查询新/旧批次
 */
export const findExchangeBatchOfPage = data => fetch('/back-promotion-web/promotion/exchangeBatch/findExchangeBatchOfPage.do', data, 'POST');

/**
 * 新增查询新/旧批次
 */
export const findCouponBatchByParam = data => fetch('/back-promotion-web/promotion/couponBatch/findCouponBatchByParam.do', data, 'POST');

/**
 * 编辑规则说明
 */
export const updateRuleDescriptionByIdWithTx = data => fetch('/back-promotion-web/promotion/ruleDescription/updateRuleDescriptionByIdWithTx.do', data, 'POST');

/**
 * 查询规则说明
 */
export const findRuleDescription = data => fetch('/back-promotion-web/promotion/ruleDescription/findRuleDescription.do', data, 'POST');

/**
 * 新增/编辑以旧换新活动
 */
export const addNewActWithTx = data => fetch('/back-promotion-web/promotion/exchangeActivity/insertOrUpdateExchangeActivityWithTx.do', data, 'POST');

/**
 * 分页查询以旧换新活动兑换记录
 */
export const findExchangeOrderRecordOfPage = data => fetch('/back-promotion-web/promotion/exchangeOrderRecord/findExchangeOrderRecordOfPage.do', data, 'POST');

/**
 * 模糊查询以旧换新活动兑换记录
 */
export const fuzzyQueryExchangeOrderRecordOfPage = data => fetch('/back-promotion-web/promotion/exchangeOrderRecord/fuzzyQueryExchangeOrderRecordOfPage.do', data, 'POST');

/**
 * 停用或启用以旧换新活动
 */
export const updateExchangeActivityStatus = data => fetch('/back-promotion-web/promotion/exchangeActivity/updateExchangeActivityStatus.do', data, 'POST');

/**
 * 查询所有商品列表页模板
 */
export const findCmsTemplateOfPage = data => fetch('/back-cms-web/cms/cmsTemplate/findCmsTemplateOfPage.do', data, 'POST');

/**
 * 编辑以旧换新活动
 */
export const findExchangeActivity = data => fetch('/back-promotion-web/promotion/exchangeActivity/findExchangeActivity.do', data, 'POST');

/**
 * 获取cms模板详情
 */
export const findCmsTemplateById = data => fetch('/back-cms-web/cms/cmsTemplate/findCmsTemplateById.do', data, 'POST');

/**
 * 获取版本信息列表
 */
export const findVersionsAll = data => fetch('/back-user-web/user/versions/findVersionsAll.do', data, 'POST');

/**
 * 新增/编辑cms模板
 */
export const updateCmsTemplateByIdWithTx = data => fetch('/back-cms-web/cms/cmsTemplate/updateCmsTemplateByIdWithTx.do', data, 'POST');

/**
 * 根据模板ID查询模板下所有组件的配置项
 */
export const findCfgKeyByTemplateId = data => fetch('/back-cms-web/cms/cmsCfgKey/findCfgKeyByTemplateId.do', data, 'POST');

/**
 * 添加模板page页面接口
 */
export const insertCmsPageWithTx = data => fetch('/back-cms-web/cms/cmsPage/insertCmsPageWithTx.do', data, 'POST');

/**
 * 通过客户端类型查询商品页列表
 */
export const findCmsPageAllByClientType = data => fetch('/back-cms-web/cms/cmsPage/findCmsPageAllByClientType.do', data, 'POST');

/**
 * 通过客户端类型查询商品页列表
 */
export const findCmsPageAll = data => fetch('/back-cms-web/cms/cmsPage/findCmsPageAll.do', data, 'POST');

/**
 * 通过客户端类型查询商品页列表
 */
export const findCmsTemplateAll = data => fetch('/back-cms-web/cms/cmsTemplate/findCmsTemplateAll.do', data, 'POST');

/**
 * 分页查询所有商品模板列表页面
 */
export const findCmsPageOfPage = data => fetch('/back-cms-web/cms/cmsPage/findCmsPageOfPage.do', data, 'POST');

/**
 * 更新page页面接口
 */
export const updateCmsPageByIdWithTx = data => fetch('/back-cms-web/cms/cmsPage/updateCmsPageByIdWithTx.do', data, 'POST');

/**
 * 查询所有spu接口
 */
export const getAllSpuList = data => fetch('/back-product-web/product/standardProductUnit/findStandardProductUnitAll.do', data, 'POST');

/**
 * 分页查询关联组列表
 */
export const findContactGroupStockMapOfPage = data => fetch('/back-stock-web/stock/contactGroup/findContactGroupStockMapOfPage.do', data, 'POST');

/**
 * 修改关联组名
 */
export const updateContactGroup = data => fetch('/back-stock-web/stock/contactGroup/updateContactGroup.do', data, 'POST');

/**
 * 添加关联组
 */
export const addContactGroup = data => fetch('/back-stock-web/stock/contactGroup/addContactGroup.do', data, 'POST');

/**
 * 根据merchantId 查询运营方下所有su
 */
export const findSuListOfPageByMerchantId = data => fetch('/back-stock-web/stock/contactGroup/findSuListOfPageByMerchantId.do', data, 'POST');

/**
 * 根据id查询关联组
 */
export const findContactGroupById = data => fetch('/back-stock-web/stock/contactGroup/findContactGroupById.do', data, 'POST');

/**
 * 共用库存确认关联
 */
export const confirmContact = data => fetch('/back-stock-web/stock/contactGroup/confirmContact.do', data, 'POST');

/**
 * 共用库存解散关联
 */
export const cancelContact = data => fetch('/back-stock-web/stock/contactGroup/cancelContact.do', data, 'POST');

/**
 * 共用库存取消关联
 */
export const cancelSuContact = data => fetch('/back-stock-web/stock/contactGroup/cancelSuContact.do', data, 'POST');

/**
 * 共用库存所有可关联产品
 */
export const conditionStandardProductUnitAll = data => fetch('/back-product-web/product/standardProductUnit/conditionStandardProductUnitAll.do', data, 'POST');

/**
 * 共用库存关联商品加锁
 */
export const tryLock = data => fetch('/back-stock-web/stock/contactGroup/tryLock.do', data, 'POST');

/**
 * 解除共享库存锁
 */
export const releaseDistributedLock = data => fetch('/back-stock-web/stock/contactGroup/releaseDistributedLock.do', data, 'POST');

/**
 * 查询cms组件列表
 */
export const findCmsElement = data => fetch('/back-cms-web/cms/cmsTemplate/findCmsElement.do', data, 'POST');

/**
 * 根据id查询cms组件列表
 */
export const findCmsElementById = data => fetch('/back-cms-web/cms/cmsTemplate/findCmsElementById.do', data, 'POST');


/**
 * 新增cms模板页
 */
export const insertCmsTemplateWithTx = data => fetch('/back-cms-web/cms/cmsTemplate/insertCmsTemplateWithTx.do', data, 'POST');

/**
 * 优惠券unit批量置失效
 */
export const updateCouponUnitStatus = data => fetch('/back-promotion-web/promotion/couponBatch/updateCouponUnitStatus.do', data, 'POST');

/**
 * 恢复企业和员工账户金额
 */
export const recoverAccountBalance = data => fetch('/back-account-web/account/accountBackStage/recoverAccountBalance.do', data, 'POST');

/**
 * 进行企业账户有效性操作时上锁
 */
export const AccountDisabledLock = data => fetch('/back-account-web/account/accountBackStage/AccountDisabledLock.do', data, 'POST');

/**
 * 释放账户锁
 */
export const releaseAccountLock = data => fetch('/back-account-web/account/accountBackStage/releaseAccountLock.do', data, 'POST');

/**
 * 启用停用模板接口
 */
export const updateStatusTemp = data => fetch('/back-cms-web/cms/cmsTemplate/updateStatus.do', data, 'POST');

/**
 * 启用停用页面接口
 */
export const updateStatusPage = data => fetch('/back-cms-web/cms/cmsPage/updateStatus.do', data, 'POST');

/**
 * 跳转配置
 */
export const findCmsLocalParamAll = data => fetch('/back-cms-web/cms/cmsLocalParam/findCmsLocalParamAll.do', data, 'POST');

/**
 * 查询分页tab列表接口
 */
export const findCmsPageTabAll = data => fetch('/back-cms-web/cms/cmsPageTab/findCmsPageTabAll.do', data, 'POST');

/**
 * 编辑tab页信息
 */
export const updateCmsPageTabByIdWithTx = data => fetch('/back-cms-web/cms/cmsPageTab/updateCmsPageTabByIdWithTx.do', data, 'POST');

/**
 *查询前50条pu接口
 */
export const findCommodityProductUnitLimit = data => fetch('/back-product-web/product/commodityProductUnit/findCommodityProductUnitLimit.do', data, 'POST');

/**
 *门店列表接口
 */
export const findStoreByPlatformId = data => fetch('/back-product-web/product/store/findStoreByPlatformId.do', data, 'POST');

/**
 *根据用户Id查询登陆记录
 */
export const userLoginList = data => fetch('/back-user-web/user/userLogin/userLoginList.do', data, 'POST');

/**
 *批量导出用户登陆记录
 */
export const userLoginByUserIds = data => fetch('/back-user-web/user/userLogin/userLoginByUserIds.do', data, 'POST');

/**
 *skuList导出
 */
export const excelExport = data => fetch('/back-product-web/product/sku/excelExport.do', data, 'GET');
