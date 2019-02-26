<template>
    <div>

        <el-form ref="form" :model="form" label-width="120px" style="padding:20px 200px;min-width:400px;">
            <el-form-item label="产品编号" style="text-align:left;">
                <span class="text">{{form.productSerialNumber}}</span>
            </el-form-item>

            <el-form-item label="产品类目" style="text-align:left;">
                <span v-for="(info,key) in categoryName">
                    <span v-if="key<categoryName.length-1" style="font-size:16px;line-height:36px;">{{info}}>></span>
                    <span class="text" v-else>{{info}}</span>
                </span>
                <a href="javascript:void(0)" @click="alterCaregory">修改</a>
            </el-form-item>

            <el-form-item label="产品名称" style="text-align:left;">
                <span class="text">{{form.name}}</span>
            </el-form-item>



        </el-form>

        <el-form ref="dataForm" :model="dataForm" label-width="120px" :rules="dataFormRules" style="padding:0 200px;min-width:400px;">
            <el-form-item label="商品名称" style="text-align:left;" prop="name">
                <el-tooltip class="item" effect="dark" content="电子卡券名称不得超出8位字符" placement="right">
                    <el-input v-model="dataForm.name"></el-input>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="前端编号" style="text-align:left;" prop="frontSerialNumber">
                    <el-input v-model="dataForm.frontSerialNumber" placeholder="最大不超过999999"></el-input>
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

            <el-form-item label="搜索关键词" style="text-align:left;">
                <el-select v-model="dataForm.isSpuKeyword">
                    <el-option
                        v-for="item in keywordTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <div v-if="dataForm.isSpuKeyword==3||dataForm.isSpuKeyword==2">
                    <el-tag
                    :key="tag"
                    v-for="tag in keyWordList">
                    {{tag}}
                    </el-tag>
                </div>

                <div v-if="dataForm.isSpuKeyword==4||dataForm.isSpuKeyword==2">
                    <el-tag
                    :key="tag"
                    v-for="tag in dataForm.keywordList"
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

            <el-form-item label="所属总店" style="text-align:left;" prop="storeId">
                <el-select v-model="dataForm.storeId" collapse-tags @change="storeChange">
                    <el-option
                        v-for="item in storeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary" plain size="small" @click="findStoreAllByTreeId">配置门店</el-button>
            </el-form-item>

            <el-form-item label="市场价格" style="text-align:left;" prop="marketPrice">
                <el-input v-model="dataForm.marketPrice"></el-input>
            </el-form-item>

            <el-form-item label="促销价格" style="text-align:left;" prop="promotionPrice">
                <el-input v-model="dataForm.promotionPrice"></el-input>
            </el-form-item>

            <el-form-item label="已售基数" style="text-align:left;" prop="soldBase">
                <el-input v-model="dataForm.soldBase"></el-input>
            </el-form-item>

            <el-form-item label="购买方式" style="text-align:left;" prop="saleWay">
                <el-select v-model="dataForm.buyType" placeholder="购买方式">
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
                <el-select v-model="dataForm.saleWay" placeholder="销售方式">
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
                <el-input-number controls-position="right" v-model="dataForm.presellPeriod" :min="0" :disabled="dataForm.saleWay!=4 && dataForm.saleWay!=6" @blur="praseIntEnter"></el-input-number>天
            </el-form-item>

            <el-form-item label="会籍关联" style="text-align:left;">
                <el-select v-model="dataForm.membershipIdList" collapse-tags multiple :disabled="dataForm.saleWay!=6">
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
                <p style="padding-left:10px;">选择其他总店后，已选择的SU会被清空</p>
            </el-form-item>

            <el-form-item label="库存预警" style="text-align:left;" prop="soldBase">
                <el-input v-model="dataForm.stockWarning"></el-input>
            </el-form-item>

            <el-form-item label="企业类型" style="text-align:left;">
                    <el-checkbox v-model="checkCompany1" :disabled="dataForm.storeId != 1">正式公司</el-checkbox>
                    <el-checkbox v-model="checkCompany2" :disabled="dataForm.storeId != 1">演示公司</el-checkbox>
                    <el-checkbox v-model="checkCompany3" :disabled="dataForm.storeId != 1">竞品公司</el-checkbox>
            </el-form-item>

            <el-form-item label="正式公司" style="text-align:left;" v-if="checkCompany1">
                <el-select v-model="dataForm.companyList" collapse-tags multiple :disabled="allStatus||(dataForm.storeId != 1&&dataForm.storeId != 2)">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus">所有正式公司可见</el-checkbox>
            </el-form-item>
            <el-form-item label="演示公司" style="text-align:left;" v-if="checkCompany2">
                <el-select v-model="dataForm.demoCompanyList" collapse-tags multiple :disabled="allStatus2">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck2">全选</p>
                    <el-option
                        v-for="item in companyList2"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus2">所有演示公司可见</el-checkbox>
            </el-form-item>
            <el-form-item label="竞品公司" style="text-align:left;" v-if="checkCompany3">
                <el-select v-model="dataForm.competingCompanyList" collapse-tags multiple :disabled="allStatus3">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck3">全选</p>
                    <el-option
                        v-for="item in companyList3"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus3">所有竞品公司可见</el-checkbox>
            </el-form-item>

            <el-form-item label="正式公司销售价格" style="text-align:left;" prop="salePrice" v-if="checkCompany1">
                <el-input v-model="dataForm.salePrice"></el-input>
            </el-form-item>

            <el-form-item label="演示公司销售价格" style="text-align:left;" prop="salePrice" v-if="checkCompany2">
                <el-input v-model="dataForm.demoSalePrice"></el-input>
            </el-form-item>

            <el-form-item label="竞品公司销售价格" style="text-align:left;" prop="salePrice" v-if="checkCompany3">
                <el-input v-model="dataForm.competingSalePrice"></el-input>
            </el-form-item>
        </el-form>

        <div style="padding:20px 200px;min-width:400px;" class="skuList">
            <h4  style="text-align:left;">pu列表:</h4>
             <el-table
                :data="skuList"
                border
                style="margin-left:100px;"
                min-height="500">
                    <el-table-column
                    width="55"
                    align="center">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.checked" :disabled="scope.row.isValid==0"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="pu名称"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.puName" maxlength="30"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="sku名称"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.skuName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="规格码"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.skuSerialNumber}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                    label="价格"
                    min-width="100"
                    align="center"  v-if="checkCompany1">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.skuCostingPrice"></el-input>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                    label="正式公司售价"
                    min-width="100"
                    align="center" v-if="checkCompany1">
                        <template slot-scope="scope" >
                            <el-input v-model="scope.row.salePrice"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="演示公司售价"
                    min-width="100"
                    align="center" v-if="checkCompany2">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.demoSalePrice"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="竞品公司售价"
                    min-width="100"
                    align="center" v-if="checkCompany3">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.competingSalePrice"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="上传图片"
                    align="center">
                        <template slot-scope="scope">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseImgPath"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleError"
                                :data="imgForm">
                                <img v-if="scope.row.skuPicUrl" :src="scope.row.skuPicUrl" @click="uploadKeyIndex(scope.$index)">
                                <i v-else class="el-icon-plus avatar-uploader-icon"  @click="uploadKeyIndex(scope.$index)"></i>
                            </el-upload>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="是否上下架"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                             <el-switch
                                v-model="scope.row.status"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                :active-value="3"
                                :inactive-value="4"
                                :disabled="scope.row.isAvailable==0">
                            </el-switch>
                        </template>
                    </el-table-column>

                </el-table>
        </div>

        <el-form ref="form" label-width="150px" style="padding:20px 200px;min-width:400px;">
                <h4  style="text-align:left;">商品图片：</h4>

                <el-form-item label="列表页图片" style="text-align:left;">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseImgPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess1"
                        :before-upload="beforeAvatarUpload"
                        :on-error="handleError"
                        :data="imgForm">
                        <img v-if="form.picture" :src="form.picture" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div style="padding: 3px;position:absolute;top:0;left:10px;">
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="delImgList1" style="padding:7px;"></el-button>
                    </div>
                </el-form-item>

                <el-form-item label="详情页轮播图" style="text-align:left;">
                    <template>
                        <div class="color-list">
                            <div class="color-item" v-for="(info,key) in form.pictureDTOs" v-dragging="{ item: info, list: form.pictureDTOs, group: 'info' }" :key="key">
                                <el-card style="width:140px;float:left;margin:8px;position:relative;" :body-style="{ padding: '0px' }">
                                    <img :src="info" class="image" style="width:140px;height:140px;">
                                    <div style="padding: 3px;position:absolute;top:0;right:5px;">
                                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="delImgList(key)" style="padding:7px;"></el-button>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </template>
                    <el-upload
                    :show-file-list="false"
                    :action="baseImgPath"
                    list-type="picture-card"
                    :on-success="handleAvatarSuccess2"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm"
                    >
                         <i class="el-icon-plus"></i>

                    </el-upload>
                </el-form-item>
                <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 可拖拽排序。</p>



   <!--     <div style="padding:20px 200px;min-width:400px;">
             <h4  style="text-align:left;">商品比价：</h4>
             <el-table
                :data="sellPlatformMerchantProdList"
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

        <el-form ref="form" label-width="150px">
            <h4  style="text-align:left;">运营平台：</h4>

            <el-form-item label="运营方" style="text-align:left;" v-if="form.thirdpartyAtt==9 || form.thirdpartyAtt==10">
                <el-select v-model="dataForm.merchantId" placeholder="运营方" clearable disabled="disabled">
                    <el-option
                    label="自营"
                    :value="1">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="运营方" style="text-align:left;" v-else-if="form.thirdpartyAtt==11">
                <el-select v-model="dataForm.merchantId" placeholder="运营方" clearable disabled="disabled">
                    <el-option
                    label="券仓"
                    :value="2">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="运营方" style="text-align:left;" v-else-if="form.thirdpartyAtt==12">
                <el-select v-model="dataForm.merchantId" placeholder="运营方" clearable>
                    <el-option
                        v-for="item in merchatList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                    <!-- <el-option
                    label="网店管家"
                    :value="3">
                    </el-option> -->
                </el-select>
            </el-form-item>

            <el-form-item label="运营方" style="text-align:left;" v-else-if="form.thirdpartyAtt==8">
                <el-select v-model="dataForm.merchantId" placeholder="运营方" clearable disabled="disabled">
                    <el-option
                    label="聚合数据"
                    :value="4">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="运营方" style="text-align:left;" v-else-if="form.thirdpartyAtt==7">
                <el-select v-model="dataForm.merchantId" placeholder="运营方" clearable>
                    <el-option
                        v-for="item in merchatList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="运营方" style="text-align:left;" v-else>
                <el-select v-model="dataForm.merchantId" placeholder="运营方" clearable @change="marchantChange">
                    <el-option
                    label="自营"
                    :value="1">
                    </el-option>
                    <el-option
                    label="券仓"
                    :value="2">
                    </el-option>
                    <el-option
                    label="网店管家"
                    :value="3">
                    </el-option>
                    <el-option
                    label="聚合数据"
                    :value="4">
                    </el-option>
                </el-select>
            </el-form-item> -->

            <el-form-item label="所属客户端" style="text-align:left;">
                <el-checkbox-group v-model="dataForm.clientList" @change="clientChange">
                    <el-checkbox v-for="val in clientList" :label="val.id" :key="val.id">{{val.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="web端详情页轮播图" style="text-align:left;" v-if="clientStatus&&dataForm.clientList.length!=0">
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
                <p style="font-size:12px;line-height:30px;color:#999;text-align:left;" v-if="clientStatus && dataForm.clientList.length!=0">Tips : 可拖拽排序。</p>
            </el-form>


            <el-form-item label="商品显示状态" style="text-align:left;">
                <el-radio-group v-model="dataForm.isVisible">
                    <el-radio :label="0">显示</el-radio>
                    <el-radio :label="1">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>

        <el-form ref="form" label-width="150px" style="padding:20px 200px;min-width:400px;">
            <h4  style="text-align:left;">物流服务：</h4>

            <el-form-item label="运费说明" style="text-align:left;">
                <el-input v-model="dataForm.freightExplain" disabled></el-input>
            </el-form-item>

            <el-form-item label="发货说明" style="text-align:left;">
                <el-input v-model="dataForm.shipmentsExplain"></el-input>
            </el-form-item>


        </el-form>

        <div style="padding:20px 200px;min-width:400px;">
            <h4  style="text-align:left;margin-bottom:20px;">商品详情：</h4>
            <template>
                <quill-editor v-model="dataForm.content"
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

        <div>
            <el-button size="medium" style="margin-top: 12px;" @click='updateGoods()' :loading="nextLoading">保存</el-button>
            <el-button size="medium" style="margin-top: 12px;" @click='updateRefGoods()' :loading="nextLoading">保存并提交</el-button>
        </div>

        <el-dialog title="选择商品标签" :visible.sync="dialogFormVisible">
            <div style="height:600px;overflow:auto;">
                <div style="margin:15px 0;">
                    <el-input placeholder="请输入标签名称" v-model="labelForm.name">
                        <el-button slot="append" icon="el-icon-search" @click="findTagOfPage"></el-button>
                    </el-input>
                </div>
                <el-checkbox-group v-model="dataForm.tagList">
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

         <el-dialog title="选择SU" :visible.sync="dialogFormVisible4">
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
                            <span v-else-if="scope.row.saleWay==3">预售</span>
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
import { baseImgPath,baseImgUrl } from '../../../config/env';
import { quillEditor } from 'vue-quill-editor';
import {merchantProductViwe,getQiNiuToken,saveMerchantProduct,findTagOfPage,freightTemplateByMerchantId,findRootStoreAll,
findAllMembership,findStoreAllByTreeId,queryStandardUnitListByBlurry} from '../../../api/getData';
export default {
    data() {
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

            form:{

            },
            categoryName:'',
            dataForm:{
                merchantId:'',
                standardProductUnitId:'',
                name:'',
                frontSerialNumber:'',//前端编号
                isVisible:'',
                salePrice:'',
                marketPrice:'',
                promotionPrice:'',
                saleWay:'',
                buyType:'1',//购买方式
                soldBase:'',
                freightExplain:'',
                shipmentsExplain:'',
                shipmentsExplain:'',
                picture:'',
                pictureList:'',
                sellPlatformMerchantProdList:[],
                clientList:[],
                companyList:[],
                content:'',
                productUnitVOList:[],
                status:'',
                tagList:[],
                stockWarning:'',
                isSpuKeyword:1,
                keywordList:[],
                storeIdList:[],
                membershipIdList:[],
                storeId:'',
                presellPeriod:'',
                relevanceSuId:'',
            },
            dataFormRules:{
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
                storeId:[
                    {required: true,message: '请先选择商品所属总店', trigger: 'change'}
                ]
            },

            radio:1,
            index:'',
            nextLoading :false,
            status:'',
            standardData:[],
            baseImgPath:'',
            baseImgUrl:'',
            skuList:[],
            clientList:[],
            companyList:[],
            sellPlatformMerchantProdList:[],
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
            webBannerPictureList:[],
            clientStatus:false,
            checkCompany1:false,
            checkCompany2:false,
            checkCompany3:false,
            allStatus:false,
            allStatus2:false,
            allStatus3:false,
            companyList:[],
            companyList2:[],
            companyList3:[],
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
            merchatList:[],
            merchatListObj:{
                id:'',
                name:''
            }
        }
    },
    created () {
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;

        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.findRootStoreAll();
        this.findAllMembership();
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
    mounted(){
        this.$refs.myQuillEditor.quill.enable(false);
    },
    watch : {
        "dataForm.storeId":{
            handler(curVal,oldVal){
                if(curVal==1){

                }else if(curVal==2){
                    this.checkCompany1 = true;
                    this.allStatus = true;
                }else if(curVal!=''){
                    this.checkCompany1 = true;
                    let thtf = this;
                    $.each(this.storeList,function(key,info){
                        if(info.id == curVal){
                            thtf.dataForm.companyList = [info.companyId];
                        }
                    })
                }
            }
        }
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
          this.dataForm.presellPeriod = Math.ceil(this.dataForm.presellPeriod);
        },
        //选择商品
        selectGoods(obj){
            this.suGoodsName = obj.name;
            this.dataForm.relevanceSuId = obj.id;
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
                standardProductUnitId:'',
                pageNo:1,
                pageSize:10,

            };
            if(!this.dataForm.storeId){
                this.$message.error("请先选择商品所属总店");
            }else{
                this.queryStandardUnitListByBlurry();
            }
        },
        //搜索
        searchGoods(){
            this.goodsForm.pageNo = 1;
            this.queryStandardUnitListByBlurry();
        },
        async queryStandardUnitListByBlurry () {
            try {
                const obj = new Object();
                this.goodsForm.standardProductUnitId = this.dataForm.standardProductUnitId;
                this.goodsForm.storeId = this.dataForm.storeId;
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
            this.dataForm.storeIdList = [];
            this.storeChildrenList = [];
            this.suGoodsName = ""
        },
        //选择门店
        checkStore(){
            this.dataForm.storeIdList = this.$refs.tree1.getCheckedKeys(true);
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
            if(this.dataForm.storeId!=''){
                let thtf = this;
                $.each(this.storeList,function(key,info){
                    if(info.id == thtf.dataForm.storeId){
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
                    if(this.dataForm.storeIdList.length != 0){
                        this.$refs.tree1.setCheckedKeys(this.dataForm.storeIdList);
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
            this.dataForm.keywordList.splice(this.dataForm.keywordList.indexOf(tag), 1);
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
                this.dataForm.keywordList.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

        //查询所有标签
        async marchantChange () {
            try {
                const res = await freightTemplateByMerchantId({merchantId:this.dataForm.merchantId});
                if (res.data.code == 0) {
                    this.dataForm.freightExplain = res.data.data.freightRegulation;
                    this.dataForm.shipmentsExplain = res.data.data.shipmentsExplain;
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

                if(this.dataForm.tagList.length == 0){
                    this.$message({
                        type: 'error',
                        message: '请选择商品标签'
                    });
                    return;
                }
                const obj = new Object();
                obj.tagList = JSON.stringify(this.dataForm.tagList);
                obj.pageSize = this.dataForm.tagList.length+10;
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
            this.dataForm.tagList.splice(index,1);
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


        async merchantProductViwe (productId) {

            try {
                this.dataForm.standardProductUnitId = productId;
                const res = await merchantProductViwe({id:productId});

                if (res.data.code == 0) {
                    let thtf = this;
                    this.skuList = res.data.data.skuList;
                    this.form = res.data.data.standardProductUnit;
                    console.log(this.form.merchantMapList);
                    for(let i=0;i<this.form.merchantMapList.length;i++){
                        var newObj = this.form.merchantMapList[i];
                        for (var prop in newObj)
                        {
                         this.merchatList.push({
                            id:prop,
                            name:newObj[prop]
                         });
                        }
                    }
                    //this.dataForm.merchantId = this.merchatList[0].id.toString();
                    // console.log(111);
                    if(this.form.thirdpartyAtt==11){
                        this.dataForm.merchantId=2;
                    }else if(this.form.thirdpartyAtt==12){
                        this.dataForm.merchantId="";
                    }else if(this.form.thirdpartyAtt==8){
                        this.dataForm.merchantId=4;
                    }else if(this.form.thirdpartyAtt==7){
                        this.dataForm.merchantId = "1";
                    }else{
                        this.dataForm.merchantId = 1;
                    }
                    this.categoryName = res.data.data.standardProductUnit.categoryName;
                    this.dataForm.content = res.data.data.standardProductUnit.content;
                    this.clientList = res.data.data.clientList;
                    this.companyList = res.data.data.companyList;
                    this.companyList2 = res.data.data.demoCompanyList;
                    this.companyList3 = res.data.data.competingCompanyList;
                    this.keyWordList = res.data.data.keyWordList;
                    $.each(res.data.data.sellPlatformList,function(key,info){
                        let obj = new Object();
                        obj.name = info.name;
                        obj.sellPlatformId = info.id;
                        obj.salePrice = "";
                        obj.path = "";
                        thtf.sellPlatformMerchantProdList.push(obj);
                    })
                    this.$nextTick(function() {
                        this.$refs.myQuillEditor.quill.enable(true);
                        this.$refs.myQuillEditor.quill.blur();
                    });
                    this.marchantChange();
                    console.log("success");
                } else {
                    this.$message({
                        type: 'error',
                        message: "接口成功，返回出错"
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！不通'
                });

            }
        },


        //正式公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.dataForm.companyList = arr;
        },

        //测试公司全选
        allCheck2(){
            let arr = new Array;
            $.each(this.companyList2,function(key,info){
                arr.push(info.id);
            })
            this.dataForm.demoCompanyList = arr;
        },

        //竞品公司全选
        allCheck3(){
            let arr = new Array;
            $.each(this.companyList3,function(key,info){
                arr.push(info.id);
            })
            this.dataForm.competingCompanyList = arr;
        },

        //回到上一页
        alterCaregory(){
             this.$emit('returnOnProduct');
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
        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
        handleAvatarSuccess(response){
            this.skuList[this.index].skuPicUrl = this.baseImgUrl + response.key;
        },

        //图片上传


        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },

        handleAvatarSuccess2(response,file){
            this.form.pictureDTOs.push(this.baseImgUrl + response.key);
        },

        handleAvatarSuccess3(response,file){
            this.webBannerPictureList.push(this.baseImgUrl + response.key);
        },


        delImgList (key) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.form.pictureDTOs.splice(key,1);
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

        handleAvatarSuccess1 (response) {
            this.form.picture = this.baseImgUrl + response.key;
        },


        delImgList1 () {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form.picture = null;
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

        //完成新建商品
        updateGoods () {
           let thtf = this;
           thtf.dataForm.productUnitVOList = [];
            $.each(this.skuList,function(key,info){
                let obj = new Object();
                obj.puPicUrl = info.skuPicUrl;
                // obj.salePrice = info.skuCostingPrice;
                obj.salePrice = info.salePrice;
                obj.demoSalePrice = info.demoSalePrice;
                obj.competingSalePrice = info.competingSalePrice;
                obj.skuId = info.id;
                obj.status = info.status;
                obj.name = info.puName;
                if(info.checked==undefined){
                    obj.checked = false;
                }else{
                    obj.checked = info.checked;
                }
                thtf.dataForm.productUnitVOList.push(obj);
            })

            this.nextLoading = true;
            let obj  = JSON.parse(JSON.stringify(this.dataForm));
            obj.clientList = JSON.stringify(obj.clientList);
            obj.tagList = JSON.stringify(obj.tagList);
            obj.membershipIdList = JSON.stringify(obj.membershipIdList);
            obj.storeIdList = JSON.stringify(obj.storeIdList);
            if(this.checkCompany1){
                if(this.allStatus){
                    obj.companyList = "[-1]";
                }else{
                    obj.companyList = JSON.stringify(obj.companyList);
                }
            }
            if(this.checkCompany2){
                if(this.allStatus2){
                    obj.demoCompanyList = "[-1]";
                }else{
                    obj.demoCompanyList = JSON.stringify(obj.demoCompanyList);
                }
            }
            if(this.checkCompany3){
                if(this.allStatus3){
                    obj.competingCompanyList = "[-1]";
                }else{
                    obj.competingCompanyList = JSON.stringify(obj.competingCompanyList);
                }
            }
            obj.keywordList = JSON.stringify(obj.keywordList);
            obj.productUnitVOList = JSON.stringify(obj.productUnitVOList);
            obj.picture = this.form.picture;
            obj.pictureList = JSON.stringify(this.form.pictureDTOs);
            obj.webBannerPictureList = JSON.stringify(this.webBannerPictureList);
            obj.sellPlatformMerchantProdList = JSON.stringify(this.sellPlatformMerchantProdList);
            this.saveMerchantProduct(obj)
        },
        //保存并提交
        updateRefGoods(){
            this.dataForm.status = 2;
            this.updateGoods();
        },
        async saveMerchantProduct(obj){
            try {
                const res = await saveMerchantProduct(obj);

                if (res.data.code == 0) {
                    this.nextLoading = false;
                    this.$emit('toparentevent1');
                } else {
                    this.nextLoading = false;
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.nextLoading = false;
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },


    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
    text-align:center;
}
.text{
    font-size:16px;
    line-height:36px;
}
.el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;

    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    width: 68px;
    height: 28px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
}
.skuList .avatar-uploader{
    display:inline-block;
    width:40px;
    height:40px;
}
.skuList .avatar-uploader img{
    width:100%;
    height:100%;

}

    .skuList .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width:100%;
        height:100%;
        line-height:40px;
        text-align: center;
    }
 .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
    .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

</style>


