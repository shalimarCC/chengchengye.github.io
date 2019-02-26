<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="企业名称" v-model="ruleForm.companyName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" style="float:right" @click="addFirm" size="medium" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="企业名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="100">
           <template slot-scope="scope">
                {{setTime(scope.row.createTime)}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="有效状态" min-width="100">
           <template slot-scope="scope">
                <span v-if="scope.row.status == 0">有效</span>
                <span v-else>失效</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否为测试公司" min-width="100">
           <template slot-scope="scope">
                <span v-if="scope.row.isTest == 0">否</span>
                <span v-else-if="scope.row.isTest == 1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="100">
           <template slot-scope="scope">
                {{scope.row.companyContent}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="公司类型" min-width="100">
           <template slot-scope="scope">
                <span v-if="scope.row.companyType == 0">正式公司</span>
                <span v-else-if="scope.row.companyType == 1">演示公司</span>
                <span v-else-if="scope.row.companyType == 2">竞品公司</span>
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button type="primary" size="small" :disabled="scope.row.id == 1" plain @click="editFirm(scope.row.id)">编辑</el-button>
                <el-button type="warning" size="small" v-if="scope.row.status == 0" plain @click="companyInvalid(scope.row.id,1,0)">设为失效</el-button>
                <el-button type="primary" v-if="scope.row.status == 1" size="small" plain @click="setUserful(scope.row.id,0)">设为有效</el-button>
                <el-button type="success" size="small" plain @click="setFirm(scope.row.id)">机构设置</el-button>
            </template>
        </el-table-column>

    </el-table>

    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="ruleForm.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="ruleForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>


    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">

        <el-form label-width="150px">
            <el-form-item label="企业名称" :required="true">
                <el-input v-model="firmForm.companyName"></el-input>
            </el-form-item>

            <el-form-item label="是否为测试公司">
                <el-radio-group v-model="firmForm.isTest">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="企业logo" prop="listSort">
                <el-upload
                    class="avatar-uploader"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm">
                    <img v-if="firmForm.companyLogo" :src="firmForm.companyLogo" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

                <div style="padding: 3px;position:absolute;top:0;left:10px;">
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleRemove" style="padding:7px;"></el-button>
                </div>
            </el-form-item>

            <el-form-item label="企业logo跳转配置" style="text-align:left;">
                <el-select v-model="link1.linkType" @change="skipTypeChange">
                    <el-option
                        v-for="item in bannerSkipList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--本地参数-->
            <el-form-item label="配置参数" prop="name" v-if="link1.linkType==1">
                <el-select v-model="link1.linkId" @change="pageSkipChange">
                    <el-option
                        v-for="item in pageSkip"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <!-- 本地参数特殊跳转 -->
            <el-form-item label="参数1" v-if="link1.linkType==1 && (link1.linkId == 17 || link1.linkId == 63)" style="margin-bottom:6px;">
                <el-select v-model="link1.extParam[0].value"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="forceUp"
                    >
                    <el-option
                        v-for="item in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="link1.linkType==1 && (link1.linkId == 20 || link1.linkId == 66)" style="margin-bottom:6px;">
                <el-select v-model="link1.extParam[0].value"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="forceUp"
                    >
                    <el-option
                        v-for="item in storeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="link1.linkType==1 && (link1.linkId == 25 || link1.linkId == 71)" style="margin-bottom:6px;">
                <el-select v-model="link1.extParam[0].value"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="forceUp"
                    >
                    <el-option
                        v-for="item in categoryTreeList"
                        :key="item.categoryTreeId"
                        :label="item.categoryTreeName"
                        :value="item.categoryTreeId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="link1.linkType==1 && (link1.linkId == 53 || link1.linkId == 85)" style="margin-bottom:6px;">
                <el-select v-model="link1.extParam[0].value" @change="forceUp">
                    <el-option
                        :key="1"
                        label="满减券"
                        value="1">
                    </el-option>
                    <el-option
                        :key="2"
                        label="兑换券"
                        value="2">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--H5内链-->
            <el-form-item label="配置参数" prop="name" v-if="link1.linkType==2">
                <el-input v-model="link1.linkUrl" style="width:200px;"></el-input>
            </el-form-item>
            <!--H5外链-->
            <el-form-item label="配置参数" prop="name" v-if="link1.linkType==3">
                <el-select v-model="link1.linkId">
                    <el-option
                        v-for="item in urlList"
                        :key="item.externalLinkId"
                        :label="item.externalLinkName"
                        :value="item.externalLinkId">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--商品组合-->
            <el-form-item label="移动端页面" v-if="link1.linkType==4">
                <el-select v-model="link1.linkableButtonPageList[1].cmsPageId" placeholder="跳转页面" @focus="getCmsMpage" @change="forceUp">
                    <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="PC端页面" v-if="link1.linkType==4">
                <el-select v-model="link1.linkableButtonPageList[0].cmsPageId" placeholder="跳转页面" @focus="getCmsPcpage" @change="forceUp">
                    <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="name" v-if="link1.linkType==4">
                <el-select v-model="link1.linkId" @change="forceUp">
                    <el-option
                        v-for="item in classifyList"
                        :key="item.standardUnitCombinationId"
                        :label="item.combinationName"
                        :value="item.standardUnitCombinationId">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--单个商品-->
            <el-form-item label="配置商品" prop="name" v-else-if="link1.linkType==5">
                <el-select
                    v-model="link1.linkId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    @change="forceUp"
                >
                    <el-option
                        v-for="item in goodsList"
                        :key="item.standardUnitId"
                        :label="item.standardUnitName"
                        :value="item.standardUnitId">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--操作配置-->
            <el-form-item label="配置参数" prop="name" v-if="link1.linkType==8">
                <el-select v-model="link1.linkId" @change="forceUp">
                    <el-option
                        v-for="item in pageDo"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 操作配置特殊跳转 -->
            <el-form-item label="参数1" v-if="link1.linkType==8 && (link1.linkId == 1 || link1.linkId == 6)">
                <el-input v-model="link1.extParam[0].value" placeholder="关键词1" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数2" v-if="link1.linkType==8 && (link1.linkId == 1 || link1.linkId == 6)">
                <el-input v-model="link1.extParam[1].value" placeholder="关键词2" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数3" v-if="link1.linkType==8 && (link1.linkId == 1 || link1.linkId == 6)">
                <el-input v-model="link1.extParam[2].value" placeholder="关键词3" style="width:224px;"></el-input>
            </el-form-item>
            <div v-if="link1.linkType==8">
                <el-form-item label="参数1" v-if="link1.linkId == 2 || link1.linkId == 3 || link1.linkId == 7 || link1.linkId == 8">
                    <el-select v-model="link1.extParam[0].value"
                               filterable
                               reserve-keyword
                               placeholder="请输入商品规格"
                               remote
                               @change="forceUp"
                    >
                        <el-option
                            v-for="item in puList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数2" v-if="link1.linkId == 2 || link1.linkId == 3 || link1.linkId == 7 || link1.linkId == 8">
                    <el-input v-model="link1.extParam[1].value" placeholder="规格数量" style="width:224px;"></el-input>
                </el-form-item>
                <el-form-item label="参数1" v-if="link1.linkId == 4 || link1.linkId == 9">
                    <el-select v-model="link1.extParam[0].value"
                               filterable
                               reserve-keyword
                               placeholder="优惠券批次名称"
                               remote
                               @change="forceUp"
                    >
                        <el-option
                            v-for="item in dataSource1"
                            :key="item.id"
                            :label="item.couponBatchName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数1" v-if="link1.linkId == 5 || link1.linkId == 10">
                    <el-select v-model="link1.extParam[0].value"
                               filterable
                               reserve-keyword
                               placeholder="优惠券批次名称"
                               remote
                               @change="forceUp"
                    >
                        <el-option
                            v-for="item in dataSource2"
                            :key="item.id"
                            :label="item.couponBatchName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label="平台logo跳转配置" style="text-align:left;">
                <el-select v-model="link2.linkType" @change="skipTypeChange2">
                    <el-option
                        v-for="item in bannerSkipList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--本地参数-->
            <el-form-item label="配置参数" prop="name" v-if="link2.linkType==1">
                <el-select v-model="link2.linkId" @change="pageSkipChange">
                    <el-option
                        v-for="item in pageSkip"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <!-- 本地参数特殊跳转 -->
            <el-form-item label="参数1" v-if="link2.linkType==1 && (link2.linkId == 17 || link2.linkId == 63)" style="margin-bottom:6px;">
                <el-select v-model="link2.extParam[0].value"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="forceUp"
                    >
                    <el-option
                        v-for="item in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="link2.linkType==1 && (link2.linkId == 20 || link2.linkId == 66)" style="margin-bottom:6px;">
                <el-select v-model="link2.extParam[0].value"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="forceUp"
                    >
                    <el-option
                        v-for="item in storeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="link2.linkType==1 && (link2.linkId == 25 || link2.linkId == 71)" style="margin-bottom:6px;">
                <el-select v-model="link2.extParam[0].value"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="forceUp"
                    >
                    <el-option
                        v-for="item in categoryTreeList"
                        :key="item.categoryTreeId"
                        :label="item.categoryTreeName"
                        :value="item.categoryTreeId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="link2.linkType==1 && (link2.linkId == 53 || link2.linkId == 85)" style="margin-bottom:6px;">
                <el-select v-model="link2.extParam[0].value" @change="forceUp">
                    <el-option
                        :key="1"
                        label="满减券"
                        value="1">
                    </el-option>
                    <el-option
                        :key="2"
                        label="兑换券"
                        value="2">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--H5内链-->
            <el-form-item label="配置参数" prop="name" v-if="link2.linkType==2">
                <el-input v-model="link2.linkUrl" style="width:200px;"></el-input>
            </el-form-item>
            <!--H5外链-->
            <el-form-item label="配置参数" prop="name" v-if="link2.linkType==3">
                <el-select v-model="link2.linkId" @change="forceUp">
                    <el-option
                        v-for="item in urlList"
                        :key="item.externalLinkId"
                        :label="item.externalLinkName"
                        :value="item.externalLinkId">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--商品组合-->
            <el-form-item label="移动端页面" v-if="link2.linkType==4">
                <el-select v-model="link2.linkableButtonPageList[1].cmsPageId" placeholder="跳转页面" @focus="getCmsMpage" @change="forceUp">
                    <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="PC端页面" v-if="link2.linkType==4">
                <el-select v-model="link2.linkableButtonPageList[0].cmsPageId" placeholder="跳转页面" @focus="getCmsPcpage" @change="forceUp">
                    <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="name" v-if="link2.linkType==4">
                <el-select v-model="link2.linkId" @change="forceUp">
                    <el-option
                        v-for="item in classifyList"
                        :key="item.standardUnitCombinationId"
                        :label="item.combinationName"
                        :value="item.standardUnitCombinationId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="配置商品" prop="name" v-else-if="link2.linkType==5">
                <el-select
                    v-model="link2.linkId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    @change="forceUp"
                >
                    <el-option
                        v-for="item in goodsList"
                        :key="item.standardUnitId"
                        :label="item.standardUnitName"
                        :value="item.standardUnitId">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--操作配置-->
            <el-form-item label="配置参数" prop="name" v-if="link2.linkType==8">
                <el-select v-model="link2.linkId" @change="forceUp">
                    <el-option
                        v-for="item in pageDo"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 操作配置特殊跳转 -->
            <el-form-item label="参数1" v-if="link2.linkType==8 && (link2.linkId == 1 || link2.linkId == 6)">
                <el-input v-model="link2.extParam[0].value" placeholder="关键词1" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数2" v-if="link1.linkType==8 && (link2.linkId == 1 || link2.linkId == 6)">
                <el-input v-model="link2.extParam[1].value" placeholder="关键词2" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数3" v-if="link1.linkType==8 && (link2.linkId == 1 || link2.linkId == 6)">
                <el-input v-model="link2.extParam[2].value" placeholder="关键词3" style="width:224px;"></el-input>
            </el-form-item>
            <div v-if="link2.linkType==8">
                <el-form-item label="参数1" v-if="link2.linkId == 2 || link2.linkId == 3 || link2.linkId == 7 || link2.linkId == 8">
                    <el-select v-model="link2.extParam[0].value"
                               filterable
                               reserve-keyword
                               placeholder="请输入商品规格"
                               remote
                               @change="forceUp"
                    >
                        <el-option
                            v-for="item in puList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数2" v-if="link2.linkId == 2 || link2.linkId == 3 || link2.linkId == 7 || link2.linkId == 8">
                    <el-input v-model="link2.extParam[1].value" placeholder="规格数量" style="width:224px;"></el-input>
                </el-form-item>
                <el-form-item label="参数1" v-if="link2.linkId == 4 || link2.linkId == 9">
                    <el-select v-model="link2.extParam[0].value"
                               filterable
                               reserve-keyword
                               placeholder="优惠券批次名称"
                               remote
                               @change="forceUp"
                    >
                        <el-option
                            v-for="item in dataSource1"
                            :key="item.id"
                            :label="item.couponBatchName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数1" v-if="link2.linkId == 5 || link2.linkId == 10">
                    <el-select v-model="link2.extParam[0].value"
                               filterable
                               reserve-keyword
                               placeholder="优惠券批次名称"
                               remote
                               @change="forceUp"
                    >
                        <el-option
                            v-for="item in dataSource2"
                            :key="item.id"
                            :label="item.couponBatchName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label="背景图片" prop="listSort">
                <el-upload
                    class="avatar-uploader"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess2"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm">
                    <img v-if="firmForm.backgrondImg" :src="firmForm.backgrondImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

           <el-form-item label="企业备注">
                <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="firmForm.companyContent">
                </el-input>
            </el-form-item>

            <el-form-item label="公司类型" style="text-align:left;" :required="true">
                <el-select v-model="firmForm.companyType" placeholder="公司类型" style="width: 200px;margin-right:15px;">
                    <el-option
                        v-for="item in companyTypeList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="页面信息配置" prop="name">
                <el-table :key='tableKey' :data="firmForm.companyPageList" border fit highlight-current-row style="width: 100%">
                    <el-table-column
                    label="信息"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="配置"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span style="position:relative;">
                                <el-radio v-model="scope.row.showOrNot" :label="0">停用</el-radio>
                                <el-radio v-model="scope.row.showOrNot" :label="1">启用</el-radio>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="移动端分页配置" prop="name">
                <el-table :key='tableKey1' :data="firmForm.cmsPageTabList" border fit highlight-current-row style="width: 100%">
                    <el-table-column
                        label="分页名称"
                        min-width="100"
                        align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.value}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="配置"
                        min-width="100"
                        align="center">
                        <template slot-scope="scope">
                            <span style="position:relative;">
                                <el-switch
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="0"
                                    :disabled="scope.row.type==1||scope.row.type==4"
                                    v-model="scope.row.status"></el-switch>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="显示企业Logo"
                        min-width="100"
                        align="center">
                        <template slot-scope="scope">
                            <span style="position:relative;">
                                <el-switch
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.showClientLogo"></el-switch>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="显示平台Logo"
                        min-width="100"
                        align="center">
                        <template slot-scope="scope">
                            <span style="position:relative;">
                                <el-switch
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.showPlatformLogo"></el-switch>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateCompanyByIdWithTx">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogFormVisible2">
        <h2 class="warntext">
            是否恢复企业失效前变更的员工在职状态？如果需要重新导入名单，请选择否
        </h2>
        <div class="btnsInwarn">
            <el-button type="primary" size="small" plain @click="setComfirm">是</el-button>
            <el-button type="primary" size="small" plain @click="setComfirmNo">否</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import cmsLinkSkip from '../cms/cmsLinkSkip.vue';
import {
    findStoreByPlatformId,
    findStoreAllInfo,
    findCommodityProductUnitLimit,
    findCategoryTreeAll,
    findCompanyOfPage,
    getQiNiuToken,
    insertOrUpdateCompanyWithTx,
    findCompanyById,
    companyInvalid,
    findCmsPageAllByClientType,
    findExternalLinkAll,
    queryStandardUnitCombinationAll,
    findByStandardUnitName,
    findCmsLocalParamAll,
    findCouponBatchOfPage
} from '../../../api/getData';
export default {
    data() {
        return {
            imgForm:{
                key:'',
                token:'',
            },
            ruleForm:{
                companyName:'',
                pageNo:1,
                pageSize:10
            },
            client:{
              type:'',
                url2:'',
                url:''
            },
            puList:[],
            storeList:[],
            categoryTreeList:[],
            baseImgPath:'',
            baseImgUrl:'',
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            tableKey1: 0,
            dialogFormVisible:false,
            dialogFormVisible2:false,
            dialogTitle:'新增企业',
            firmForm:{
                companyName:'',
                companyContent:'',
                id:'',
                backgrondImg:'',
                companyLogo:'',
                isTest:0,
                companyType:'',
                companyPageList:[
                    {
                        type:1,
                        name:'我的订单',
                        showOrNot:0
                    },
                    {
                        type:2,
                        name:'保险订单',
                        showOrNot:0
                    },
                    {
                        type:3,
                        name:'我的体检',
                        showOrNot:0
                    }
                ],
                cmsPageTabList:[

                ],

            },
            link1:{
                linkId:'',
                linkUrl:'',
                linkType:'',
                linkParam:'',
                logoType:'company',
                linkableButtonPageList:[{
                    cmsPageId:'',
                    clientType:'5'
                },
                  { cmsPageId:'',
                    clientType:'6'
                }],
                extParam:[{
                    name:'extParam1',
                    value:''
                },{
                    name:'extParam2',
                    value:''
                },
                    {
                        name:'extParam3',
                        value:''
                    },
                ],
            },
            link2:{
                linkId:'',
                linkUrl:'',
                linkType:'',
                linkParam:'',
                logoType:'platform',
                linkableButtonPageList:[{
                    cmsPageId:'',
                    clientType:'5'
                },
                    { cmsPageId:'',
                      clientType:'6'
                }],
                extParam:[{
                    name:'extParam1',
                    value:''
                },{
                    name:'extParam2',
                    value:''
                },
                    {
                        name:'extParam3',
                        value:''
                    },
                ],
            },
            companyTypeList:[
                {
                    key:"正式公司",
                    value:0
                },
                {
                    key:"演示公司",
                    value:1
                },
                {
                    key:"竞品公司",
                    value:2
                },
            ],
            bannerSkipList:[
                {
                    value:1,
                    key:'本地参数'
                },
                {
                    value:2,
                    key:'H5链接（内部）'
                },
                {
                    value:3,
                    key:'H5链接（外部）'
                },
                {
                    value:4,
                    key:'商品组合'
                },
                {
                    value:5,
                    key:'单个商品'
                },
                {
                    value:6,
                    key:'无效果'
                },
                {
                    value:8,
                    key:'配置选项'
                },
            ],
            compId:'',
            statustype:'',
            clientTypeDate:'',
            pageSkip:'',
            urlList:'',
            classifyList:'',
            goodsList:'',
            pageDo:'',
            dataSource1:''
        }
    },
    components: {
        cmsLinkSkip
    },
    created() {
        this.findCompanyOfPage();
        this.findCmsLocalParamAll();
        this.findExternalLinkAll();
        this.queryStandardUnitCombinationAll();
        this.findByStandardUnitName();
        this.findCmsLocalParamAll2();
        this.findCmsPageAllByClientType();
        this.findCouponBatchOfPage1();
        this.findCouponBatchOfPage2();
        this.findCategoryTreeAll();
        this.findCommodityProductUnitLimit();
        this.findStoreAllInfo();
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
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

    methods: {
        skipTypeChange(){
           // this.$forceUpdate();
            this.link1.linkId = '';
            this.link1.linkUrl = '';
            this.link1.linkParam = '';
            this.link1.linkableButtonPageList = [{
                    cmsPageId:'',
                    clientType:'5'
                },
                  { cmsPageId:'',
                    clientType:'6'
                }];
            this.link1.extParam=[{
                    name:'extParam1',
                    value:''
                },{
                    name:'extParam2',
                    value:''
                },
                    {
                        name:'extParam3',
                        value:''
                    },
                ];
        },
        skipTypeChange2(){
            this.link2.linkId = '';
            this.link2.linkUrl = '';
            this.link2.linkParam = '';
            this.link2.linkableButtonPageList = [{
                    cmsPageId:'',
                    clientType:'5'
                },
                  { cmsPageId:'',
                    clientType:'6'
                }];
            this.link2.extParam=[{
                    name:'extParam1',
                    value:''
                },{
                    name:'extParam2',
                    value:''
                },
                    {
                        name:'extParam3',
                        value:''
                    },
                ];
        },
        //强制刷新
        forceUp(){
            this.$forceUpdate();
        },
        //本地参数跳转
        pageSkipChange(val){
            console.log(val)
            this.$forceUpdate();
            if(val == 17){
                this.findCmsPageAllByClientType('',5);
            }else if(val == 18){
                this.findCmsPageAllByClientType('',5);
            }
        },
        getCmsPcpage(){
            this.findCmsPageAllByClientType(5,'');
        },
        getCmsMpage(){
            this.findCmsPageAllByClientType(6,'');
        },
        //通过客户端类型查询商品页列表5:pc6:移动
        async findCmsPageAllByClientType (type,pageType) {
            try {
                const res = await findCmsPageAllByClientType({clientType:type,templateType:pageType});
                if (res.data.code == 0) {
                    this.clientTypeDate = res.data.data;
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
        //获取本地链接参数
        async findCmsLocalParamAll () {
            try {
                const res = await findCmsLocalParamAll({type:1});
                if (res.data.code == 0) {
                    this.pageSkip = res.data.data;
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
        //查询所有前台类目树
        async findCategoryTreeAll () {
            try {
                const res = await findCategoryTreeAll();
                if (res.data.code == 0) {
                    this.categoryTreeList = res.data.data;
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
        //获取门店列表
        async findStoreAllInfo () {
            try {
                const res = await findStoreByPlatformId();
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
        //获取优惠券批次列表
        // async findCouponBatchOfPage() {
        //     try {
        //         const res = await findCouponBatchOfPage({pageNo:1,pageSize:50});
        //         if (res.data.code == 0) {
        //             this.dataSource1 = res.data.data.list;
        //         } else {
        //             this.$message({
        //                 type: 'error',
        //                 message: res.data.error
        //             });
        //         }
        //     } catch (err) {
        //         this.$message({
        //             type: 'error',
        //             message: '获取数据失败,请联系管理员！404'
        //         });

        //     }
        // },
         //领用优惠券//5
        async findCouponBatchOfPage1() {
            try {
                const res = await findCouponBatchOfPage({pageNo:1,pageSize:50,grantType:1,getType:0,couponRelType:0,isEffect:0});
                if (res.data.code == 0) {
                    this.dataSource2 = res.data.data.list;
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
        //领取优惠券//4
        async findCouponBatchOfPage2() {
            try {
                const res = await findCouponBatchOfPage({pageNo:1,pageSize:50,grantType:1,getType:0,isEffect:0});
                if (res.data.code == 0) {
                    this.dataSource1 = res.data.data.list;
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
        //查询前50条pu接口
        async findCommodityProductUnitLimit(){
            try {
                const res = await findCommodityProductUnitLimit();
                if (res.data.code == 0) {
                    this.puList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！pu接口连接失败'
                });

            }
        },
        //查询所有外部链接接口
        async findExternalLinkAll () {
            try {
                const res = await findExternalLinkAll();
                if (res.data.code == 0) {
                    this.urlList = res.data.data;
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
        //查询所有su分组信息接口
        async queryStandardUnitCombinationAll () {
            try {
                const res = await queryStandardUnitCombinationAll();
                if (res.data.code == 0) {
                    this.classifyList = res.data.data;
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
        //查询所有su信息接口
        async findByStandardUnitName (name,id) {
            try {
                let obj = new Object();
                if(name!=''){
                    obj.standardUnitName = name;
                }else{
                    obj.standardUnitId = id;
                }
                const res = await findByStandardUnitName(obj);
                if (res.data.code == 0) {
                    // this.loading = false;
                    this.goodsList = res.data.data;
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
        async findCmsLocalParamAll2 () {
            try {
                const res = await findCmsLocalParamAll({type:2});
                if (res.data.code == 0) {
                    this.pageDo = res.data.data;
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
        handleRemove(){
            this.firmForm.companyLogo = '';
        },
        //获取列表
        async findCompanyOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCompanyOfPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.totalSize;
                    this.dataSource = res.data.data.list;
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

        //分页
        handleSizeChange(val) {
            this.limit = val;
            this.findCompanyOfPage()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.findCompanyOfPage()
        },
        //重置
        resetForm() {
            this.ruleForm = {
                companyName:'',
                pageNo:1,
                pageSize:10
            },
            this.findCompanyOfPage();
        },
        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findCompanyOfPage();
        },

        //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            let h = t.getHours();
            let f = t.getMinutes();
            let s = t.getSeconds();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }
            if (h < 10) {
                h = '0' + h
            }
            if (f < 10) {
                f = '0' + f
            }
            if (s < 10) {
                s = '0' + s
            }
            return y + '-' + m + '-' + d
        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
        },

        //新增企业
        addFirm(){
            this.link1.linkType = '';
            this.link1.linkId = '';
            this.link1.linkUrl = '';
            this.link1.linkParam = '';
            this.link1.linkableButtonPageList = [{
                    cmsPageId:'',
                    clientType:'5'
                },
                  { cmsPageId:'',
                    clientType:'6'
                }];
            this.link1.extParam=[{
                    name:'extParam1',
                    value:''
                },{
                    name:'extParam2',
                    value:''
                },
                    {
                        name:'extParam3',
                        value:''
                    },
                ];
            this.link2.linkType = '';
            this.link2.linkId = '';
            this.link2.linkUrl = '';
            this.link2.linkParam = '';
            this.link2.linkableButtonPageList = [{
                    cmsPageId:'',
                    clientType:'5'
                },
                  { cmsPageId:'',
                    clientType:'6'
                }];
            this.link2.extParam=[{
                    name:'extParam1',
                    value:''
                },{
                    name:'extParam2',
                    value:''
                },
                    {
                        name:'extParam3',
                        value:''
                    },
                ];
            this.firmForm = {
                companyName:'',
                companyContent:'',
                id:'',
                backgrondImg:'',
                companyLogo:'',
                isTest:0,
                companyPageList:[
                    {
                        type:1,
                        name:'我的订单',
                        showOrNot:0
                    },
                    {
                        type:2,
                        name:'保险订单',
                        showOrNot:0
                    },
                    {
                        type:3,
                        name:'我的体检',
                        showOrNot:0
                    }
                ],
                companyType:''
            };
            this.dialogTitle = '新增企业';
            this.dialogFormVisible = true;
        },

        //保存
        async updateCompanyByIdWithTx(){
            try {
                let obj = JSON.parse(JSON.stringify(this.firmForm));
                obj.companyPageList = JSON.stringify(this.firmForm.companyPageList);
                obj.cmsPageTabList = JSON.stringify(this.firmForm.cmsPageTabList);
                let linkJson = [];
                linkJson.push(this.link1);
                linkJson.push(this.link2);
                obj.linkJson = JSON.stringify(linkJson);
                // console.log(obj)
                const res = await insertOrUpdateCompanyWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findCompanyOfPage();
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

        //修改企业
        async editFirm(id){
            try {
                const res = await findCompanyById({ companyId:id });
                this.dialogTitle = '修改企业信息';
                if (res.data.code == 0) {

                    this.dialogFormVisible = true;
                    this.firmForm = {
                        companyName:res.data.data.companyName,
                        companyContent:res.data.data.companyContent,
                        id:res.data.data.companyId,
                        isTest:res.data.data.isTest,
                        backgrondImg:res.data.data.backgrondImg,
                        companyLogo:res.data.data.companyLogo,
                        companyPageList:res.data.data.companyPageList,
                        cmsPageTabList:res.data.data.cmsPageTabList,
                        companyType:res.data.data.companyType
                    };
                    if(res.data.data.linkJson.length>0){
                        // //回显一个
                        if(res.data.data.linkJson[0].logoType=='platform'){
                            this.link2=res.data.data.linkJson[0];
                            this.link2.extParam[0].value = res.data.data.linkJson[0].extParam[2].value;
                            this.link2.extParam[1].value = res.data.data.linkJson[0].extParam[1].value;
                            this.link2.extParam[2].value = res.data.data.linkJson[0].extParam[0].value;
                            this.link1 = res.data.data.linkJson[1];
                            this.link1.extParam[0].value = res.data.data.linkJson[1].extParam[2].value;
                            this.link1.extParam[1].value = res.data.data.linkJson[1].extParam[1].value;
                            this.link1.extParam[2].value = res.data.data.linkJson[1].extParam[0].value;

                            if(!res.data.data.linkJson[0].linkableButtonPageList){
                                this.link2.linkableButtonPageList=[{
                                    cmsPageId:'',
                                    clientType:'5'
                                },
                                    { cmsPageId:'',
                                        clientType:'6'
                                    }]
                            }
                        }else if(res.data.data.linkJson[0].logoType=='company'){
                            this.link1=res.data.data.linkJson[0];
                            this.link1.extParam[0].value = res.data.data.linkJson[0].extParam[2].value;
                            this.link1.extParam[1].value = res.data.data.linkJson[0].extParam[1].value;
                            this.link1.extParam[2].value = res.data.data.linkJson[0].extParam[0].value;
                            console.log(this.link1);
                            console.log(res.data.data.linkJson[0]);
                            this.link2 = res.data.data.linkJson[1];
                            this.link2.extParam[0].value = res.data.data.linkJson[1].extParam[2].value;
                            this.link2.extParam[1].value = res.data.data.linkJson[1].extParam[1].value;
                            this.link2.extParam[2].value = res.data.data.linkJson[1].extParam[0].value;
                            console.log(this.link2);
                            console.log(res.data.data.linkJson[1]);
                            if(!res.data.data.linkJson[0].linkableButtonPageList){
                                this.link1.linkableButtonPageList=[{
                                    cmsPageId:'',
                                    clientType:'5'
                                },
                                    { cmsPageId:'',
                                        clientType:'6'
                                    }]
                            }
                        }
                        if(res.data.data.linkJson.length>1){
                            var _this= this;
                            $.each(res.data.data.linkJson,function (key,info) {
                                if(!info.linkableButtonPageList){
                                    info.linkableButtonPageList =[{
                                        cmsPageId:'',
                                        clientType:'5'
                                    },
                                        { cmsPageId:'',
                                            clientType:'6'
                                        }]
                                }
                                if(info.logoType=='company'){
                                    _this.link1 = info;
                                }else if(info.logoType=='platform'){
                                    _this.link2 =info;
                                }
                            })
                        }
                    }else{
                        this.link1={
                                    linkId:'',
                                    linkUrl:'',
                                    linkType:'',
                                    linkParam:'',
                                    logoType:'company',
                                    linkableButtonPageList:[{
                                    cmsPageId:'',
                                    clientType:'5'
                                },
                                    { cmsPageId:'',
                                        clientType:'6'
                                    }],
                                    extParam:[{
                                    name:'extParam1',
                                    value:''
                                },{
                                    name:'extParam2',
                                    value:''
                                },
                                    {
                                        name:'extParam3',
                                        value:''
                                    },
                                ],
                            };
                        this.link2={
                                linkId:'',
                                linkUrl:'',
                                linkType:'',
                                linkParam:'',
                                logoType:'platform',
                                linkableButtonPageList:[{
                                    cmsPageId:'',
                                    clientType:'5'
                                },
                                    { cmsPageId:'',
                                        clientType:'6'
                                    }],
                                extParam:[{
                                    name:'extParam1',
                                    value:''
                                },{
                                    name:'extParam2',
                                    value:''
                                },
                                    {
                                        name:'extParam3',
                                        value:''
                                    },
                                ],
                            }
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
        //有效设置
        setUserful(id,status){
            this.compId = id;
            this.statustype = status;
            this.dialogFormVisible2 = true;
        },
        setComfirmNo(){
            this.companyInvalid(this.compId,this.statustype,0);
            this.dialogFormVisible2 = false;
        },
        setComfirm(){
            this.companyInvalid(this.compId,this.statustype,1);
            this.dialogFormVisible2 = false;
        },
        //修改企业
        async companyInvalid(id,type,user){
            try {
                const res = await companyInvalid({ companyId:id,validType:type,recoverUser:user});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '设置成功'
                    });
                    this.findCompanyOfPage()
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
        setFirm(id){
            this.$router.push("/section/"+id)
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
        handleAvatarSuccess1(response){
            this.firmForm.companyLogo = this.baseImgUrl + response.key;
        },
        handleAvatarSuccess2(response){
            this.firmForm.backgrondImg = this.baseImgUrl + response.key;
        },
    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
  .warntext{
    font-weight: normal;
    font-size: 16px;
    text-align: center;
    padding-bottom:30px;
  }
  .btnsInwarn{
      text-align:center;
  }
</style>


