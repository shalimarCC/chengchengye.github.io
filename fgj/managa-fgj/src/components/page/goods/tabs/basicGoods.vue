<template>
    <div>
        <el-form label-width="120px" style="padding:20px 200px;min-width:400px;">
            <el-form-item label="产品编号" style="text-align:left;">
                <span class="text">{{basicGoodsData.merchantProduct.productSerialNumber}}</span>
            </el-form-item>

            <el-form-item label="产品类目" style="text-align:left;">
                <span class="text">{{basicGoodsData.merchantProduct.productCategory}}</span>
            </el-form-item>

            <el-form-item label="产品名称" style="text-align:left;">
                <span class="text">{{basicGoodsData.merchantProduct.standardProductUnitName}}</span>
            </el-form-item>

        </el-form>

        <el-form label-width="120px" ref="basicGoodsData.merchantProduct" :model="basicGoodsData.merchantProduct"  :rules="merchantProductRules" style="padding:0 200px;min-width:400px;">
            <el-form-item label="商品名称" style="text-align:left;" prop="name">
                <el-tooltip class="item" effect="dark" content="电子卡券名称不得超出8位字符" placement="right">
                    <el-input v-model="basicGoodsData.merchantProduct.name"></el-input>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="前端编号" style="text-align:left;" prop="frontSerialNumber">
                <el-input v-model="merchantProduct.frontSerialNumber" placeholder="最大不超过999999"></el-input>
            </el-form-item>

            <el-form-item label="商品标签" style="text-align:left;">
                <el-tag
                :key="tag.id"
                v-for="(tag,key) in checkLabel"
                closable
                @close="tagClose(key)">
                {{tag.name}}
                </el-tag>

                <el-button class="button-new-tag" size="small" @click="addLabel">+ 添加标签</el-button>
            </el-form-item>

            <el-form-item label="所属总店" style="text-align:left;">
                <el-select v-model="merchantProduct.storeId" collapse-tags :disabled="merchantProduct.status==3 || merchantProduct.status==4">
                    <el-option
                        v-for="item in storeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary" plain size="small" @click="findStoreAllByTreeId">配置门店</el-button>
            </el-form-item>

            <el-form-item label="搜索关键词" style="text-align:left;">
                <el-select v-model="merchantProduct.isSpuKeyword">
                    <el-option
                        v-for="item in keywordTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>

                <div v-if="merchantProduct.isSpuKeyword==3||merchantProduct.isSpuKeyword==2">
                    <el-tag
                    :key="tag"
                    v-for="tag in keyWordList">
                    {{tag}}
                    </el-tag>
                </div>

                <div v-if="merchantProduct.isSpuKeyword==4||merchantProduct.isSpuKeyword==2">
                    <el-tag
                    :key="tag"
                    v-for="tag in merchantProduct.keywordList"
                    closable
                    :disable-transitions="false"
                    @close="handleClose1(tag)">
                    {{tag}}
                    </el-tag>
                    <el-input
                    class="input-new-tag"
                    maxlength="8"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加关键词</el-button>
                </div>

            </el-form-item>

            <el-form-item label="市场价格" style="text-align:left;" prop="marketPrice">
                <el-input v-model="basicGoodsData.merchantProduct.marketPrice"></el-input>
            </el-form-item>

            <el-form-item label="促销价格" style="text-align:left;" prop="promotionPrice">
                <el-input v-model="basicGoodsData.merchantProduct.promotionPrice"></el-input>
            </el-form-item>

            <el-form-item label="已售基数" style="text-align:left;" prop="soldBase">
                <el-input v-model="basicGoodsData.merchantProduct.soldBase"></el-input>
            </el-form-item>

            <el-form-item label="购买方式" style="text-align:left;" prop="saleWay">
                <el-select v-model="merchantProduct.buyType" placeholder="购买方式">
                    <el-option
                    label="支持积分+现金购买"
                    value="1">
                    </el-option>
                    <el-option
                    label="仅支持现金支付"
                    value="2">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="销售方式" style="text-align:left;" prop="saleWay">
                <el-select v-model="merchantProduct.saleWay" placeholder="销售方式" :disabled="merchantProduct.status==3 || merchantProduct.status==4">
                    <el-option
                    label="正常销售"
                    value="1">
                    </el-option>
                    <el-option
                    label="团购"
                    value="2">
                    </el-option>
                    <el-option
                    label="普通预售"
                    value="4">
                    </el-option>
                    <el-option
                    label="会籍预售"
                    value="6">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="预售期" style="text-align:left;">
                <el-input-number controls-position="right" v-model="merchantProduct.presellPeriod" :min="0" :disabled="merchantProduct.saleWay!=4 && merchantProduct.saleWay!=6" @blur="praseIntEnter"></el-input-number>天
            </el-form-item>

            <el-form-item label="会籍关联" style="text-align:left;">
                <el-select v-model="merchantProduct.membershipIdList" collapse-tags multiple :disabled="merchantProduct.saleWay!=6">
                    <el-option
                        v-for="item in membershipIdList"
                        :key="item.id"
                        :label="item.membershipName"
                        :value="item.id"
                        :disabled="item.isUse == 0">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SU关联" style="text-align:left;" prop="soldBase">
                {{suGoodsName}}
                <el-button class="button-new-tag" size="small" @click="resetGoods">选择SU(限1个)</el-button>
            </el-form-item>

            <el-form-item label="库存预警" style="text-align:left;" prop="soldBase">
                <el-input v-model="basicGoodsData.merchantProduct.stockWarning"></el-input>
            </el-form-item>

            <el-form-item label="企业类型" style="text-align:left;">
                    <el-checkbox v-model="checkCompany1" :disabled="merchantProduct.storeId != 1">正式公司</el-checkbox>
                    <el-checkbox v-model="checkCompany2" :disabled="merchantProduct.storeId != 1">演示公司</el-checkbox>
                    <el-checkbox v-model="checkCompany3" :disabled="merchantProduct.storeId != 1">竞品公司</el-checkbox>
            </el-form-item>

            <el-form-item label="正式公司" style="text-align:left;" v-if="checkCompany1">
                <el-select v-model="merchantProduct.companyIds" collapse-tags multiple :disabled="allStatus||(merchantProduct.storeId != 1&&merchantProduct.storeId != 2)">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                    <el-option
                        v-for="item in basicGoodsData.companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus">所有正式公司可见</el-checkbox>
            </el-form-item>

            <el-form-item label="演示公司" style="text-align:left;" v-if="checkCompany2">
                <el-select v-model="merchantProduct.demoCompanyIds" collapse-tags multiple :disabled="allStatus2">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck2">全选</p>
                    <el-option
                        v-for="item in basicGoodsData.demoCompanyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus2">所有演示公司可见</el-checkbox>
            </el-form-item>
            <el-form-item label="竞品公司" style="text-align:left;" v-if="checkCompany3">
                <el-select v-model="merchantProduct.competingCompanyIds" collapse-tags multiple :disabled="allStatus3">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck3">全选</p>
                    <el-option
                        v-for="item in basicGoodsData.competingCompanyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus3">所有竞品公司可见</el-checkbox>
            </el-form-item>

            <el-form-item label="正式公司销售价格" style="text-align:left;" prop="salePrice" v-if="checkCompany1">
                <el-input v-model="basicGoodsData.merchantProduct.salePrice"></el-input>
            </el-form-item>

            <el-form-item label="演示公司销售价格" style="text-align:left;" prop="salePrice" v-if="checkCompany2">
                <el-input v-model="basicGoodsData.merchantProduct.demoSalePrice"></el-input>
            </el-form-item>

            <el-form-item label="竞品公司销售价格" style="text-align:left;" prop="salePrice" v-if="checkCompany3">
                <el-input v-model="basicGoodsData.merchantProduct.competingSalePrice"></el-input>
            </el-form-item>
        </el-form>

  <!--      <div style="padding:20px 200px;min-width:400px;">
             <h4  style="text-align:left;">商品比价：</h4>
             <el-table
                :data="basicGoodsData.sellPlatformMerchantProdList"
                border
                style="margin-left:100px;">
                    <el-table-column
                    label="平台"
                    min-width="100"
                    width="150"
                    align="center"
                    prop="name">

                    </el-table-column>

                    <el-table-column
                    label="价格"
                    min-width="100"
                    align="center"
                    width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.salePrice"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="链接"
                    min-width="200"
                    align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.path"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
        </div> -->

        <el-form label-width="150px" style="padding:20px 200px;min-width:400px;">
            <h4  style="text-align:left;">运营平台：</h4>

            <el-form-item label="运营方" style="text-align:left;">
                <el-select v-model="merchantProduct.merchantId" placeholder="运营方" clearable disabled="disabled">
                    <el-option
                        v-for="item in merchatList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="运营方" style="text-align:left;" v-else-if="merchantProduct.merchantId==2">
                <el-select v-model="merchantProduct.merchantId" placeholder="运营方" clearable disabled="disabled">
                    <el-option
                    label="券仓"
                    value="2">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="运营方" style="text-align:left;" v-else-if="merchantProduct.merchantId==3">
                <el-select v-model="merchantProduct.merchantId" placeholder="运营方" clearable disabled="disabled">
                    <el-option
                    label="网店管家"
                    value="3">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="运营方" style="text-align:left;" v-else-if="merchantProduct.merchantId==4">
                <el-select v-model="merchantProduct.merchantId" placeholder="运营方" clearable disabled="disabled">
                    <el-option
                    label="聚合数据"
                    value="4">
                    </el-option>
                </el-select>
            </el-form-item> -->

            <el-form-item label="所属客户端" style="text-align:left;">
                <el-checkbox-group v-model="merchantProduct.clientIds" @change="clientChange">
                    <el-checkbox v-for="val in basicGoodsData.clientList" :label="val.id" :key="val.id">{{val.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="web端详情页轮播图" style="text-align:left;" v-if="clientStatus&&merchantProduct.clientIds.length!=0">
                    <template>
                        <div class="color-list">
                            <div class="color-item" v-for="(info,key) in webBannerPictureList" v-dragging="{ item: info, list: webBannerPictureList, group: 'info' }" :key="key">
                                <el-card style="width:140px;float:left;margin:8px;position:relative;" :body-style="{ padding: '0px' }">
                                    <img :src="info" class="image" style="width:140px;height:140px;">
                                    <div style="padding: 3px;position:absolute;top:0;right:5px;">
                                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="delImgList3(key)" style="padding:7px;"></el-button>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </template>
                    <el-upload
                    :show-file-list="false"
                    :action="baseImgPath"
                    list-type="picture-card"
                    :on-success="handleAvatarSuccess3"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm"
                    >
                         <i class="el-icon-plus"></i>

                    </el-upload>
                </el-form-item>
                <p style="font-size:12px;line-height:30px;color:#999;text-align:left;" v-if="clientStatus && merchantProduct.clientIds.length!=0">Tips : 可拖拽排序。</p>

                <el-form-item label="商品显示状态" style="text-align:left;">
                    <el-radio-group v-model="merchantProduct.isVisible">
                        <el-radio :label="0">显示</el-radio>
                        <el-radio :label="1">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>





        </el-form>

        <el-form label-width="150px" style="padding:20px 200px;min-width:400px;">
            <h4  style="text-align:left;">物流服务：</h4>

            <el-form-item label="运费说明" style="text-align:left;">
                <el-input v-model="basicGoodsData.merchantProduct.freightExplain" disabled></el-input>
            </el-form-item>

            <el-form-item label="发货说明" style="text-align:left;">
                <el-input v-model="basicGoodsData.merchantProduct.shipmentsExplain"></el-input>
            </el-form-item>


        </el-form>
        <div style="padding:20px 200px;min-width:400px;">
            <h4  style="text-align:left;margin-bottom:20px;">商品详情：</h4>
            <template>
                <quill-editor v-model="merchantProduct.content"
                            ref="myQuillEditor"
                            :options="editorOption">

                                <div id="toolbar" slot="toolbar">
                                    <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-strike"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>
                                    <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>

                                    <span class="ql-formats"><select class="ql-size">
                                        <option value="small"></option>
                                        <option selected></option>
                                        <option value="large"></option>
                                        <option value="huge"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-header">
                                        <option value="1"></option>
                                        <option value="2"></option>
                                        <option value="3"></option>
                                        <option value="4"></option>
                                        <option value="5"></option>
                                        <option value="6"></option>
                                        <option selected="selected"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-color">
                                        <option selected="selected"></option>
                                        <option value="#e60000"></option>
                                        <option value="#ff9900"></option>
                                        <option value="#ffff00"></option>
                                        <option value="#008a00"></option>
                                        <option value="#0066cc"></option>
                                        <option value="#9933ff"></option>
                                        <option value="#ffffff"></option>
                                        <option value="#facccc"></option>
                                        <option value="#ffebcc"></option>
                                        <option value="#ffffcc"></option>
                                        <option value="#cce8cc"></option>
                                        <option value="#cce0f5"></option>
                                        <option value="#ebd6ff"></option>
                                        <option value="#bbbbbb"></option>
                                        <option value="#f06666"></option>
                                        <option value="#ffc266"></option>
                                        <option value="#ffff66"></option>
                                        <option value="#66b966"></option>
                                        <option value="#66a3e0"></option>
                                        <option value="#c285ff"></option>
                                        <option value="#888888"></option>
                                        <option value="#a10000"></option>
                                        <option value="#b26b00"></option>
                                        <option value="#b2b200"></option>
                                        <option value="#006100"></option>
                                        <option value="#0047b2"></option>
                                        <option value="#6b24b2"></option>
                                        <option value="#444444"></option>
                                        <option value="#5c0000"></option>
                                        <option value="#663d00"></option>
                                        <option value="#666600"></option>
                                        <option value="#003700"></option>
                                        <option value="#002966"></option>
                                        <option value="#3d1466"></option>
                                    </select></span>
                                    <span class="ql-formats"> <select class="ql-background">
                                        <option value="#000000"></option>
                                        <option value="#e60000"></option>
                                        <option value="#ff9900"></option>
                                        <option value="#ffff00"></option>
                                        <option value="#008a00"></option>
                                        <option value="#0066cc"></option>
                                        <option value="#9933ff"></option>
                                        <option selected="selected"></option>
                                        <option value="#facccc"></option>
                                        <option value="#ffebcc"></option>
                                        <option value="#ffffcc"></option>
                                        <option value="#cce8cc"></option>
                                        <option value="#cce0f5"></option>
                                        <option value="#ebd6ff"></option>
                                        <option value="#bbbbbb"></option>
                                        <option value="#f06666"></option>
                                        <option value="#ffc266"></option>
                                        <option value="#ffff66"></option>
                                        <option value="#66b966"></option>
                                        <option value="#66a3e0"></option>
                                        <option value="#c285ff"></option>
                                        <option value="#888888"></option>
                                        <option value="#a10000"></option>
                                        <option value="#b26b00"></option>
                                        <option value="#b2b200"></option>
                                        <option value="#006100"></option>
                                        <option value="#0047b2"></option>
                                        <option value="#6b24b2"></option>
                                        <option value="#444444"></option>
                                        <option value="#5c0000"></option>
                                        <option value="#663d00"></option>
                                        <option value="#666600"></option>
                                        <option value="#003700"></option>
                                        <option value="#002966"></option>
                                        <option value="#3d1466"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-font">
                                        <option selected="selected"></option>
                                        <option value="serif"></option>
                                        <option value="monospace"></option>
                                    </select></span>
                                    <span class="ql-formats">
                                        <select class="ql-align">
                                        <option selected="selected"></option>
                                        <option value="center"></option>
                                        <option value="right"></option>
                                        <option value="justify"></option>
                                    </select>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-clean"></button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-link"></button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" @click="imgClick">
                                            <svg viewBox="0 0 18 18">
                                                <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                                                <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
                                                <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
                                            </svg>
                                        </button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-video"></button>
                                    </span>
                                    </div>
                        </quill-editor>
            </template>
        </div>

    <div style="text-align:center;">
        <el-button style="margin-top: 12px;" size="medium" @click='updateGoodsBasic'>保存</el-button>
        <el-button size="medium" style="margin-top: 12px;" @click='updateRefGoods'>保存并提交</el-button>
    </div>

        <el-dialog title="选择商品标签" :visible.sync="dialogFormVisible">
            <div style="height:600px;overflow:auto;">
                <div style="margin:15px 0;">
                    <el-input placeholder="请输入标签名称" v-model="labelForm.name">
                        <el-button slot="append" icon="el-icon-search" @click="findTagOfPage"></el-button>
                    </el-input>
                </div>

                <el-checkbox-group v-model="merchantProduct.tagList">
                    <el-table :key='tableKey' :data="labelList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

                        <el-table-column align="center" width="30">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.id">1</el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="标签名称" min-width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-checkbox-group>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="labelForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="labelForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="saveLabel">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择门店" :visible.sync="dialogFormVisible3">
            <el-tree
                :data="storeChildrenList"
                show-checkbox
                node-key="id"
                ref="tree1"
                highlight-current
                default-expand-all
                :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer" :span="24">
                <el-button @click="dialogFormVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="checkStore">确 定</el-button>
            </div>
         </el-dialog>

         <el-dialog title="选择SU" :visible.sync="dialogFormVisible4" size="tiny">
            <div style="margin-bottom:20px;text-align:left;">

                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="goodsForm.name">
                </el-input>

                <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchGoods">搜索</el-button>
                <el-button @click="resetGoods" size="medium">重置</el-button>
            </div>
            <el-table :key='tableKey1' :data="goodsListBase" border fit highlight-current-row style="width: 100%">


                <el-table-column align="center" label="商品名称" min-width="250">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品价格" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.salePrice}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==3">已上架</span>
                        <span v-else-if="scope.row.status==4">已下架</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="销售方式" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.saleWay==1">正常销售</span>
                        <span v-else-if="scope.row.saleWay==2">团购</span>
                        <span v-else-if="scope.row.saleWay==4">正常预售</span>
                        <span v-else-if="scope.row.saleWay==6">会籍预售</span>
                    </template>
                </el-table-column>


                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="small" @click="selectGoods(scope.row)">选择</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page.sync="goodsForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="goodsForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count1">
                </el-pagination>
            </div>


        </el-dialog>
    </div>

</template>
<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../../config/env';
import { quillEditor } from 'vue-quill-editor';
import {updateMerchantProductByIdWithTx,getQiNiuToken,findTagOfPage,freightTemplateByMerchantId,findRootStoreAll,
findAllMembership,findStoreAllByTreeId,queryStandardUnitListByBlurry} from '../../../../api/getData';
export default {
    props: {
        basicGoodsData: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data () {
        var number = (rule, value, callback) => {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            setTimeout(() => {
                if (!reg.test(value)) {
                    callback(new Error('请输入数字值'));
                }else{
                    callback();
                }
            }, 1000);
        };
        var checkNum = (rule, value, callback) => {
            var reg = /^[0-9]*$/;
            if (!value) {
                return callback(new Error('前端编号不能为空'));
            }
            setTimeout(() => {
                if (!reg.test(value)) {
                    callback(new Error('请输入正整数数字'));
                } else {
                    if (value > 999999) {
                        callback(new Error('最大不超过 999999'));
                    } else {
                        callback();
                    }
                }
                }, 1000);
        };
        return {
            keywordTypeList:[
                {
                    name:'不使用搜索关键词',
                    id:1
                },
                {
                    name:'引用产品关键词并添加自定义关键词',
                    id:2
                },
                {
                    name:'仅引用产品关键词',
                    id:3
                },
                {
                    name:'仅添加自定义关键词',
                    id:4
                }
            ],
            options: [],
            editorOption: {
                modules: {
                    toolbar: '#toolbar'
                }
            },
            imgForm:{
                key:'',
                token:'',
            },
            baseImgPath:'',
            baseImgUrl:'',
            merchantProductRules:{
                name:[
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                    {max:'30', message: '不能超过30位字符', trigger: 'blur'}
                ],
                frontSerialNumber:[
                    {required: true, message: '请输入前端编号', trigger: 'blur'},
                    {validator: checkNum}
                ],
                marketPrice:[
                    {required: true,message: '请输入市场价格', trigger: 'blur' },
                    {validator: number}
                ],
                soldBase:[
                    { validator: number, trigger: 'blur' }
                ],
                salePrice:[
                    {required: true, message: '请输入销售价格',validator: number, trigger: 'blur' }
                ],
                promotionPrice:[
                    { validator: number, trigger: 'blur' }
                ],
                saleWay:[
                    {required: true, message: '请选择销售方式', trigger: 'blur' }
                ],
            },
            merchantProduct:{
                saleWay:'',
                buyType:'',
                frontSerialNumber:'',
                merchantId:'',
                clientIds:'',
                companyIds:[],
                demoCompanyIds:[],
                competingCompanyIds:[],
                isVisible:'',
                tagList:[],
                isSpuKeyword:1,
                keywordList:[],
                demoSalePrice:'',
                competingSalePrice:'',
                content:'',
                storeIdList:[],
                membershipIdList:[],
                storeId:'',
                presellPeriod:'',
                relevanceSuId:'',
                status:''
            },
            status:'',
            labelList:[],
            checkLabel:[],
            dialogFormVisible:false,
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            labelForm:{
                name:'',
                type:'1',
                pageNo:1,
                pageSize:10,
                isValid:1
            },
            inputVisible: false,
            inputValue: '',
            keyWordList:[],
            allStatus:false,
            allStatus2:false,
            allStatus3:false,
            checkCompany1:false,
            checkCompany2:false,
            checkCompany3:false,
            clientStatus:false,
            webBannerPictureList:[],
            storeList:[],
            membershipIdList:[],
            storeChildrenList:[],
            dialogFormVisible3:false,
            defaultProps: {
              children: 'children',
              label: 'name'
            },
            goodsForm:{
                name:'',
                id:'',
                storeId:'',
                pageNo:1,
                pageSize:10,

            },
            dialogFormVisible4:false,
            count1:null,
            tableKey1: 0,
            listLoading1: true,
            offset1: 0,
            goodsListBase:[],
            suGoodsName:'',
            platformId:'',
            merchatList:[]
        }
    },
    created () {
        window.scrollTo(0, 0);
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.findRootStoreAll();
        this.findAllMembership();
    },
    mounted(){
        this.$refs.myQuillEditor.quill.enable(false);
        this.clientChange(this.basicGoodsData.merchantProduct.clientIds);
        this.webBannerPictureList = this.basicGoodsData.webBannerPictureList
        this.keyWordList = this.basicGoodsData.spuKeyWordList;
        this.merchantProduct.keywordList = this.basicGoodsData.suKeyWordList;
        this.merchantProduct.isSpuKeyword = this.basicGoodsData.merchantProduct.isSpuKeyword;
        //this.merchantProduct.merchantId = this.basicGoodsData.merchantProduct.merchantId.toString();
        var newObj = this.basicGoodsData.merchantProduct.merchantMap;
        for (var prop in newObj)
        {
            this.merchatList.push({
                id:prop,
                name:newObj[prop]
            });
            this.merchantProduct.merchantId = prop.toString();
        }
        this.merchantProduct.saleWay = this.basicGoodsData.merchantProduct.saleWay.toString();
        this.merchantProduct.clientIds = this.basicGoodsData.merchantProduct.clientIds;
        this.merchantProduct.content = this.basicGoodsData.merchantProduct.content;
        this.merchantProduct.storeIdList = this.basicGoodsData.storeIdList;
        this.merchantProduct.membershipIdList = this.basicGoodsData.membershipIdList;
        this.merchantProduct.presellPeriod = this.basicGoodsData.merchantProduct.presellPeriod;
        this.merchantProduct.storeId = this.basicGoodsData.merchantProduct.storeId;
        this.merchantProduct.status = this.basicGoodsData.merchantProduct.status;
        this.merchantProduct.frontSerialNumber = this.basicGoodsData.merchantProduct.frontSerialNumber;
        this.merchantProduct.buyType = this.basicGoodsData.merchantProduct.buyType.toString();
        console.log(this.merchantProduct.status);
        if(this.merchantProduct.storeId==1){

        }else if(this.merchantProduct.storeId==2){
            this.checkCompany1 = true;
            this.allStatus = true;
        }else if(this.merchantProduct.storeId!=''){
            this.checkCompany1 = true;
        }
        this.suGoodsName = this.basicGoodsData.merchantProduct.relevanceSuName;
        if(this.basicGoodsData.merchantProduct.companyIds.length!=0){
            this.checkCompany1 = true;
        }else{
            this.checkCompany1 = false;
        }
        if(this.basicGoodsData.merchantProduct.demoCompanyIds.length!=0){
            this.checkCompany2 = true;
        }else{
            this.checkCompany2 = false;
        }
        if(this.basicGoodsData.merchantProduct.competingCompanyIds.length!=0){
            this.checkCompany3 = true;
        }else{
            this.checkCompany3 = false;
        }

        if(this.basicGoodsData.merchantProduct.companyIds[0]<0){
            this.merchantProduct.companyIds = [];
            this.allStatus = true;
        }else{
            this.merchantProduct.companyIds = this.basicGoodsData.merchantProduct.companyIds;
            this.allStatus = false;
        }

        if(this.basicGoodsData.merchantProduct.demoCompanyIds[0]<0){
            this.merchantProduct.demoCompanyIds = [];
            this.allStatus2 = true;
        }else{
            this.merchantProduct.demoCompanyIds = this.basicGoodsData.merchantProduct.demoCompanyIds;
            this.allStatus2 = false;
        }

        if(this.basicGoodsData.merchantProduct.competingCompanyIds[0]<0){
            this.merchantProduct.competingCompanyIds = [];
            this.allStatus3 = true;
        }else{
            this.merchantProduct.competingCompanyIds = this.basicGoodsData.merchantProduct.competingCompanyIds;
            this.allStatus3 = false;
        }
        this.merchantProduct.tagList = this.basicGoodsData.merchantProductTagList;
        this.merchantProduct.isVisible = this.basicGoodsData.merchantProduct.isVisible;
        this.$nextTick(function() {
            this.$refs.myQuillEditor.quill.enable(true);
            this.$refs.myQuillEditor.quill.blur();
        });
        this.initializeLabel();
        const res = getQiNiuToken();

        res.then(_data => {
            if(_data.data.code == 0){
                this.imgForm.token = _data.data.data;
            }else{
                this.$message({
                    type:"error",
                    message:_data.data.error
                })
            }
        })
    },
    components: {
        quillEditor
    },
    computed: {
      editor() {
            return this.$refs.myQuillEditor.quill
      }
    },
    methods:{
        //input-number取整
        praseIntEnter(){
          this.merchantProduct.presellPeriod = Math.ceil(this.merchantProduct.presellPeriod);
        },
        //选择商品
        selectGoods(obj){
            this.suGoodsName = obj.name;
            this.merchantProduct.relevanceSuId = obj.id;
            this.dialogFormVisible4 = false;
        },
         //分页
        handleSizeChange1(val) {
            this.goodsForm.pageSize = val;
            this.queryStandardUnitListByBlurry()
        },
        handleCurrentChange1(val) {
            this.goodsForm.pageNo = val;
            this.offset1 = (val - 1) * this.goodsForm.pageSize;
            this.queryStandardUnitListByBlurry()
        },
        //重置
        resetGoods(){
            this.goodsForm = {
                name:'',
                pageNo:1,
                pageSize:10,

            };
            this.queryStandardUnitListByBlurry();
        },
        //搜索
        searchGoods(){
            this.goodsForm.pageNo = 1;
            this.queryStandardUnitListByBlurry();
        },
        async queryStandardUnitListByBlurry () {
            try {
                const obj = new Object();
                this.goodsForm.standardProductUnitId = this.basicGoodsData.merchantProduct.standardProductUnitId;
                this.goodsForm.excludeId = this.basicGoodsData.merchantProduct.id;
                this.goodsForm.storeId = this.basicGoodsData.merchantProduct.storeId;
                $.each(this.goodsForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await queryStandardUnitListByBlurry(obj);
                if (res.data.code == 0) {
                    this.count1 = res.data.data.totalSize;
                    this.goodsListBase = res.data.data.list;
                    this.dialogFormVisible4 = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        //总店选择
        storeChange(){
            this.merchantProduct.storeIdList = [];
            this.storeChildrenList = [];
        },
        //选择门店
        checkStore(){
            this.merchantProduct.storeIdList = this.$refs.tree1.getCheckedKeys(true);
            this.dialogFormVisible3 = false;
        },
        //获取会籍列表
        async findAllMembership () {
            try {
                const res = await findAllMembership();
                if (res.data.code == 0) {
                    this.membershipIdList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        //获取总店列表
        async findRootStoreAll () {
            try {
                const res = await findRootStoreAll();
                if (res.data.code == 0) {
                    this.storeList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        findStoreAllByTreeId(){
            if(this.merchantProduct.storeId!=''){
                let thtf = this;
                $.each(this.storeList,function(key,info){
                    if(info.id == thtf.merchantProduct.storeId){
                        thtf.findStoreAllByTreeIdAjax(info.storeTreeId);
                    }
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请选择总店'
                });
            }
        },
        //根据总店ID获取门店列表
        async findStoreAllByTreeIdAjax (storeTreeId) {
            try {
                const res = await findStoreAllByTreeId({storeTreeId:storeTreeId});
                if (res.data.code == 0) {
                    this.storeChildrenList = res.data.data;
                    this.dialogFormVisible3 = true;
                    if(this.merchantProduct.storeIdList.length != 0){
                        this.$nextTick(function () {
                            this.$refs.tree1.setCheckedKeys(this.merchantProduct.storeIdList);
                        })
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
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        clientChange(arr){
            var index = $.inArray(3,arr);
            if(index >= 0){
                this.clientStatus = true;
            }else{
                this.clientStatus = false;
            }
        },
        handleClose1(index,tag) {
            this.merchantProduct.keywordList.splice(this.merchantProduct.keywordList.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                //this.$refs.saveTagInput.focus();
            });
        },

        handleInputConfirm(index) {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.merchantProduct.keywordList.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

        //新增标签
        addLabel(){
            this.labelForm = {
                pageNo:1,
                pageSize:10,
                name:'',
                type:1,
                isValid:1
            };

            this.findTagOfPage();
        },
        //查询所有标签
        async findTagOfPage () {
            try {
                const obj = new Object();
                this.listLoading = false;
                $.each(this.labelForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.labelList = res.data.data.list;
                    this.dialogFormVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        //选择标签确定
        async saveLabel(){
            try {
                if(this.merchantProduct.tagList.length == 0){
                    this.$message({
                        type: 'error',
                        message: '请选择商品标签'
                    });
                    return;
                }
                const obj = new Object();
                obj.tagList = JSON.stringify(this.merchantProduct.tagList);
                obj.pageSize = this.merchantProduct.tagList.length+10;
                obj.pageNo = 1;
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.checkLabel = res.data.data.list;
                    this.dialogFormVisible = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        //标签初始化
        async initializeLabel(){
            try {
                const obj = new Object();
                obj.tagList = JSON.stringify(this.merchantProduct.tagList);
                obj.pageSize = this.merchantProduct.tagList.length+10;
                obj.pageNo = 1;
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.checkLabel = res.data.data.list;
                    this.dialogFormVisible = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        //删除已选标签
        tagClose(index){
            this.merchantProduct.tagList.splice(index,1);
            this.checkLabel.splice(index,1);
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        },
        //分页
        handleSizeChange(val) {
            this.labelForm.pageSize = val;
            this.findTagOfPage()
        },
        handleCurrentChange(val) {
            this.labelForm.pageNo = val;
            this.offset = (val - 1) * this.labelForm.pageSize;
            this.findTagOfPage()
        },

        /*选择上传图片切换*/
            onFileChange(e){
                var fileInput = e.target;
                if (fileInput.files.length == 0) {
                    return;
                }
                if (fileInput.files[0].size > 1024 * 1024 * this.maxSize) {
                    alert('图片过大');
                    return;
                }
              var self = this;
              var data = new FormData;
              let curr = moment().format('YYYYMMDDHHmmss').toString();
              let prefix = moment().format('HHmmss').toString();
              let key = curr+"egeo"+prefix;

              data.append('file', fileInput.files[0],name);
              data.append("token",this.imgForm.token);
              data.append("key",key);
              this.editor.focus();
              var xhr=new XMLHttpRequest();
              xhr.open('post',baseImgPath);
              xhr.responseType='json';
              xhr.send(data);
              xhr.onload=function () {
                if(xhr.status==200){
                  self.editor.insertEmbed(self.editor.getSelection().index, 'image', self.baseImgUrl + xhr.response.key);
                }
              }
            },
            /*点击上传图片按钮*/
            imgClick() {
                if(this.canCrop){
                    this.showCrop=true;
                }else{
                  /*创建input file 不裁切，自己控制*/
                  var input = document.createElement('input');
                  input.type = 'file';
                  input.name = this.fileName;
                  input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
                  input.onchange = this.onFileChange;
                  input.click();
                }
            },

        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.basicGoodsData.companyList,function(key,info){
                arr.push(info.id);
            })
            this.merchantProduct.companyIds = arr;
        },
        //测试公司全选
        allCheck2(){
            let arr = new Array;
            $.each(this.basicGoodsData.demoCompanyList,function(key,info){
                arr.push(info.id);
            })
            this.merchantProduct.demoCompanyIds = arr;
        },

        //竞品公司全选
        allCheck3(){
            let arr = new Array;
            $.each(this.basicGoodsData.competingCompanyList,function(key,info){
                arr.push(info.id);
            })
            this.merchantProduct.competingCompanyList = arr;
        },

        //查询所有标签
        async marchantChange () {
            try {
                const res = await freightTemplateByMerchantId({merchantId:this.merchantProduct.merchantId});
                if (res.data.code == 0) {
                    this.basicGoodsData.merchantProduct.freightExplain = res.data.data.freightRegulation;
                    this.basicGoodsData.merchantProduct.shipmentsExplain = res.data.data.shipmentsExplain;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        delImgList3 (key) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.webBannerPictureList.splice(key,1);
                this.$notify({
                    title: '删除',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleAvatarSuccess3(response,file){
            this.webBannerPictureList.push(this.baseImgUrl + response.key);
        },
        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
         //上传之前获取key，index
        uploadKeyIndex(index) {
            this.index = index;
        },
        //上传图片
        beforeAvatarUpload(file) {    //在图片提交前进行验证  轮播图
            let curr = moment().format('YYYYMMDDHHmmss').toString();
            let prefix = moment(file.lastModified).format('HHmmss').toString();
            let key = curr+"egeo"+prefix;

            this.imgForm.key = key;
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const res = getQiNiuToken();

            res.then(_data => {
                if(_data.data.code == 0){

                    this.imgForm.token = _data.data.data;
                }else{
                    this.$message({
                        type:"error",
                        message:_data.data.error
                    })
                }
            })
            if (!isJPG&&!isPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }

            return isJPG||isPNG

        },

        async updateGoodsBasic (){
            try {
                let data = this.basicGoodsData;
                let obj  = new Object();
                obj.buyType = this.merchantProduct.buyType;
                obj.name = data.merchantProduct.name;
                obj.id = data.merchantProduct.id;
                obj.type = data.merchantProduct.type;
                obj.salePrice = data.merchantProduct.salePrice;
                obj.marketPrice = data.merchantProduct.marketPrice;
                obj.promotionPrice = data.merchantProduct.promotionPrice;
                obj.saleWay = this.merchantProduct.saleWay;
                obj.stockWarning = data.merchantProduct.stockWarning;
                obj.soldBase = data.merchantProduct.soldBase;
                obj.freightExplain = data.merchantProduct.freightExplain;
                obj.shipmentsExplain = data.merchantProduct.shipmentsExplain;
                obj.content = this.merchantProduct.content;
                obj.isVisible = this.merchantProduct.isVisible;
                obj.clientList = JSON.stringify(this.merchantProduct.clientIds);
                obj.merchantId = this.merchantProduct.merchantId;
                obj.tagList = JSON.stringify(this.merchantProduct.tagList);
                obj.keywordList = JSON.stringify(this.merchantProduct.keywordList);
                obj.isSpuKeyword = JSON.stringify(this.merchantProduct.isSpuKeyword);
                obj.membershipIdList = JSON.stringify(this.merchantProduct.membershipIdList);
                obj.storeIdList = JSON.stringify(this.merchantProduct.storeIdList);
                obj.storeId = this.merchantProduct.storeId;
                obj.presellPeriod = this.merchantProduct.presellPeriod;
                obj.relevanceSuId = this.merchantProduct.relevanceSuId;
                obj.frontSerialNumber = this.merchantProduct.frontSerialNumber;
                if(this.checkCompany1){
                    if(this.allStatus){
                        obj.companyList = "[-1]";
                    }else{
                        obj.companyList = JSON.stringify(this.merchantProduct.companyIds);
                    }
                }else{
                    obj.salePrice = '';
                }
                if(this.checkCompany2){
                    obj.demoSalePrice = this.basicGoodsData.merchantProduct.demoSalePrice;
                    if(this.allStatus2){
                        obj.demoCompanyList = "[-1]";
                    }else{
                        obj.demoCompanyList = JSON.stringify(this.merchantProduct.demoCompanyIds);
                    }
                }
                if(this.checkCompany3){
                    obj.competingSalePrice = this.basicGoodsData.merchantProduct.competingSalePrice;
                    if(this.allStatus3){
                        obj.competingCompanyList = "[-1]";
                    }else{
                        obj.competingCompanyList = JSON.stringify(this.merchantProduct.competingCompanyIds);
                    }
                }

               console.log(obj.demoCompanyList,obj.competingCompanyList)
                obj.webBannerPictureList = JSON.stringify(this.webBannerPictureList);
                obj.status = this.status;
                obj.sellPlatformMerchantProdList = JSON.stringify(data.sellPlatformMerchantProdList);
                const res = await updateMerchantProductByIdWithTx(obj);

                if (res.data.code == 0) {
                     this.$notify({
                        title: '修改',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        //保存并提交
        updateRefGoods(){
            this.status = 2;
            this.updateGoodsBasic();
        },
    }
}

</script>


<style scoped>

</style>
