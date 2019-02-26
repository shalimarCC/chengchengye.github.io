<template>
    <div id="contentCon">
      <template v-if="active==1">
        <el-form ref="form" :model="form" label-width="120px" class="formList">
            <el-form-item label="页面名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="所属模板">
                <el-select class="filter-item" v-model="form.templateId" placeholder="请选择模板" @change="findTemplate(form.templateId)">
                    <el-option
                    v-for="item in tempList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属独立公司">
                <el-select v-model="form.companyId" :disabled="allStatus.length>0" @change="getCompanyId(form.companyId)">
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox-group v-model="allStatus" @change="getAllstatus">
                    <el-checkbox :label="-1" v-if="form.companyType==0">全部正式公司可见</el-checkbox>
                    <el-checkbox :label="-2" v-if="form.companyType==2">全部竞品公司可见</el-checkbox>
                    <el-checkbox :label="-3" v-if="form.companyType==1">全部演示公司可见</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- 活动页基础信息配置 -->
            <div v-if="form.tempFormBasic" v-for="(info,key) in form.tempFormBasic" :key="key">
                <el-form-item v-if="info.type == 4">
                    <el-checkbox v-model="info.value" @change="handleCheck(info.id,info.value)">{{info.name}}</el-checkbox>
                </el-form-item>
                <!-- 指定宽高比 -->
                <div class="scaleIn" v-if="checkshow == true">
                    <el-form-item :label="info.name" v-if="info.id == 10 && info.type == 2">
                        <span class="scale">&nbsp;<el-input style="width:50px;" v-model="info.value"></el-input></span>
                        <span class="remarkwarn">{{info.label}}</span>
                    </el-form-item>
                </div>
                <!-- 标题栏设置 -->
                <div v-if="titleshow == true">
                    <div v-if="info.group == 12">
                        <el-form-item :label="info.name" v-if="info.type == 2">
                            <el-input style="width:250px;" v-model="info.value"></el-input>
                            <span>{{info.units}}</span>
                        </el-form-item>
                        <el-form-item v-if="info.type == 5">
                            <el-radio-group v-model="info.value" @change="radioCheck(info.value)">
                                <el-radio :label="2">图文标题</el-radio>
                                <el-radio :label="1">文字标题</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div v-if="textTitle == true && info.group ==15">
                        <el-form-item :label="info.name" v-if="info.type == 2 && (info.id == 17 || info.id == 63)">
                            <el-input style="width:150px;" v-model="info.value" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item :label="info.name" v-if="info.type == 2 && info.id != 17 && info.id != 63">
                            <el-input style="width:50px;" v-model="info.value"></el-input>
                            <span>{{info.units}}</span>
                        </el-form-item>
                    </div>
                    <div v-if="imgTitle == true" class="eleIcstyle" style="padding-left: 120px">
                        <el-form-item v-if="info.type == 6 && info.id == 19" :label="info.name">
                            <el-upload
                            class="avatar-uploader"
                            :action="baseImgPath"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-error="handleError"
                            :data="imgForm">
                            <img v-if="info.value" :src="info.value">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item :label="info.name" v-if="info.type == 7 && info.id == 16">
                            <el-select v-model="form.skipTypeTitle" placeholder="请选择跳转配置">
                                <el-option
                                    v-for="item in bannerSkipList"
                                    :key="item.value"
                                    :label="item.key"
                                    :value="item.value">
                                </el-option>
                        </el-select>
                        </el-form-item>
                        <div v-if="info.id == 16">
                            <cms-link-skip :skipType="form.skipTypeTitle" v-on:getskipDate="getcmsSkipDate"></cms-link-skip>
                        </div>
                    </div>
                </div>
                <!-- 导航栏右上角图标 -->
                <el-form-item v-if="info.id == 20 && info.value == 1">
                        <div class="rightIcon">
                            <p>
                            <el-form-item label="icon1">
                                <el-select v-model="form.iconId1" placeholder="请选择">
                                    <el-option
                                        v-for="item in iconList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <span v-if="form.iconId1 == 5">
                                <el-upload
                                class="avatar-uploader"
                                :action="baseImgPath"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess1"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleError"
                                :data="imgForm">
                                <img v-if="form.iconImgUrl1" :src="form.iconImgUrl1">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </span>
                            <el-form-item label="icon跳转页面" v-if="form.iconId1 == 5">
                                <el-select v-model="form.linkType1" placeholder="请选择">
                                    <el-option
                                        v-for="item in bannerSkipList"
                                        :key="item.value"
                                        :label="item.key"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div v-if="form.iconId1 == 5">
                                <cms-link-skip :skipType="form.linkType1" v-on:getskipDate="getcmsSkipDateicon1"></cms-link-skip>
                            </div>
                            </p>
                            <p>
                                <el-form-item label="icon2">
                                    <el-select v-model="form.iconId2" placeholder="请选择">
                                        <el-option
                                            v-for="item in iconList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <span v-if="form.iconId2 == 5">
                                    <el-upload
                                    class="avatar-uploader"
                                    :action="baseImgPath"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess2"
                                    :before-upload="beforeAvatarUpload"
                                    :on-error="handleError"
                                    :data="imgForm">
                                    <img v-if="form.iconImgUrl2" :src="form.iconImgUrl2">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </span>
                                <el-form-item label="icon跳转页面" v-if="form.iconId2 == 5">
                                    <el-select v-model="form.linkType2" placeholder="请选择">
                                        <el-option
                                            v-for="item in bannerSkipList"
                                            :key="item.value"
                                            :label="item.key"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <div v-if="form.iconId2 == 5">
                                    <cms-link-skip :skipType="form.linkType2" v-on:getskipDate="getcmsSkipDateicon2"></cms-link-skip>
                                </div>
                            </p>
                        </div>
                </el-form-item>
                <el-form-item :label="info.name" class="clear" v-if="info.type == 6 && info.id==11">
                    <el-upload
                    class="avatar-uploader allbackImg"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess3"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm">
                    <img v-if="info.value" :src="info.value">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span>{{info.label}}</span>
                </el-form-item>
            </div>
            <!-- 实例配置 -->
            <el-row :gutter="60" v-if="elementConfig && elementConfig.length>0">
                <el-col class="insConfigCol">
                    <h3>实例配置<small>注：实例背景是图片的话，会按照实际实例宽度和高度拉伸；默认为纯色RGB均为244</small></h3>
                    <div v-for="(info,index) in elementConfig">
                        <div class="insConfig">
                            <div class="editConfig" :style="'background-image:url('+info.sampleImgUrl+')'">
                                <el-button type="primary" class="btnEdit" @click="editEleConfig(info.elementId,index)" style="z-index:999;">编辑</el-button>
                            </div>
                            <div class="editUsalConfig">
                                <div>
                                    <el-form-item label="组件名">
                                        {{info.name}}
                                    </el-form-item>
                                    <el-form-item label="配置状态">
                                        <span v-if="info.configStatus==null">老数据无配置状态</span>
                                        <span v-if="info.configStatus==0">未完成</span>
                                        <span v-if="info.configStatus==1">已完成</span>
                                        <!-- {{info.configStatus}} -->
                                    </el-form-item>
                                    <el-form-item label="最低客户端">
                                        {{info.androidVersion}} {{info.iosVersion}}
                                    </el-form-item>
                                </div>
                                <div v-for="(items,id) in info.basicConfig">
                                    <el-form-item :label="items.name" v-if="items.type == 2">
                                        <el-input v-model="items.value" style="width:50px;"></el-input>
                                        <span>{{items.units}}</span>
                                    </el-form-item>
                                    <el-form-item :label="items.name" v-if="items.type == 5">
                                        <el-radio-group v-model="items.value" @change="backCheck(items.value,index)">
                                            <el-radio :label="1">纯色</el-radio>
                                            <el-radio :label="2">透明</el-radio>
                                            <el-radio :label="3">图片</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-if="items.type==9">
                                        <el-color-picker v-model="items.value"></el-color-picker>
                                    </el-form-item>
                                    <el-form-item v-if="items.type==6" class="eleIcstyle" style="padding-left:120px;">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess5"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="items.value" :src="items.value" @click="uploadkey(index)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadkey(index)" style="width:50px;height:50px;line-height:50px;"></i>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                            </div>
                            <div style="width:420px;">
                                <el-form-item label="可见公司">
                                    <el-select v-model="info.companyIds" style="width:150px" multiple collapse-tags
                                    :disabled="companyIdUse1!=-1 || companyIdUse2!=-1 || companyIdUse3!=-1 || form.companyId!=''" @change="companyIdCh">
                                        <el-option
                                            v-for="item in companyList"
                                            :key="item.id"
                                            :label="item.companyName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-checkbox-group v-model="info.companyIds" style="width:100px" @change="companyIdCh">
                                        <el-checkbox :label="-1" v-if="form.companyType==0">全部正式公司可见</el-checkbox>
                                        <el-checkbox :label="-2" v-if="form.companyType==2">全部竞品公司可见</el-checkbox>
                                        <el-checkbox :label="-3" v-if="form.companyType==1">全部演示公司可见</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </div>

                            <p class="editUsalConfig pdlt"><el-input placeholder="通用实例名称"></el-input><el-button type="primary">保存为通用实例</el-button></p>
                        </div>

                    </div>

                </el-col>
            </el-row>
        </el-form>

        <el-dialog title="配置实例" :visible.sync="dialogFormVisible" append-to-body width="900px">
            <el-form ref="eleConfig" :model="eleConfig" label-width="120px" class="formList">
                <!-- 消息组件 -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 13 && info.elementSort == eleSort">
                    <ul v-if="info.elementId == 13 && info.elementSort == eleSort" class="eleUlstyle">
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 138" class="eleColStyle">
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:50px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 141" class="eleColStyle">
                                <el-form-item v-if="infos.type == 5">
                                    <el-radio-group v-model="infos.value">
                                        <el-radio :label="2">显示全部</el-radio>
                                        <el-radio :label="1">仅显示未读</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:50px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 144" class="eleColStyle">
                                <el-form-item v-if="infos.type == 4">
                                    <el-checkbox v-model="infos.value">{{infos.name}}</el-checkbox>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" class="elestyle">
                                <el-form-item :label="infos.name" v-if="infos.type == 1">
                                    <el-select v-model="infos.value" style="width: 200px;margin-right:15px;" placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 148" class="eleColStyle">
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:50px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                                <el-form-item v-if="infos.type == 4">
                                    <el-checkbox v-model="infos.value">{{infos.name}}</el-checkbox>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 150" class="eleColStyle">
                                <el-form-item v-if="infos.type == 4">
                                    <el-checkbox v-model="infos.value" @change="checkbanner(infos.id,infos.value)">{{infos.name}}</el-checkbox>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:50px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li v-if="mesBanner == true" style="overflow:hidden;">
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 8" style="overflow:hidden;">
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item v-if="items.type == 6">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess4"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="items.value" :src="items.value">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                                <div v-for="(items,key) in infos.value[0]" v-if="items.group == 158" style="width:200px;float:left;">
                                    <el-form-item v-if="items.type == 4" style="margin-left:30px;">
                                        <el-checkbox v-model="items.value">{{items.name}}</el-checkbox>
                                    </el-form-item>
                                    <el-form-item :label="items.name" v-if="items.type == 2">
                                        <el-input v-model="items.value" style="width:80px;"></el-input>
                                        <span>{{items.units}}</span>
                                    </el-form-item>
                                </div>
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item :label="items.name" v-if="items.type == 2 && items.group == null">
                                        <el-input v-model="items.value" style="width:80px;"></el-input>
                                        <span>{{items.units}}</span>
                                        <span>{{items.label}}</span>
                                    </el-form-item>
                                    <el-form-item label="跳转配置" v-if="items.type == 7">
                                        <el-select v-model="items.value" placeholder="请选择跳转配置" @change="skipChange">
                                            <el-option
                                                v-for="item in bannerSkipList"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 跳转页面 -->
                                    <!-- <div style="overflow:hidden;" v-if="items.type == 7 && info.elementSort == eleSort">
                                        <cms-link-skip :skipType="items.value" v-on:getskipDate="getcmsSkipDate13"></cms-link-skip>
                                    </div> -->
                                    <!-- 跳转页面 -->
                                    <div v-if="items.skip == 0" style="width:800px;overflow:hidden;">
                                        <el-form-item label="移动端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[0].cmsPageId" placeholder="跳转页面" @focus="getCmsMpage">
                                                <el-option
                                                v-for="(item,index) in clientTypeDate"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="PC端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[1].cmsPageId" placeholder="跳转页面" @focus="getCmsPcpage">
                                                <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType == 1">
                                            <el-select v-model="items.linkId" @change="pageSkipChange">
                                                <el-option
                                                    v-for="item in pageSkip"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 本地参数特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType ==1 && (items.linkId == 17 || items.linkId == 63)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 20 || items.linkId == 66)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in storeList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 25 || items.linkId == 71)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in categoryTreeList"
                                                    :key="item.categoryTreeId"
                                                    :label="item.categoryTreeName"
                                                    :value="item.categoryTreeId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 53 || items.linkId == 85)">
                                            <el-select v-model="items.extParam[0].linkdate1">
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
                                        <el-form-item label="配置链接" v-else-if="items.linkType==2">
                                            <el-input v-model="items.linkUrl" style="width:250px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="配置链接" prop="name" v-else-if="items.linkType==3">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in urlList"
                                                    :key="item.externalLinkId"
                                                    :label="item.externalLinkName"
                                                    :value="item.externalLinkId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="商品分类" prop="name" v-else-if="items.linkType==4">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in classifyList"
                                                    :key="item.standardUnitCombinationId"
                                                    :label="item.combinationName"
                                                    :value="item.standardUnitCombinationId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置商品" prop="name" v-else-if="items.linkType==5">
                                            <el-select
                                                v-model="items.linkId"
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                >
                                                    <el-option
                                                    v-for="item in goodsList"
                                                    :key="item.standardUnitId"
                                                    :label="item.standardUnitName"
                                                    :value="item.standardUnitId">
                                                    </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="所属分页tab" v-else-if="items.linkType==7">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in tabList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType==8">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in pageDo"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 操作配置特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[0].linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数2" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[1].linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数3" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[2].linkdate3" placeholder="关键词3" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <div v-if="items.linkType==8">
                                            <el-form-item label="参数1" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入商品规格"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in puList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-input v-model="items.extParam[1].linkdate2" placeholder="规格数量" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <!-- <el-form-item label="参数1" v-if="items.linkId == 5 || items.linkId == 4">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in dataSource"
                                                        :key="item.id"
                                                        :label="item.couponBatchName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item> -->
                                            <el-form-item label="参数1" v-if="items.linkId == 4 || items.linkId == 9">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in dataSource1"
                                                        :key="item.id"
                                                        :label="item.couponBatchName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="items.linkId == 5 || items.linkId == 10">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
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
                                    </div>
                                </div>
                            </div>

                        </li>
                    </ul>
                </div>
                <!-- 三Banner左右立式组件 -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 12 && info.elementSort == eleSort">
                    <ul v-if="info.elementId == 12 && info.elementSort == eleSort" class="eleUlstyle">
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 106" class="eleColStyle">
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:50px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 109" style="width:300px;float:left;">
                                <el-form-item v-if="infos.type == 5">
                                    <el-form-item v-if="infos.type == 5">
                                        <el-radio-group v-model="infos.value">
                                            <el-radio :label="2">右立Banner</el-radio>
                                            <el-radio :label="1">左立Banner</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 2" style="margin-left:80px;">
                                    <el-input v-model="infos.value" style="width:50px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li v-for="(infos,index) in info.config">
                            <div v-if="infos.group == 111 && infos.type == 8">
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item v-if="items.type == 6" :label="infos.name">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess6"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="items.value" :src="items.value">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item v-if="items.type == 4" style="margin-bottom:0;">
                                        <el-checkbox v-model="items.value">{{items.name}}</el-checkbox>
                                    </el-form-item>
                                    <el-form-item :label="items.name" v-if="items.type == 2 && items.group == 111" style="margin-bottom:10px;">
                                        <el-input v-model="items.value" style="width:50px;"></el-input>
                                        <span>{{items.units}}</span>
                                        <span>{{items.label}}</span>
                                    </el-form-item>
                                    <el-form-item label="跳转配置" v-if="items.type == 7" style="margin-bottom:6px;">
                                        <el-select v-model="items.value" placeholder="请选择跳转配置" @change="skipChangeUp">
                                            <el-option
                                                v-for="item in bannerSkipList"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- <div v-if="items.type == 7" style="overflow:hidden;">
                                        <cms-link-skip :skipType="form.skipTypeBanner1" v-on:getskipDate="getcmsSkipDate12_1"></cms-link-skip>
                                    </div> -->
                                    <!-- 跳转页面 -->
                                    <div v-if="items.skip == 0 && infos.id == 111" style="width:800px;overflow:hidden;">
                                        <el-form-item label="移动端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[0].cmsPageId" placeholder="跳转页面" @focus="getCmsMpage">
                                                <el-option
                                                v-for="(item,index) in clientTypeDate"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="PC端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[1].cmsPageId" placeholder="跳转页面" @focus="getCmsPcpage">
                                                <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType == 1">
                                            <el-select v-model="items.linkId" @change="pageSkipChange">
                                                <el-option
                                                    v-for="item in pageSkip"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 本地参数特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType ==1 && (items.linkId == 17 || items.linkId == 63)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 20 || items.linkId == 66)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in storeList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 25 || items.linkId == 71)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in categoryTreeList"
                                                    :key="item.categoryTreeId"
                                                    :label="item.categoryTreeName"
                                                    :value="item.categoryTreeId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 53 || items.linkId == 85)">
                                            <el-select v-model="items.extParam[0].linkdate1">
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
                                        <el-form-item label="配置链接" v-else-if="items.linkType==2">
                                            <el-input v-model="items.linkUrl" style="width:250px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="配置链接" prop="name" v-else-if="items.linkType==3">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in urlList"
                                                    :key="item.externalLinkId"
                                                    :label="item.externalLinkName"
                                                    :value="item.externalLinkId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="商品分类" prop="name" v-else-if="items.linkType==4">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in classifyList"
                                                    :key="item.standardUnitCombinationId"
                                                    :label="item.combinationName"
                                                    :value="item.standardUnitCombinationId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置商品" prop="name" v-else-if="items.linkType==5">
                                            <el-select
                                                v-model="items.linkId"
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                >
                                                    <el-option
                                                    v-for="item in goodsList"
                                                    :key="item.standardUnitId"
                                                    :label="item.standardUnitName"
                                                    :value="item.standardUnitId">
                                                    </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="所属分页tab" v-else-if="items.linkType==7">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in tabList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType==8">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in pageDo"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 操作配置特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[0].linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数2" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[1].linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数3" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[2].linkdate3" placeholder="关键词3" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <div v-if="items.linkType==8">
                                            <el-form-item label="参数1" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入商品规格"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in puList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-input v-model="items.extParam[1].linkdate2" placeholder="规格数量" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="items.linkId == 4 || items.linkId == 9">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in dataSource1"
                                                        :key="item.id"
                                                        :label="item.couponBatchName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="items.linkId == 5 || items.linkId == 10">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
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
                                    </div>
                                </div>

                            </div>

                            <div v-if="infos.group == 120 && infos.type == 8">
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item v-if="items.type == 6" :label="infos.name">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess120"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="items.value" :src="items.value">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item v-if="items.type == 4" style="margin-bottom:0;">
                                        <el-checkbox v-model="items.value">{{items.name}}</el-checkbox>
                                    </el-form-item>
                                    <el-form-item :label="items.name" v-if="items.type == 2" style="margin-bottom:10px;">
                                        <el-input v-model="items.value" style="width:50px;"></el-input>
                                        <span>{{items.units}}</span>
                                        <span>{{items.label}}</span>
                                    </el-form-item>
                                    <el-form-item label="跳转配置" v-if="items.type == 7" style="margin-bottom:6px;">
                                        <el-select v-model="items.value" placeholder="请选择跳转配置" @change="skipChangeUp2">
                                            <el-option
                                                v-for="item in bannerSkipList"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- <div v-if="items.type == 7" style="overflow:hidden;">
                                        <cms-link-skip :skipType="form.skipTypeBanner2" v-on:getskipDate="getcmsSkipDate12_2"></cms-link-skip>
                                    </div> -->
                                    <!-- 跳转页面 -->
                                    <div v-if="items.skip == 0 && infos.id == 120" style="width:800px;overflow:hidden;">
                                        <el-form-item label="移动端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[0].cmsPageId" placeholder="跳转页面" @focus="getCmsMpage">
                                                <el-option
                                                v-for="(item,index) in clientTypeDate"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="PC端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[1].cmsPageId" placeholder="跳转页面" @focus="getCmsPcpage">
                                                <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType == 1">
                                            <el-select v-model="items.linkId" @change="pageSkipChange">
                                                <el-option
                                                    v-for="item in pageSkip"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 本地参数特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType ==1 && (items.linkId == 17 || items.linkId == 63)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 20 || items.linkId == 66)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in storeList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 25 || items.linkId == 71)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in categoryTreeList"
                                                    :key="item.categoryTreeId"
                                                    :label="item.categoryTreeName"
                                                    :value="item.categoryTreeId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 53 || items.linkId == 85)">
                                            <el-select v-model="items.extParam[0].linkdate1">
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
                                        <el-form-item label="配置链接" v-else-if="items.linkType==2">
                                            <el-input v-model="items.linkUrl" style="width:250px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="配置链接" prop="name" v-else-if="items.linkType==3">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in urlList"
                                                    :key="item.externalLinkId"
                                                    :label="item.externalLinkName"
                                                    :value="item.externalLinkId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="商品分类" prop="name" v-else-if="items.linkType==4">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in classifyList"
                                                    :key="item.standardUnitCombinationId"
                                                    :label="item.combinationName"
                                                    :value="item.standardUnitCombinationId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置商品" prop="name" v-else-if="items.linkType==5">
                                            <el-select
                                                v-model="items.linkId"
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                >
                                                    <el-option
                                                    v-for="item in goodsList"
                                                    :key="item.standardUnitId"
                                                    :label="item.standardUnitName"
                                                    :value="item.standardUnitId">
                                                    </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="所属分页tab" v-else-if="items.linkType==7">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in tabList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType==8">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in pageDo"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 操作配置特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[0].linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数2" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[1].linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数3" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[2].linkdate3" placeholder="关键词3" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <div v-if="items.linkType==8">
                                            <el-form-item label="参数1" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入商品规格"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in puList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-input v-model="items.extParam[1].linkdate2" placeholder="规格数量" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="items.linkId == 4 || items.linkId == 9">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in dataSource1"
                                                        :key="item.id"
                                                        :label="item.couponBatchName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="items.linkId == 5 || items.linkId == 10">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
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
                                    </div>
                                </div>
                            </div>

                            <div v-if="infos.group == 129 && infos.type == 8">
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item v-if="items.type == 6" :label="infos.name">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess129"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="items.value" :src="items.value">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                                <div v-for="(items,key) in infos.value[0]" class="mesbannerStyle">
                                    <el-form-item v-if="items.type == 4" style="margin-bottom:0;">
                                        <el-checkbox v-model="items.value">{{items.name}}</el-checkbox>
                                    </el-form-item>
                                    <el-form-item :label="items.name" v-if="items.type == 2" style="margin-bottom:10px;">
                                        <el-input v-model="items.value" style="width:50px;"></el-input>
                                        <span>{{items.units}}</span>
                                        <span>{{items.label}}</span>
                                    </el-form-item>
                                    <el-form-item v-if="items.type == 7" label="跳转配置" style="margin-bottom:6px;">
                                        <el-select v-model="items.value" placeholder="请选择跳转配置" @change="skipChangeUp3">
                                            <el-option
                                                v-for="item in bannerSkipList"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- <div v-if="items.type == 7" style="overflow:hidden;">
                                        <cms-link-skip :skipType="form.skipTypeBanner3" v-on:getskipDate="getcmsSkipDate12_3"></cms-link-skip>
                                    </div> -->
                                    <!-- 跳转页面 -->
                                    <div v-if="items.skip == 0 && infos.id == 129" style="width:800px;overflow:hidden;">
                                        <el-form-item label="移动端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[0].cmsPageId" placeholder="跳转页面" @focus="getCmsMpage">
                                                <el-option
                                                v-for="(item,index) in clientTypeDate"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="PC端页面" v-if="items.linkType == 4">
                                            <el-select v-model="items.linkableButtonPageList[1].cmsPageId" placeholder="跳转页面" @focus="getCmsPcpage">
                                                <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType == 1">
                                            <el-select v-model="items.linkId" @change="pageSkipChange">
                                                <el-option
                                                    v-for="item in pageSkip"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 本地参数特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType ==1 && (items.linkId == 17 || items.linkId == 63)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && i(tems.linkId == 20 || items.linkId == 66)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in storeList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 25 || items.linkId == 71)">
                                            <el-select v-model="items.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in categoryTreeList"
                                                    :key="item.categoryTreeId"
                                                    :label="item.categoryTreeName"
                                                    :value="item.categoryTreeId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="items.linkType==1 && (items.linkId == 53 || items.linkId == 85)">
                                            <el-select v-model="items.extParam[0].linkdate1">
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
                                        <el-form-item label="配置链接" v-else-if="items.linkType==2">
                                            <el-input v-model="items.linkUrl" style="width:250px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="配置链接" prop="name" v-else-if="items.linkType==3">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in urlList"
                                                    :key="item.externalLinkId"
                                                    :label="item.externalLinkName"
                                                    :value="item.externalLinkId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="商品分类" prop="name" v-else-if="items.linkType==4">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in classifyList"
                                                    :key="item.standardUnitCombinationId"
                                                    :label="item.combinationName"
                                                    :value="item.standardUnitCombinationId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置商品" prop="name" v-else-if="items.linkType==5">
                                            <el-select
                                                v-model="items.linkId"
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                >
                                                    <el-option
                                                    v-for="item in goodsList"
                                                    :key="item.standardUnitId"
                                                    :label="item.standardUnitName"
                                                    :value="item.standardUnitId">
                                                    </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="所属分页tab" v-else-if="items.linkType==7">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in tabList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="items.linkType==8">
                                            <el-select v-model="items.linkId">
                                                <el-option
                                                    v-for="item in pageDo"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 操作配置特殊跳转 -->
                                        <el-form-item label="参数1" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[0].linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数2" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[1].linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数3" v-if="items.linkType==8 && (items.linkId == 1 || items.linkId == 6)">
                                            <el-input v-model="items.extParam[2].linkdate3" placeholder="关键词3" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <div v-if="items.linkType==8">
                                            <el-form-item label="参数1" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入商品规格"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in puList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="items.linkId == 2 || items.linkId == 3 || items.linkId == 7 || items.linkId == 8">
                                                <el-input v-model="items.extParam[1].linkdate2" placeholder="规格数量" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="items.linkId == 4 || items.linkId == 9">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in dataSource1"
                                                        :key="item.id"
                                                        :label="item.couponBatchName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="items.linkId == 5 || items.linkId == 10">
                                                <el-select v-model="items.extParam[0].linkdate1"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
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
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 商品展示组件A -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 11 && info.elementSort == eleSort">
                    <ul v-if="info.elementId == 11 && info.elementSort == eleSort" class="eleUlstyle">
                        <li>
                            <div v-for="(infos,id) in info.config">
                                <el-form-item :label="infos.name" v-if="infos.type == 1 && infos.group == 95">
                                    <el-select v-model="infos.value" style="width: 200px;margin-right:15px;" placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" class="eleShopStyle" style="width:400px;">
                                <el-form-item :label="infos.name" v-if="infos.type == 2 && infos.group == 95">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>

                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group != 95">
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:250px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 1">
                                    <el-select v-model="infos.value" style="width: 200px;margin-right:15px;" placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 10"> <!--  选择商品组 -->
                                    <el-select v-model="infos.value">
                                        <el-option
                                            v-for="item in classifyList"
                                            :key="item.standardUnitCombinationId"
                                            :label="item.combinationName"
                                            :value="item.standardUnitCombinationId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- icon列表图 -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 10 && info.elementSort == eleSort">
                    <ul v-if="info.elementId == 10 && info.elementSort == eleSort" class="eleIcstyle">
                        <li>
                            <div v-for="(infos,id) in info.config" style="width:300px;float:left">
                                <el-form-item :label="infos.name" v-if="infos.type == 1 && infos.group == 81 && infos.id==81">
                                    <el-select v-model="infos.value" style="width:100px;margin-right:15px;" placeholder="请选择" @change="iconChangeCount">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 1 && infos.group == 81 && infos.id==82">
                                    <el-select v-model="infos.value" style="width:100px;margin-right:15px;" placeholder="请选择" @change="iconChangeW">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 2 && infos.group == 81">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" style="width:220px;float:left">
                                <el-form-item :label="infos.name" v-if="infos.type == 2 && infos.group == 84">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                                <el-form-item v-if="infos.type == 4 && infos.group == 84">
                                    <el-checkbox v-model="infos.value" style="width:80px;">{{infos.name}}</el-checkbox>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" style="width:220px;float:left">
                                <el-form-item :label="infos.name" v-if="infos.type == 2 && infos.group == 88">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                                <el-form-item v-if="infos.type == 4 && infos.group == 88">
                                    <el-checkbox v-model="infos.value" style="width:80px;">{{infos.name}}</el-checkbox>
                                </el-form-item>
                                <el-form-item v-if="infos.type == 6 && infos.group == 88">
                                    <el-upload
                                    class="avatar-uploader"
                                    :action="baseImgPath"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess9"
                                    :before-upload="beforeAvatarUpload"
                                    :on-error="handleError"
                                    :data="imgForm"
                                    >
                                    <img v-if="infos.value" :src="infos.value">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </div>
                        </li>
                        <li v-for="(infos,id) in info.config">
                            <div v-if="infos.group == 91 && infos.type == 8" v-for="(items,index) in infos.value" style="overflow:hidden;">
                                <div v-for="icons in items" style="float:left;">
                                    <el-form-item :label="icons.name" style="margin-bottom:10px;width:300px;" v-if="icons.type == 2">
                                        <el-input v-model="icons.values[index]" style="width:150px;"></el-input>
                                    </el-form-item>
                                    <el-form-item style="width:100px;float:left;" v-if="icons.type == 6">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccessIcon"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="icons.values[index]" :src="icons.values[index]" @click="uploadkey(index)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadkey(index)" style="width:50px;height:50px;line-height:50px;"></i>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item v-if="icons.type == 7">
                                        <el-select v-model="icons.values[index]" placeholder="请选择跳转配置">
                                            <el-option
                                                v-for="item in bannerSkipList"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 跳转页面 -->
                                    <div v-if="icons.skip == 0" style="width:800px;overflow:hidden;">
                                        <el-form-item label="移动端页面" v-if="icons.values[index] == 4">
                                            <el-select v-model="icons.linkableButtonPageList[0].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsMpage">
                                                <el-option
                                                v-for="(item,index) in clientTypeDate"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="PC端页面" v-if="icons.values[index] == 4">
                                            <el-select v-model="icons.linkableButtonPageList[1].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsPcpage">
                                                <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="icons.values[index]==1">
                                            <el-select v-model="icons.linkId[index]" @change="pageSkipChange">
                                                <el-option
                                                    v-for="item in pageSkip"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 本地参数特殊跳转 -->
                                        <el-form-item label="参数1" v-if="icons.values[index] ==1 && (icons.linkId[index] == 17 || icons.linkId[index] == 63)">
                                            <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 20 || icons.linkId[index] == 66)">
                                            <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in storeList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 25 || icons.linkId[index] == 71)">
                                            <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                filterable
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                remote
                                                >
                                                <el-option
                                                    v-for="item in categoryTreeList"
                                                    :key="item.categoryTreeId"
                                                    :label="item.categoryTreeName"
                                                    :value="item.categoryTreeId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 53 || icons.linkId[index] == 85)">
                                            <el-select v-model="icons.extParam[0].linkdate1[index]">
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
                                        <el-form-item label="配置链接" v-else-if="icons.values[index]==2">
                                            <el-input v-model="icons.linkUrl[index]" style="width:250px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="配置链接" prop="name" v-else-if="icons.values[index]==3">
                                            <el-select v-model="icons.linkId[index]">
                                                <el-option
                                                    v-for="item in urlList"
                                                    :key="item.externalLinkId"
                                                    :label="item.externalLinkName"
                                                    :value="item.externalLinkId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="商品分类" prop="name" v-else-if="icons.values[index]==4">
                                            <el-select v-model="icons.linkId[index]" @change="forceUp">
                                                <el-option
                                                    v-for="item in classifyList"
                                                    :key="item.standardUnitCombinationId"
                                                    :label="item.combinationName"
                                                    :value="item.standardUnitCombinationId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置商品" prop="name" v-else-if="icons.values[index]==5">
                                            <el-select
                                                v-model="icons.linkId[index]"
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                >
                                                    <el-option
                                                    v-for="item in goodsList"
                                                    :key="item.standardUnitId"
                                                    :label="item.standardUnitName"
                                                    :value="item.standardUnitId">
                                                    </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="所属分页tab" v-else-if="icons.values[index]==7">
                                            <el-select v-model="icons.linkId[index]">
                                                <el-option
                                                    v-for="item in tabList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="配置参数" prop="name" v-if="icons.values[index]==8">
                                            <el-select v-model="icons.linkId[index]">
                                                <el-option
                                                    v-for="item in pageDo"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 操作配置特殊跳转 -->
                                        <el-form-item label="参数1" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                            <el-input v-model="icons.extParam[0].linkdate1[index]" placeholder="关键词1" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数2" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                            <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="关键词2" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="参数3" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                            <el-input v-model="icons.extParam[2].linkdate3[index]" placeholder="关键词3" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <div v-if="icons.values[index]==8">
                                            <el-form-item label="参数1" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3 || icons.linkId[index] == 7 || icons.linkId[index] == 8">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入商品规格"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in puList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3 || icons.linkId[index] == 7 || icons.linkId[index] == 8">
                                                <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="规格数量" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <!-- <el-form-item label="参数1" v-if="icons.linkId[index] == 5 || icons.linkId[index] == 4">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in dataSource"
                                                        :key="item.id"
                                                        :label="item.couponBatchName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item> -->
                                            <el-form-item label="参数1" v-if="icons.linkId[index] == 4 || icons.linkId[index] == 9">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in dataSource1"
                                                        :key="item.id"
                                                        :label="item.couponBatchName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.linkId[index] == 5 || icons.linkId[index] == 10">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="优惠券批次名称"
                                                    remote
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
                                    </div>
                                </div>
                            </div>

                        </li>
                    </ul>
                </div>
                <!-- 标语组件 -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 9 && info.elementSort == eleSort">
                    <ul v-if="info.elementId == 9 && info.elementSort == eleSort" class="eleIcstyle">
                        <li>
                            <div v-for="(infos,id) in info.config" style="width:300px;float:left">
                                <el-form-item :label="infos.name" v-if="infos.type == 1 && infos.group == 72">
                                    <el-select v-model="infos.value" style="width:100px;margin-right:15px;" placeholder="请选择" @change="sloganChangeCount">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 2 && infos.group == 72">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li v-for="(infos,id) in info.config" >
                            <div v-if="infos.type == 8 && infos.group == 76" v-for="(items,index) in infos.value" style="overflow:hidden;">
                                <div v-for="icons in items" style="float:left;">
                                    <el-form-item v-if="icons.type == 2" :label="icons.name" style="width:240px;float:left;">
                                        <el-input v-model="icons.values[index] " style="width:120px;"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="icons.type == 6" :label="icons.name" style="width:180px;float:left;">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccessSlogan"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="icons.values[index]" :src="icons.values[index]" @click="uploadkey(index)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"  @click="uploadkey(index)" style="width:50px;height:50px;line-height:50px;"></i>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item v-if="icons.type == 7" style="width:200px;float:left;">
                                        <el-select v-model="icons.values[index]" placeholder="请选择跳转配置">
                                            <el-option
                                                v-for="item in bannerSkipList"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                     <!-- 跳转页面 -->
                                    <div v-if="icons.skip == 0" style="width:800px;overflow:hidden;">
                                            <el-form-item label="移动端页面" v-if="icons.values[index] == 4">
                                                <el-select v-model="icons.linkableButtonPageList[0].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsMpage">
                                                    <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="PC端页面" v-if="icons.values[index]== 4">
                                                <el-select v-model="icons.linkableButtonPageList[1].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsPcpage">
                                                    <el-option
                                                        v-for="(item,index) in clientTypeDate"
                                                        :key="item.id"
                                                        :label="item.pageName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置参数" prop="name" v-if="icons.values[index]==1">
                                                <el-select v-model="icons.linkId[index]" @change="pageSkipChange">
                                                    <el-option
                                                        v-for="item in pageSkip"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- 本地参数特殊跳转 -->
                                            <el-form-item label="参数1" v-if="icons.values[index] ==1 && (icons.linkId[index] == 17 || icons.linkId[index] == 63)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in clientTypeDate"
                                                        :key="item.id"
                                                        :label="item.pageName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 20 || icons.linkId[index] == 66)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in storeList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 25 || icons.linkId[index] == 71)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in categoryTreeList"
                                                        :key="item.categoryTreeId"
                                                        :label="item.categoryTreeName"
                                                        :value="item.categoryTreeId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 53 || icons.linkId[index] == 85)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]">
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
                                            <el-form-item label="配置链接" v-else-if="icons.values[index]==2">
                                                <el-input v-model="icons.linkUrl[index]" style="width:250px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="配置链接" prop="name" v-else-if="icons.values[index]==3">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in urlList"
                                                        :key="item.externalLinkId"
                                                        :label="item.externalLinkName"
                                                        :value="item.externalLinkId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="商品分类" prop="name" v-else-if="icons.values[index]==4">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in classifyList"
                                                        :key="item.standardUnitCombinationId"
                                                        :label="item.combinationName"
                                                        :value="item.standardUnitCombinationId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置商品" prop="name" v-else-if="icons.values[index]==5">
                                                <el-select
                                                    v-model="icons.linkId[index]"
                                                    filterable
                                                    remote
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    >
                                                        <el-option
                                                        v-for="item in goodsList"
                                                        :key="item.standardUnitId"
                                                        :label="item.standardUnitName"
                                                        :value="item.standardUnitId">
                                                        </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="所属分页tab" v-else-if="icons.values[index]==7">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in tabList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置参数" prop="name" v-if="icons.values[index]==8">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in pageDo"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- 操作配置特殊跳转 -->
                                            <el-form-item label="参数1" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[0].linkdate1[index]" placeholder="关键词1" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="关键词2" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数3" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[2].linkdate3[index]" placeholder="关键词3" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <div v-if="icons.values[index]==8">
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3|| icons.linkId[index] == 7|| icons.linkId[index] == 8">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="请输入商品规格"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in puList"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="参数2" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3 || icons.linkId[index] == 7 || icons.linkId[index] == 8">
                                                    <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="规格数量" style="width:224px;"></el-input>
                                                </el-form-item>
                                                <!-- <el-form-item label="参数1" v-if="icons.linkId[index] == 5 || icons.linkId[index] == 4">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in dataSource"
                                                            :key="item.id"
                                                            :label="item.couponBatchName"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item> -->
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 4 || icons.linkId[index] == 9">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in dataSource1"
                                                            :key="item.id"
                                                            :label="item.couponBatchName"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 5 || icons.linkId[index] == 10">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
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
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- Banner 轮播图左右组件 -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 8 && info.elementSort == eleSort" >
                    <ul v-if="info.elementId == 8 && info.elementSort == eleSort" class="eleUlstyle threeBanner">
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 2 && infos.group == null">
                                <el-form-item :label="infos.name">
                                    <el-input v-model="infos.value" style="width:120px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" style="width:300px;float:left;">
                                <el-form-item :label="infos.name" v-if="infos.type == 2 && infos.group == 56">
                                    <el-input v-model="infos.value" style="width:120px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 1 && infos.group == 56">
                                    <el-select v-model="infos.value" style="width:100px;margin-right:15px;" placeholder="请选择" @change="sliderChange">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 2 && infos.group == 58" style="width:300px;float:left;">
                                <el-form-item :label="infos.name">
                                    <el-input v-model="infos.value" style="width:120px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <!-- <li v-if="slideBannershow == true" v-for="(infos,id) in info.config"> -->
                        <li v-if="slideBannershow" v-for="(infos,id) in info.config">
                            <div v-if="infos.type == 8 && infos.group == 61" v-for="(items,index) in infos.value" style="overflow:hidden;">
                                <div v-for="icons in items" style="float:left;" class="mesbannerStyle">
                                    <el-form-item v-if="icons.type == 6 && info.elementSort == eleSort" label="Banner" style="width:280px;float:left;">
                                        <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccessBanner"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm"
                                        >
                                        <img v-if="icons.values[index]" :src="icons.values[index]" @click="uploadkey(index)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"  @click="uploadkey(index)" style="width:120px;height:120px;line-height:50px;"></i>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item v-if="icons.type == 4" style="margin-bottom:0;">
                                        <el-checkbox v-model="icons.values[index]">{{icons.name}}</el-checkbox>
                                    </el-form-item>
                                    <el-form-item :label="icons.name" v-if="icons.type == 2" style="margin-bottom:10px;">
                                        <el-input v-model="icons.values[index]" style="width:50px;"></el-input>
                                        <span>{{items.units}}</span>
                                        <span>{{items.label}}</span>
                                    </el-form-item>
                                    <el-form-item v-if="icons.type == 7">
                                        <el-select v-model="icons.values[index]" placeholder="请选择跳转配置" @change="skipchange">
                                            <el-option
                                                v-for="item in bannerSkipList"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 跳转页面 -->
                                    <div v-if="icons.skip == 0" style="width:800px;overflow:hidden;">
                                            <el-form-item label="移动端页面" v-if="icons.values[index] ==4">

                                                <el-select v-model="icons.linkableButtonPageList[0].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsMpage">
                                                    <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="PC端页面" v-if="icons.values[index] ==4">
                                                <el-select v-model="icons.linkableButtonPageList[1].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsPcpage">
                                                    <el-option
                                                        v-for="(item,index) in clientTypeDate"
                                                        :key="item.id"
                                                        :label="item.pageName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置参数" prop="name" v-if="icons.values[index] ==1">
                                                <el-select v-model="icons.linkId[index]" @change="pageSkipChange">
                                                    <el-option
                                                        v-for="item in pageSkip"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- 本地参数特殊跳转 -->
                                            <el-form-item label="参数1" v-if="icons.values[index] ==1 && (icons.linkId[index] == 17 || icons.linkId[index] == 63)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in clientTypeDate"
                                                        :key="item.id"
                                                        :label="item.pageName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 20 || icons.linkId[index] == 66)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in storeList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 25 || icons.linkId[index] == 71)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in categoryTreeList"
                                                        :key="item.categoryTreeId"
                                                        :label="item.categoryTreeName"
                                                        :value="item.categoryTreeId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 53 || icons.linkId[index] == 85)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]">
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
                                            <el-form-item label="配置链接" v-if="icons.values[index]==2">
                                                <el-input v-model="icons.linkUrl[index]" style="width:250px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="配置链接" prop="name" v-if="icons.values[index]==3">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in urlList"
                                                        :key="item.externalLinkId"
                                                        :label="item.externalLinkName"
                                                        :value="item.externalLinkId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="商品分类" prop="name" v-if="icons.values[index]==4">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in classifyList"
                                                        :key="item.standardUnitCombinationId"
                                                        :label="item.combinationName"
                                                        :value="item.standardUnitCombinationId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置商品" prop="name" v-if="icons.values[index]==5">
                                                <el-select
                                                    v-model="icons.linkId[index]"
                                                    filterable
                                                    remote
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    >
                                                        <el-option
                                                        v-for="item in goodsList"
                                                        :key="item.standardUnitId"
                                                        :label="item.standardUnitName"
                                                        :value="item.standardUnitId">
                                                        </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="所属分页tab" v-if="icons.values[index]==7">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in tabList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置参数" prop="name" v-if="icons.values[index]==8">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in pageDo"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- 操作配置特殊跳转 -->
                                            <el-form-item label="参数1" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[0].linkdate1[index]" placeholder="关键词1" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="关键词2" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数3" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[2].linkdate3[index]" placeholder="关键词3" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <div v-if="icons.values[index]==8">
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3 || icons.linkId[index] == 7 || icons.linkId[index] == 8">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="请输入商品规格"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in puList"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="参数2" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3 || icons.linkId[index] == 7 || icons.linkId[index] == 8">
                                                    <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="规格数量" style="width:224px;"></el-input>
                                                </el-form-item>
                                                <!-- <el-form-item label="参数1" v-if="icons.linkId[index] == 5 || icons.linkId[index] == 4">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in dataSource"
                                                            :key="item.id"
                                                            :label="item.couponBatchName"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item> -->
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 4 || icons.linkId[index] == 9">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in dataSource1"
                                                            :key="item.id"
                                                            :label="item.couponBatchName"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 5 || icons.linkId[index] == 10">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
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
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 69 && infos.type ==2">
                                <el-form-item :label="infos.name">
                                    <el-input v-model="infos.value" style="width:120px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == null && infos.type ==3 && info.elementSort == eleSort">
                                <el-form-item :label="infos.name" v-if="info.elementSort == eleSort">
                                    <div v-if="info.elementSort == eleSort">
                                        <ul style="padding-top: 50px;">
                                            <li class="siderboxIn clear" v-for="(info,key) in infos.checkBannerList" v-dragging="{ item: info, list: checkBannerList, group: 'info' }" :key="info.id">
                                                <div style="display:inline-block;" class="clearfix">
                                                    <img :src="info.imgUrl" style="width:188px;height:100px;display:inline-block;" />
                                                    <div style="display:inline-block;margin:0 40px;width:175px;">
                                                        <p style="line-height:30px;">{{info.name}}</p>
                                                        <p style="line-height:30px;">
                                                            <el-button class="filter-item" @click="deleteBanner(key)" size="medium" type="danger">删除</el-button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button class="filter-item" @click="selectBanner(index)" size="medium" type="primary" icon="el-icon-plus" style="margin-left:140px;">选择轮播图</el-button>
                                    </div>
                                </el-form-item>
                                <!-- 选择轮播图弹框 -->
                                <el-dialog title="选择轮播图" :visible.sync="dialogFormVisible4" append-to-body width="800px"  top="4vh">
                                    <div style="height:600px;overflow:auto;">
                                        <div style="margin-bottom:20px;">
                                            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="名称" v-model="bannerForm.name">
                                            </el-input>
                                            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="公司" v-model="bannerForm.companyName">
                                            </el-input>
                                            <el-select v-model="bannerForm.linkType" style="width: 200px;margin-right:15px;" placeholder="跳转页面">
                                                <el-option
                                                    v-for="(item,index) in bannerSkipList"
                                                    v-if="index!=0||form.clientType!=4"
                                                    :key="item.value"
                                                    :label="item.key"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div style="margin-bottom:20px;">
                                            <el-button class="filter-item" type="primary" icon="search" size="medium" @click="queryBannerList">搜索</el-button>
                                            <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
                                        </div>
                                        <el-checkbox-group v-model="exampleForm.bannerIds">
                                            <el-table :data="bannerList" border fit highlight-current-row style="width: 100%">
                                                <el-table-column align="center" width="30">
                                                    <template slot-scope="scope">
                                                        <el-checkbox :label="scope.row.id">1</el-checkbox>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="名称" min-width="150">
                                                    <template slot-scope="scope">
                                                        <span>{{scope.row.name}}</span>
                                                    </template>
                                                </el-table-column>

                                                <el-table-column align="center" label="跳转类型" min-width="80">
                                                    <template slot-scope="scope">
                                                        <span v-if="scope.row.linkType==1">一级</span>
                                                        <span v-else-if="scope.row.linkType==2">二级</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-checkbox-group>
                                        <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                                            <el-pagination
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page.sync="bannerForm.pageNo"
                                            :page-sizes="[10,20,30, 50]"
                                            :page-size="bannerForm.pageSize"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="count">
                                            </el-pagination>
                                        </div>
                                    </div>
                                    <div slot="footer" class="dialog-footer" :span="24">
                                        <el-button size="medium" @click="dialogFormVisible4 = false">取 消</el-button>
                                        <el-button size="medium" type="primary" @click="updataBanner(index)">确 定</el-button>
                                    </div>
                                </el-dialog>
                            </div>
                        </li>
                    </ul>

                </div>
                <!-- 多Banner横向展示组件 -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 7 && info.elementSort == eleSort">
                    <ul v-if="info.elementId == 7 && info.elementSort == eleSort" class="eleUlstyle threeBanner">
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 2 && infos.group == null">
                                <el-form-item :label="infos.name">
                                    <el-input v-model="infos.value" style="width:120px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 42" style="width:300px;float:left;">
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 1">
                                    <el-select v-model="infos.value" style="width:140px;margin-right:15px;" placeholder="请选择" @change="moreBannerChange">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 2 && infos.group == 44" style="width:300px;float:left;">
                                <el-form-item :label="infos.name">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 46" style="width:300px;float:left;">
                                <el-form-item v-if="infos.type==4">
                                    <el-checkbox v-model="infos.value">{{infos.name}}</el-checkbox>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type == 2">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                    <span>{{infos.label}}</span>
                                </el-form-item>
                            </div>
                        </li>
                        <li v-for="(infos,id) in info.config">
                                <div v-if="infos.type == 8 && infos.group == 46" v-for="(items,index) in infos.value" style="overflow:hidden;">
                                    <div v-for="icons in items" style="float:left;" class="mesbannerStyle">
                                        <el-form-item v-if="icons.type == 6" label="Banner" style="width:280px;float:left;">
                                            <el-upload
                                            class="avatar-uploader"
                                            :action="baseImgPath"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccessMoreBanner"
                                            :before-upload="beforeAvatarUpload"
                                            :on-error="handleError"
                                            :data="imgForm"
                                            >
                                            <img v-if="icons.values[index]" :src="icons.values[index]" @click="uploadkey(index)">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"  @click="uploadkey(index)" style="width:120px;height:120px;line-height:120px;"></i>
                                            </el-upload>
                                        </el-form-item>
                                        <el-form-item v-if="icons.type == 4" style="margin-bottom:0;">
                                            <el-checkbox v-model="icons.values[index]">{{icons.name}}</el-checkbox>
                                        </el-form-item>
                                        <el-form-item :label="icons.name" v-if="icons.type == 2" style="margin-bottom:10px;">
                                            <el-input v-model="icons.values[index]" style="width:100px;"></el-input>
                                            <span>{{icons.units}}</span>
                                            <span>{{icons.label}}</span>
                                        </el-form-item>
                                        <el-form-item v-if="icons.type == 7">
                                            <el-select v-model="icons.values[index]" placeholder="请选择跳转配置" @change="skipchange">
                                                <el-option
                                                    v-for="item in bannerSkipList"
                                                    :key="item.value"
                                                    :label="item.key"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 跳转页面 -->
                                        <div v-if="icons.skip == 0 && info.elementSort == eleSort" style="width:800px;overflow:hidden;">
                                            <el-form-item label="移动端页面" v-if="icons.values[index] == 4">
                                                <el-select v-model="icons.linkableButtonPageList[0].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsMpage">
                                                    <el-option
                                                    v-for="(item,index) in clientTypeDate"
                                                    :key="item.id"
                                                    :label="item.pageName"
                                                    :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="PC端页面" v-if="icons.values[index] == 4">
                                                <el-select v-model="icons.linkableButtonPageList[1].cmsPageId[index]" placeholder="跳转页面" @focus="getCmsPcpage">
                                                    <el-option
                                                        v-for="(item,index) in clientTypeDate"
                                                        :key="item.id"
                                                        :label="item.pageName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置参数" prop="name" v-if="icons.values[index]==1">
                                                <el-select v-model="icons.linkId[index]" @change="pageSkipChange">
                                                    <el-option
                                                        v-for="item in pageSkip"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- 本地参数特殊跳转 -->
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 17 || icons.linkId[index] == 63)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in clientTypeDate"
                                                        :key="item.id"
                                                        :label="item.pageName"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 20 || icons.linkId[index] == 66)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in storeList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 25 || icons.linkId[index] == 71)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                    filterable
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    remote
                                                    >
                                                    <el-option
                                                        v-for="item in categoryTreeList"
                                                        :key="item.categoryTreeId"
                                                        :label="item.categoryTreeName"
                                                        :value="item.categoryTreeId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="参数1" v-if="icons.values[index]==1 && (icons.linkId[index] == 53 || icons.linkId[index] == 85)">
                                                <el-select v-model="icons.extParam[0].linkdate1[index]">
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
                                            <el-form-item label="配置链接" v-else-if="icons.values[index]==2">
                                                <el-input v-model="icons.linkUrl[index]" style="width:250px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="配置链接" prop="name" v-else-if="icons.values[index]==3">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in urlList"
                                                        :key="item.externalLinkId"
                                                        :label="item.externalLinkName"
                                                        :value="item.externalLinkId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="商品分类" prop="name" v-else-if="icons.values[index]==4">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in classifyList"
                                                        :key="item.standardUnitCombinationId"
                                                        :label="item.combinationName"
                                                        :value="item.standardUnitCombinationId">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置商品" prop="name" v-else-if="icons.values[index]==5">
                                                <el-select
                                                    v-model="icons.linkId[index]"
                                                    filterable
                                                    remote
                                                    reserve-keyword
                                                    placeholder="请输入关键词"
                                                    >
                                                        <el-option
                                                        v-for="item in goodsList"
                                                        :key="item.standardUnitId"
                                                        :label="item.standardUnitName"
                                                        :value="item.standardUnitId">
                                                        </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="所属分页tab" v-else-if="icons.values[index]==7">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in tabList"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="配置参数" prop="name" v-if="icons.values[index]==8">
                                                <el-select v-model="icons.linkId[index]">
                                                    <el-option
                                                        v-for="item in pageDo"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- 操作配置特殊跳转 -->
                                            <el-form-item label="参数1" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[0].linkdate1[index]" placeholder="关键词1" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数2" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="关键词2" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参数3" v-if="icons.values[index]==8 && (icons.linkId[index] == 1 || icons.linkId[index] == 6)">
                                                <el-input v-model="icons.extParam[2].linkdate3[index]" placeholder="关键词3" style="width:224px;"></el-input>
                                            </el-form-item>
                                            <div v-if="icons.values[index]==8">
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3 || icons.linkId[index] == 7 || icons.linkId[index] == 8">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="请输入商品规格"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in puList"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="参数2" v-if="icons.linkId[index] == 2 || icons.linkId[index] == 3 || icons.linkId[index] == 7 || icons.linkId[index] == 8">
                                                    <el-input v-model="icons.extParam[1].linkdate2[index]" placeholder="规格数量" style="width:224px;"></el-input>
                                                </el-form-item>
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 4 || icons.linkId[index] == 9">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
                                                        >
                                                        <el-option
                                                            v-for="item in dataSource1"
                                                            :key="item.id"
                                                            :label="item.couponBatchName"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="参数1" v-if="icons.linkId[index] == 5 || icons.linkId[index] == 10">
                                                    <el-select v-model="icons.extParam[0].linkdate1[index]"
                                                        filterable
                                                        reserve-keyword
                                                        placeholder="优惠券批次名称"
                                                        remote
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
                                        </div>
                                    </div>
                                </div>
                            </li>
                    </ul>
                </div>
                <!-- 标题与更多组件 -->
                <div v-for="(info,index) in eleConfig.elementConfig" v-if="eleId == 6 && info.elementSort == eleSort">
                    <ul v-if="info.elementId == 6 && info.elementSort == eleSort" class="eleIcstyle threeBanner">
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 2 && infos.group == null">
                                <el-form-item :label="infos.name">
                                    <el-input v-model="infos.value" style="width:120px;"></el-input>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 4 && infos.group == 28 && infos.id==28">
                                <el-form-item>
                                    <el-checkbox v-model="infos.value">{{infos.name}}</el-checkbox>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 28" style="width:300px;float:left;">
                                <el-form-item :label="infos.name" v-if="infos.type==2 && infos.id == 29">
                                    <el-input v-model="infos.value" style="width:200px;"></el-input>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type==2 && infos.id != 29">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                            </div>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 32" style="width:300px;float:left;">
                                <el-form-item v-if="infos.type==1">
                                    <el-select v-model="infos.value" style="width:230px;margin-right:15px;" placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="infos.type==6 && infos.id == 33" :label="infos.name" >
                                    <el-upload
                                    class="avatar-uploader"
                                    :action="baseImgPath"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess13"
                                    :before-upload="beforeAvatarUpload"
                                    :on-error="handleError"
                                    :data="imgForm"
                                    >
                                    <img v-if="infos.value" :src="infos.value">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item v-if="infos.type==6 && infos.id == 34" :label="infos.name">
                                    <el-upload
                                    class="avatar-uploader"
                                    :action="baseImgPath"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess14"
                                    :before-upload="beforeAvatarUpload"
                                    :on-error="handleError"
                                    :data="imgForm"
                                    >
                                    <img v-if="infos.value" :src="infos.value">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.type == 4 && infos.group == 35 && infos.id==35">
                                <el-form-item>
                                    <el-checkbox v-model="infos.value">{{infos.name}}</el-checkbox>
                                </el-form-item>
                            </div>
                        </li>
                        <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == 35" style="width:300px;float:left;">
                                <el-form-item :label="infos.name" v-if="infos.type==2 && infos.id == 36">
                                    <el-input v-model="infos.value" style="width:200px;"></el-input>
                                </el-form-item>
                                <el-form-item :label="infos.name" v-if="infos.type==2 && infos.id != 36">
                                    <el-input v-model="infos.value" style="width:80px;"></el-input>
                                    <span>{{infos.units}}</span>
                                </el-form-item>
                                <el-form-item v-if="infos.type==1">
                                    <el-select v-model="infos.value" style="width:230px;margin-right:15px;" placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in infos.cfgValueList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            </li>
                            <li>
                            <div v-for="(infos,id) in info.config" v-if="infos.group == null">
                                <el-form-item v-if="infos.type==6" :label="infos.name">
                                    <el-upload
                                    class="avatar-uploader"
                                    :action="baseImgPath"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess15"
                                    :before-upload="beforeAvatarUpload"
                                    :on-error="handleError"
                                    :data="imgForm"
                                    >
                                    <img v-if="infos.value" :src="infos.value">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <span style="display:inline-block;width:500px;line-height:20px;padding-top:10px;text-align:left;">{{infos.label}}</span>
                                    </el-upload>

                                </el-form-item>
                                <el-form-item v-if="infos.type==7" :label="infos.name">
                                    <el-select v-model="infos.value" placeholder="请选择跳转配置">
                                        <el-option
                                            v-for="item in bannerSkipList"
                                            :key="item.value"
                                            :label="item.key"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 跳转页面 -->
                                <!-- <div style="overflow:hidden;" v-if="infos.type==7 && infos.value">
                                    <cms-link-skip :skipType="infos.value" v-on:getskipDate="getcmsSkipDateTitle"></cms-link-skip>
                                </div> -->
                                 <!-- 跳转页面 -->
                                 <div v-if="infos.type == 7" style="width:800px;overflow:hidden;">
                                    <el-form-item label="移动端页面" v-if="infos.value == 4">
                                        <el-select v-model="infos.obj1.linkableButtonPageList[0].cmsPageId" placeholder="跳转页面" @focus="getCmsMpage" @change="forceUp">
                                            <el-option
                                            v-for="(item,index) in clientTypeDate"
                                            :key="item.id"
                                            :label="item.pageName"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="PC端页面" v-if="infos.value == 4">
                                        <el-select v-model="infos.obj1.linkableButtonPageList[1].cmsPageId" placeholder="跳转页面" @focus="getCmsPcpage" @change="forceUp">
                                            <el-option
                                                v-for="(item,index) in clientTypeDate"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="配置参数" prop="name" v-if="infos.value == 1">
                                        <el-select v-model="infos.obj1.linkId" @change="pageSkipChange">
                                            <el-option
                                                v-for="item in pageSkip"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 本地参数特殊跳转 -->
                                    <el-form-item label="参数1" v-if="infos.value ==1 && (infos.obj1.linkId == 17 || infos.obj1.linkId == 63)">
                                        <el-select v-model="infos.obj1.extParam[0].linkdate1"
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
                                    <el-form-item label="参数1" v-if="infos.value==1 && (infos.obj1.linkId == 20 || infos.obj1.linkId == 66)">
                                        <el-select v-model="infos.obj1.extParam[0].linkdate1"
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
                                    <el-form-item label="参数1" v-if="infos.value==1 && (infos.obj1.linkId == 25 || infos.obj1.linkId == 71)">
                                        <el-select v-model="infos.obj1.extParam[0].linkdate1"
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
                                    <el-form-item label="参数1" v-if="infos.value==1 && (infos.obj1.linkId == 53 || infos.obj1.linkId == 85)">
                                        <el-select v-model="infos.obj1.extParam[0].linkdate1" @change="forceUp">
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
                                    <el-form-item label="配置链接" v-else-if="infos.value==2">
                                        <el-input v-model="infos.obj1.linkUrl" style="width:250px;"></el-input>
                                    </el-form-item>
                                    <el-form-item label="配置链接" prop="name" v-else-if="infos.value==3">
                                        <el-select v-model="infos.obj1.linkId" @change="forceUp">
                                            <el-option
                                                v-for="item in urlList"
                                                :key="item.externalLinkId"
                                                :label="item.externalLinkName"
                                                :value="item.externalLinkId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="商品分类" prop="name" v-else-if="infos.value==4">
                                        <el-select v-model="infos.obj1.linkId" @change="forceUp">
                                            <el-option
                                                v-for="item in classifyList"
                                                :key="item.standardUnitCombinationId"
                                                :label="item.combinationName"
                                                :value="item.standardUnitCombinationId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="配置商品" prop="name" v-else-if="infos.value==5">
                                        <el-select
                                            v-model="infos.obj1.linkId"
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
                                    <el-form-item label="所属分页tab" v-else-if="infos.value==7">
                                        <el-select v-model="infos.obj1.linkId" @change="forceUp">
                                            <el-option
                                                v-for="item in tabList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="配置参数" prop="name" v-if="infos.value==8">
                                        <el-select v-model="infos.obj1.linkId" @change="forceUp">
                                            <el-option
                                                v-for="item in pageDo"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 操作配置特殊跳转 -->
                                    <el-form-item label="参数1" v-if="infos.value==8 && (infos.obj1.linkId == 1 || infos.obj1.linkId == 6)">
                                        <el-input v-model="infos.obj1.extParam[0].linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
                                    </el-form-item>
                                    <el-form-item label="参数2" v-if="infos.value==8 && (infos.obj1.linkId == 1 || infos.obj1.linkId == 6)">
                                        <el-input v-model="infos.obj1.extParam[1].linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
                                    </el-form-item>
                                    <el-form-item label="参数3" v-if="infos.value==8 && (infos.obj1.linkId == 1 || infos.obj1.linkId == 6)">
                                        <el-input v-model="infos.obj1.extParam[2].linkdate3" placeholder="关键词3" style="width:224px;"></el-input>
                                    </el-form-item>
                                    <div v-if="infos.value==8">
                                        <el-form-item label="参数1" v-if="infos.obj1.linkId == 2 || infos.obj1.linkId == 3 || infos.obj1.linkId == 7 ||infos.obj1.linkId == 8">
                                            <el-select v-model="infos.obj1.extParam[0].linkdate1"
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
                                        <el-form-item label="参数2" v-if="infos.obj1.linkId == 2 || infos.obj1.linkId == 3 || infos.obj1.linkId == 7 || infos.obj1.linkId == 8">
                                            <el-input v-model="infos.obj1.extParam[1].linkdate2" placeholder="规格数量" style="width:224px;"></el-input>
                                        </el-form-item>
                                        <!-- <el-form-item label="参数1" v-if="infos.obj1.linkId == 5 || infos.obj1.linkId == 4">
                                            <el-select v-model="infos.obj1.extParam[0].linkdate1"
                                                filterable
                                                reserve-keyword
                                                placeholder="优惠券批次名称"
                                                remote
                                                @change="forceUp"
                                                >
                                                <el-option
                                                    v-for="item in dataSource"
                                                    :key="item.id"
                                                    :label="item.couponBatchName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item> -->
                                        <el-form-item label="参数1" v-if="infos.obj1.linkId == 4 || infos.obj1.linkId == 9">
                                            <el-select v-model="infos.obj1.extParam[0].linkdate1"
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
                                        <el-form-item label="参数1" v-if="infos.obj1.linkId == 5 || infos.obj1.linkId == 10">
                                            <el-select v-model="infos.obj1.extParam[0].linkdate1"
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
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-form>
            <!-- 组件确定 -->
            <div class="tempBtns">
                <el-button size="medium" @click="dialogFormVisible=false">取消</el-button>
                <el-button size="medium" type="primary" @click="elemCofigSave">保存</el-button>
            </div>
        </el-dialog>



        <!-- 保存 -->
        <div class="tempBtns">
            <el-button size="medium">取消</el-button>
            <el-button size="medium" type="primary" @click="savePage">保存</el-button>
        </div>


      </template>
       <!-- 保存成功 -->
      <template v-else-if="active==2">
        <img src="../../../assets/success.jpg" />
      </template>
    </div>
</template>

<script>
var moment = require('moment');
moment().format();
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import Cookie from '../../../config/mUtils'
import {baseImgPath,baseImgUrl} from '../../../config/env';
import cmsLinkSkip from './cmsLinkSkip.vue';
import {findStoreByPlatformId,findCommodityProductUnitLimit,findCouponBatchOfPage,findCategoryTreeAll,findStoreAllInfo,findCmsLocalParamAll,findSimplePageTabAll,findByStandardUnitName,findExternalLinkAll,localParamList,findCmsPageAllByClientType,queryStandardUnitCombinationAll,findCompanyIdOrName,getQiNiuToken,findCmsTemplateAll,findCfgKeyByTemplateId,queryBannerList,insertCmsPageWithTx} from '../../../api/getData';
import '../../../../static/css/addActPage.css'
export default {
    data(){
        return {
            bannerIndex:'',
            active:1,
            SkipDate:[],
            puList:[],
            form:{
               // skipcolBanner:{},
                skipTypes:{},
                skipslideBanner:{},
                skipS:'',
               // skipTypesgan:{},
                linkdate1:'',
                skipTypeTitle:'',
                skipType:'',
                name:'',
                companyId:'',
                companyIds:[],
                companyType:0,
                imgUrl:'',
                iconImgUrl1:'',
                iconImgUrl2:'',
                iconId1:'',
                linkType1:'',
                iconId2:'',
                linkType2:'',
                templateId:'',
                tempFormBasic:[],
                sizeIn:'',
                textTit:'',
                linkUrl:'',
                linkId:'',
                cmsPagePcId:'',
                cmsPageMId:'',
                skipTypeBanner1:'',
                skipTypeBanner2:'',
                skipTypeBanner3:''
            },
            eleSort:'',
            eleConfig:{
                elementConfig:[]
            },
            classifyList:[],//商品组合
            imgForm:{
                key:'',
                token:'',
            },
            clientTypeDate:[],
            //clientTypeDate1:[],
            //clientTypeDate2:[],
            localList:[],
            count:null,
            allStatus:[],
            allStatus1:[],
            companyIds:[],
            companyList:[],
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
                    value:7,
                    key:'分页tab'
                },
                {
                    value:8,
                    key:'配置选项'
                },
            ],
            iconList:[
                {
                    id:1,
                    name:'不显示'
                },
                {
                    id:2,
                    name:'购物车'
                },
                {
                    id:3,
                    name:'搜索'
                },
                {
                    id:4,
                    name:'扫一扫'
                },
                {
                    id:5,
                    name:'新建 Icon'
                }
            ],
            dialogFormVisible:false,
            iconNum:[
                {
                    value:4,
                    key:'4'
                },
                {
                    value:8,
                    key:'8'
                },
                {
                    value:12,
                    key:'12'
                }
            ],
            bannerList:[],
            iconsList0:[],
            iconLineList:[],
            tempList:[],
            elementConfig:[],
            eleTempConfig:[],
            checkshow:false,
            backBannershow:false,
            backColorshow:false,
            eleId:'',
            mesBanner : false,
            sliderImg:false,
            titleshow:false,
            textTitle:false,
            imgTitle:false,
            slideBannershow:false,
            checkBannerList:[],
           // checkBannerList:{},
            bannerForm:[],
            exampleForm:{
                bannerUrl:'',
                bannerIds:[]
            },
            dialogFormVisible4:false,
            index:'',
            iconCount:'',
            iconRow:'',
            urlList:[],
            goodsList:[],
            tabList:[],
            pageSkip:[],
            pageDo:[],
            skipPageType:'',
            loading:false,
            storeList:[],
            categoryTreeList:[],
            dataSource:[],
            dataSource1:[],
            dataSource2:[],
            skipDates:[],
            skipDates2:[],
            skipDates3:[],
            skipDates13:[],
            skipDates12_1:[],
            skipDates12_2:[],
            skipDates12_3:[],
            skipDatesTitle:[],
            companyIdUse1:-1,
            companyIdUse2:-1,
            companyIdUse3:-1
        }
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,14);
                if(str == "/addActivePage"){
                    Object.assign(this.$data, this.$options.data());
                    this.form.companyType = this.$route.params.companyType;
                    this.findCmsTemplateAll();
                    this.queryStandardUnitCombinationAll();
                    this.findCompanyIdOrName();
                    this.findCmsLocalParamAll();
                    this.findCmsLocalParamAll2();
                    this.findExternalLinkAll();
                    this.findByStandardUnitName();
                    this.findStoreAllInfo();
                    this.findCategoryTreeAll();
                    this.findCmsPageAllByClientType('',5);
                    // this.findCouponBatchOfPage();
                    this.findCouponBatchOfPage1();
                    this.findCouponBatchOfPage2();
                    this.findCommodityProductUnitLimit();
                    this.active = 1;
                };

            },
        }
    },
    components: {
        cmsLinkSkip
    },
    created() {
        console.log(this.companyIdUse1);
        this.active = 1;
        this.form.companyType = this.$route.params.companyType;
        this.findCompanyIdOrName();
        this.findCmsTemplateAll();
        this.findCmsLocalParamAll();
        this.findCmsLocalParamAll2();
        this.findExternalLinkAll();
        this.findByStandardUnitName();
        this.findStoreAllInfo();
        this.findCategoryTreeAll();
        this.findCmsPageAllByClientType('',5);
        // this.findCouponBatchOfPage();
        this.findCouponBatchOfPage1();
        this.findCouponBatchOfPage2();
        this.queryStandardUnitCombinationAll();
        this.findCommodityProductUnitLimit();
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
        });

    },
    methods: {
        //页面属性公司变化
        getAllstatus(){
            if(this.allStatus[0] == -1 || this.allStatus[0] == -2 || this.allStatus[0] == -3){
                this.form.companyId = '';
                this.companyIdUse1 = -1;
                this.companyIdUse2 = -1;
                this.companyIdUse3 = -1;
            }
        },
        //可见公司变化
        companyIdCh(){
            let that = this;
            $.each(this.elementConfig,function(id,info){
                if(info.companyIds){
                    that.companyIdUse1 = $.inArray(-1,info.companyIds);
                    that.companyIdUse2 = $.inArray(-2,info.companyIds);
                    that.companyIdUse3 = $.inArray(-3,info.companyIds);
                    if(that.companyIdUse1!=-1){info.companyIds=[-1]};
                    if(that.companyIdUse2!=-1){info.companyIds=[-2]};
                    if(that.companyIdUse3!=-1){info.companyIds=[-3]};
                }else{
                    that.companyIdUse1 = -1;
                    that.companyIdUse2 = -1;
                    that.companyIdUse3 = -1;
                }
                console.log(info.companyIds);
            })
        },
        //强制更新
        forceUp(){
            this.$forceUpdate();
        },
        skipchange(val){
            let thtf = this;
            console.log(val);
        },
        getcmsSkipDate(data){
           this.skipDates = data;
           console.log(this.skipDates);
        },
        getcmsSkipDateicon1(data){
           this.skipDates2 = data;
           console.log(this.skipDates2);
        },
        getcmsSkipDateicon2(data){
           this.skipDates3 = data;
           console.log(this.skipDates3);
        },
        getcmsSkipDate13(data){
            let that = this;
            $.each(this.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                    that.skipDates13 = data;
                }
            })

        },
        getcmsSkipDate12_1(data){
            this.skipDates12_1 = data;
        },
        getcmsSkipDate12_2(data){
            this.skipDates12_2 = data;
        },
        getcmsSkipDate12_3(data){
            this.skipDates12_3 = data;
        },
        getcmsSkipDateTitle(data){
            this.skipDatesTitle = data;
        },
        //跳转配置的改变
        skipChangeUp(val){
            console.log(val);
            let thtf = this;
            $.each(thtf.eleConfig.elementConfig,function(id,info){
                if(thtf.eleSort == info.elementSort){
                    $.each(info.config,function(key,items){
                        if(items.type == 8 && items.id ==111 && items.value){
                            let arr = new Array;
                            arr = items.value[0];
                            let len = arr.length - 1;
                            $.each(arr,function(i,list){
                                if(list.type == 7 && list.id==119){
                                    arr[len].linkType = list.value;
                                    console.log(arr[6]);
                                    console.log(items);
                                }
                            })
                        }
                    })
                }
            });
        },
        skipChangeUp2(val){
            console.log(val);
           let thtf = this;
           $.each(thtf.eleConfig.elementConfig,function(id,info){
                    $.each(info.config,function(key,items){
                        if(items.type == 8 && items.id ==120){
                            if(items.value){
                                if(thtf.eleSort == info.elementSort){
                                    let arr = new Array;
                                    arr = items.value[0];
                                    let len = arr.length - 1;
                                    $.each(arr,function(i,list){
                                        if(list.type == 7){
                                            arr[len].linkType = list.value;
                                            console.log(arr[6]);
                                            console.log(list.value);
                                        }
                                    })
                                }

                            }
                        }
                    })
            });
        },
        skipChangeUp3(val){
        console.log(val);
           let thtf = this;
           $.each(thtf.eleConfig.elementConfig,function(id,info){
                    $.each(info.config,function(key,items){
                        if(items.type == 8 && items.id ==129){
                            if(items.value){
                                if(thtf.eleSort == info.elementSort){
                                    let arr = new Array;
                                    arr = items.value[0];
                                    let len = arr.length - 1;
                                    $.each(arr,function(i,list){
                                        if(list.type == 7){
                                            arr[len].linkType = list.value;
                                            console.log(arr[6]);
                                            console.log(list.value);
                                        }

                                    })
                                }

                            }
                        }
                    })
            });
        },
        skipChange(val){
           console.log(val);
           let thtf = this;
           $.each(thtf.eleConfig.elementConfig,function(id,info){
                    $.each(info.config,function(key,items){
                        if(items.type == 8){
                            if(items.value){
                                if(thtf.eleSort == info.elementSort){
                                    let arr = new Array;
                                    arr = items.value[0];
                                    let len = arr.length - 1;
                                    $.each(arr,function(i,list){
                                        if(list.type == 7){
                                            arr[len].linkType = list.value;
                                            console.log(arr[6]);
                                            console.log(list.value);
                                        }

                                    })
                                }

                            }
                        }
                    })
            });
        },
        //本地参数跳转
        pageSkipChange(val){
            console.log(val);
            this.$forceUpdate();
            this.linkdate1 = '';
            if(val == 17 || val == 63){
                this.skipPageType = 5;
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
        //获取公司Id
        getCompanyId(companyId){
            $.each(this.elementConfig,function(key,info){
                info.companyIds=[];
                info.companyIds.push(companyId);
            });
        },
        uploadkey(index){
            this.index = index;
            console.log(index)
        },
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
        //获取配置参数
        async localParamList () {
            try {
                const res = await localParamList();
                if (res.data.code == 0) {
                    this.localList = res.data.data.paramList;
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
        //获取配置参数
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
                    this.loading = false;
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
        async findSimplePageTabAll (id) {
            try {
                const res = await findSimplePageTabAll({templateId:id});
                if (res.data.code == 0) {
                    this.tabList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！接口连接失败'
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
        //实例背景
        backCheck(value,index){
            this.index = index;
            $.each(this.elementConfig,function(key,info){
                $.each(info.basicConfig,function(id,items){
                    items.backColorshow = false;
                    items.backBannershow = false;
                })
            });
            console.log(this.index);
            console.log(value);
        },
        checkbanner(id,value){
            console.log(value)
            console.log(id)
            if(id == 150 && value == true){
                this.mesBanner = true;
            }else{
                this.mesBanner = false;
            }
        },
        handleCheck(id,value){
           if(id==9 && value ==1){
                this.checkshow = true;
           }else if(id==9 && value==0){
                this.checkshow = false;
           };
           if(id == 12 && value ==1){
               this.titleshow = true;
           }else if(id==12 && value ==0){
              this.titleshow = false;
           }
        },
        radioCheck(value){
            console.log(value + 'radio');
           if(value == 1){
            this.textTitle = true;
           }else{
            this.textTitle = false;
           };
           if(value == 2){
            this.imgTitle = true;
           }else{
            this.imgTitle = false;
           };

        },

        //获取所有模板
        async findCmsTemplateAll(){
            try{
                const res = await findCmsTemplateAll({searchType:0,status:0});
                if(res.data.code == 0){
                   this.tempList = res.data.data;
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },
        //根据所属模板查询组件
        findTemplate(id){
            this.findCfgKeyByTemplateId(id);
            this.findSimplePageTabAll(id);
        },
        async findCfgKeyByTemplateId(id){
            try{
                const res = await findCfgKeyByTemplateId({templateId:id});
                if(res.data.code == 0){
                    this.form.tempFormBasic = res.data.data.templateConfig;
                    this.elementConfig = res.data.data.elementConfig;
                    this.eleConfig.elementConfig = res.data.data.elementConfig;
                    $.each(res.data.data.elementConfig,function(key,info){
                        if(info.config){
                            $.each(info.config,function(id,infos){
                                if(infos.defaultValue && infos.defaultValue!=null){
                                    infos.value = infos.defaultValue;
                                }
                            })
                        }
                    });

                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },
        //编辑实例
        editEleConfig(id,index){
            this.eleId = id;
            this.eleSort = index;
            console.log(this.eleSort);
            let obj = new Object();
            obj.linkType = [];
            obj.linkId = [];
            obj.linkUrl = [];
            obj.skip = 0;
            obj.linkableButtonPageList = [
                {
                    "cmsPageId":[],
                    "clientType":5
                },
                {
                    "cmsPageId":[],
                    "clientType":6
                }
            ];
            obj.extParam = [
                {
                    "name":"extParam1",
                    "linkdate1":[]
                },
                {
                    "name":"extParam2",
                    "linkdate2":[]
                },
                {
                    "name":"extParam3",
                    "linkdate3":[]
                }
            ];
            let obj1 = new Object();
            obj1.linkType = "";
            obj1.linkId = "";
            obj1.linkUrl = "";
            obj1.skip = 0;
            obj1.linkableButtonPageList = [
                {
                    "cmsPageId":"",
                    "clientType":5
                },
                {
                    "cmsPageId":"",
                    "clientType":6
                }
            ];
            obj1.extParam = [
                {
                    "name":"extParam1",
                    "linkdate1":""
                },
                {
                    "name":"extParam2",
                    "linkdate2":""
                },
                {
                    "name":"extParam3",
                    "linkdate3":""
                }
            ];
            let thtf = this;
            $.each(thtf.eleConfig.elementConfig,function(id,info){
               // if(thtf.eleSort == info.elementSort){
                    $.each(info.config,function(key,items){
                        if(items.type == 8){
                            if(items.id == 91 || items.id ==76 || items.id == 61 || items.id == 47){
                                if(items.value && items.value.length>0){
                                    if(items.id == 91 && items.value[0].length<4 && thtf.eleSort == info.elementSort){
                                        items.value[0].push(obj);
                                    }else if(items.id == 76 && items.value[0].length<5 && thtf.eleSort == info.elementSort){
                                        items.value[0].push(obj);
                                    }else if(items.id == 61 && items.value[0].length<6 && thtf.eleSort == info.elementSort){
                                        items.value[0].push(obj);
                                    }else if(items.id == 47 && items.value[0].length<6 && thtf.eleSort == info.elementSort){
                                        items.value[0].push(obj);
                                         console.log(items.value);
                                        console.log(thtf.eleSort);
                                    };
                                    for(var i=0;i<items.value[0].length;i++){
                                        if(!items.value[0][i].values){
                                            thtf.$set(items.value[0][i],'values',{});
                                        }
                                    };

                                }
                            }else{
                                if(items.value && items.value.length>0 && thtf.eleSort == info.elementSort){
                                    if(items.id == 111 && items.value[0].length<7){
                                        let obj2 = new Object();
                                        obj2.linkType = "";
                                        obj2.linkId = "";
                                        obj2.linkUrl = "";
                                        obj2.skip = 0;
                                        obj2.linkableButtonPageList = [
                                            {
                                                "cmsPageId":"",
                                                "clientType":5
                                            },
                                            {
                                                "cmsPageId":"",
                                                "clientType":6
                                            }
                                        ];
                                        obj2.extParam = [
                                            {
                                                "name":"extParam1",
                                                "linkdate1":""
                                            },
                                            {
                                                "name":"extParam2",
                                                "linkdate2":""
                                            },
                                            {
                                                "name":"extParam3",
                                                "linkdate3":""
                                            }
                                        ];
                                        obj2.id = items.id;
                                        items.value[0].push(obj2);
                                        console.log(obj2);
                                    }else if(items.id == 120 && items.value[0].length<7){
                                        let obj2 = new Object();
                                        obj2.linkType = "";
                                        obj2.linkId = "";
                                        obj2.linkUrl = "";
                                        obj2.skip = 0;
                                        obj2.linkableButtonPageList = [
                                            {
                                                "cmsPageId":"",
                                                "clientType":5
                                            },
                                            {
                                                "cmsPageId":"",
                                                "clientType":6
                                            }
                                        ];
                                        obj2.extParam = [
                                            {
                                                "name":"extParam1",
                                                "linkdate1":""
                                            },
                                            {
                                                "name":"extParam2",
                                                "linkdate2":""
                                            },
                                            {
                                                "name":"extParam3",
                                                "linkdate3":""
                                            }
                                        ];
                                        obj2.id = items.id;
                                        items.value[0].push(obj2);
                                        console.log(obj2);
                                    }else if(items.id == 129 && items.value[0].length<7){
                                        let obj2 = new Object();
                                        obj2.linkType = "";
                                        obj2.linkId = "";
                                        obj2.linkUrl = "";
                                        obj2.skip = 0;
                                        obj2.linkableButtonPageList = [
                                            {
                                                "cmsPageId":"",
                                                "clientType":5
                                            },
                                            {
                                                "cmsPageId":"",
                                                "clientType":6
                                            }
                                        ];
                                        obj2.extParam = [
                                            {
                                                "name":"extParam1",
                                                "linkdate1":""
                                            },
                                            {
                                                "name":"extParam2",
                                                "linkdate2":""
                                            },
                                            {
                                                "name":"extParam3",
                                                "linkdate3":""
                                            }
                                        ];
                                        obj2.id = items.id;
                                        items.value[0].push(obj2);
                                        console.log(obj2);
                                    }else if(items.id == 152 && items.value[0].length<7){
                                        items.value[0].push(obj1);
                                        console.log(obj1);
                                    }
                                }
                            }
                        }else if(items.type == 3){
                            if(!items.checkBannerList){
                                items.checkBannerList = [];
                            };
                        }else if(items.type == 7 && thtf.eleSort == info.elementSort){
                            if(!items.obj1){
                                items.obj1 = obj1;
                            }
                            console.log(items);
                        }
                    })
               // }
            });

            $.each(thtf.eleConfig.elementConfig,function(id,info){
                $.each(info.config,function(key,items){
                    if(items.type == 1 && items.group == 56 && thtf.eleSort == info.elementSort){
                        var status = parseInt(items.value);
                        thtf.slideBannershow=false;
                        thtf.sliderChange(status);
                    }
                })
            });

            this.$forceUpdate();
            this.dialogFormVisible=true;
        },
        //查询所有轮播图
        async queryBannerList () {
            try {
                const obj = new Object();
                $.each(this.bannerForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await queryBannerList(obj);
                if (res.data.code == 0) {
                    this.count = res.data.data.bannerPage.totalSize;
                    this.bannerList = res.data.data.bannerPage.list;
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
        //选择轮播图
        selectBanner(index){
            let that = this;
            if(index == this.eleSort){
                // that.exampleForm.bannerIds = [];
                $.each(that.eleConfig.elementConfig,function(id,info){
                    $.each(info.config,function(key,items){
                        if(items.type == 3 && info.elementSort == index){
                            items.checkBannerList = [];
                        }
                    })
                });
               // this.checkBannerList=[];
                that.dialogFormVisible4 = true;
                that.queryBannerList();
                that.bannerForm = {
                    pageNo:1,
                    pageSize:10,
                    name:'',
                    companyName:'',
                    linkType:''
                };
            }

        },
        //选择轮播图确定
        async updataBanner(index){
            try {
                const obj = new Object();
                obj.bannerIdList = JSON.stringify(this.exampleForm.bannerIds);
                obj.pageSize = this.exampleForm.bannerIds.length+10;
                obj.pageNo = 1;
                let that = this;
                const res = await queryBannerList(obj);
                if (res.data.code == 0) {
                    if(index == that.eleSort){
                        $.each(that.eleConfig.elementConfig,function(id,info){
                            $.each(info.config,function(key,items){
                                if(items.type == 3 && index == info.elementSort){
                                    items.checkBannerList = res.data.data.bannerPage.list;
                                }
                            })
                        });
                       // this.checkBannerList = res.data.data.bannerPage.list;
                    }else{
                        $.each(that.eleConfig.elementConfig,function(id,info){
                            $.each(info.config,function(key,items){
                                if(items.type == 3){
                                    items.checkBannerList = [];
                                }
                            })
                        });
                    };
                   // console.log(that.checkBannerList);
                    that.dialogFormVisible4 = false;
                } else {
                    that.$message({
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
        //删除banner
        deleteBanner(index){
            let that = this;
            that.$confirm('删除后轮播图将不会在前端页面展示，确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                that.exampleForm.bannerIds.splice(index,1);
                $.each(that.eleConfig.elementConfig,function(id,info){
                    $.each(info.config,function(key,items){
                        if(items.type == 3){
                            items.checkBannerList.splice(index,1);
                        }
                    })
                });
                //this.checkBannerList.splice(index,1);
                that.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {

            });
        },
        //分页
        handleSizeChange(val) {
            this.bannerForm.pageSize = val;
            this.queryBannerList()
        },
        handleCurrentChange(val) {
            this.bannerForm.pageNo = val;
            this.offset = (val - 1) * this.bannerForm.pageSize;
            this.queryBannerList()
        },
        //重置
        resetForm(){
            this.bannerForm = {
                pageNo:1,
                pageSize:10,
                name:'',
                companyName:'',
                linkType:''
            };
            this.queryBannerList()
        },
        //获取公司列表
        async findCompanyIdOrName () {
            try {
                const res = await findCompanyIdOrName({companyType:this.form.companyType});
                if (res.data.code == 0) {
                    this.companyList = res.data.data;
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
        //在图片提交前进行验证  轮播图
        async beforeAvatarUpload(file) {
            let curr = moment().format('YYYYMMDDHHmmss').toString();
            let prefix = moment(file.lastModified).format('HHmmss').toString();
            let key = curr+"egeo"+prefix;

            this.imgForm.key = key;
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'

            var thtf = this;
            try {
                const res = await getQiNiuToken();
                console.log(res);
                if(res.data.code == 0){
                    thtf.imgForm.token = res.data.data;
                    console.log(thtf.imgForm.token);
                    if (!isJPG&&!isPNG) {
                        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
                    }
                    return isJPG||isPNG
                }else{
                    thtf.$message({
                        type:"error",
                        message:res.data.error
                    })
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }

            if (!isJPG&&!isPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }
            return isJPG||isPNG
        },
        //上传图片显示错误
        handleError(res) {
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
        //标题图片上传成功
        handleAvatarSuccess(response){
            let that = this;
            $.each(that.form.tempFormBasic,function(id,info){
                if(info.type == 6 && info.id==19){
                    info.value = that.baseImgUrl + response.key;
                    console.log(info.value);
                }
            })
        },
        //icon图片上传成功
        handleAvatarSuccess1(response){
            this.form.iconImgUrl1 = this.baseImgUrl + response.key;
        },
        handleAvatarSuccess2(response){
            this.form.iconImgUrl2 = this.baseImgUrl + response.key;
        },
        //全景背景图上传
        handleAvatarSuccess3(response){
            let that = this;
            $.each(that.form.tempFormBasic,function(id,info){
                if(info.type == 6 && info.id==11){
                    info.value = that.baseImgUrl + response.key;
                    console.log(info.value);
                }
            })
        },
        //实例配置
        handleAvatarSuccess5(response){
            let that = this;
            $.each(that.elementConfig[that.index].basicConfig,function(id,info){
                if(info.type == 6){
                    info.value = that.baseImgUrl + response.key;
                }
            })
        },
        //消息组件
        handleAvatarSuccess4(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.type==8 && items.id == 152){
                        $.each(items.value[0],function(i,msg){
                           if(msg.type == 6){
                               msg.value = that.baseImgUrl + response.key;
                           }
                        })
                    }
                });
                }
            });
        },
        //三Banner左右立式 组件
        handleAvatarSuccess6(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.group == 111 && items.type == 8){
                        $.each(items.value[0],function(i,msg){
                           if(msg.type == 6){
                               msg.value = that.baseImgUrl + response.key;
                           }
                        })
                    }
                });
                }
            });
        },
        handleAvatarSuccess120(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.group == 120 && items.type == 8){
                        $.each(items.value[0],function(i,msg){
                           if(msg.type == 6){
                               msg.value = that.baseImgUrl + response.key;
                           }
                        })
                    }
                });
                }

            });
        },
        handleAvatarSuccess129(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.group == 129 && items.type == 8){
                        $.each(items.value[0],function(i,msg){
                           if(msg.type == 6){
                               msg.value = that.baseImgUrl + response.key;
                           }
                        })
                    }
                });
                }
            });
        },
        //icon列表图 组件
        handleAvatarSuccess9(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.id == 90 && items.type == 6){
                       items.value =  that.baseImgUrl + response.key;
                    }
                });
                }
            });
        },
        handleAvatarSuccessIcon(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                    $.each(info.config,function(key,items){
                        if(items.group == 91 && items.type == 8){
                            $.each(items.value[that.index],function(i,icons){
                                    if(icons.type ==6){
                                        console.log(icons);
                                        that.$forceUpdate();
                                        icons.values[that.index]=that.baseImgUrl + response.key;
                                    }
                            })
                        }
                    });
                }
            });
        },
        //标语组件图片上传
        handleAvatarSuccessSlogan(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                    $.each(info.config,function(key,items){
                        if(items.group == 76 && items.type == 8){
                            $.each(items.value[that.index],function(i,icons){
                                    if(icons.type ==6){
                                        console.log(icons);
                                        that.$forceUpdate();
                                        icons.values[that.index]=that.baseImgUrl + response.key;
                                    }
                            })
                        }
                    });
                }
            });
        },
        // Banner 轮播图左右组件
        handleAvatarSuccessBanner(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                    if(info.elementSort == that.eleSort){
                    $.each(info.config,function(key,items){
                            if(items.group == 61 && items.type == 8){
                                $.each(items.value[that.index],function(i,icons){
                                        if(icons.type ==6){
                                            console.log(icons);
                                            that.$forceUpdate();
                                            icons.values[that.index]=that.baseImgUrl + response.key;
                                        }
                                })
                            }
                    });
                }
                }
            });
        },
        //多banner横向展示
        handleAvatarSuccessMoreBanner(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.id == 47 && items.type == 8){
                        $.each(items.value[that.index],function(i,icons){
                                if(icons.type ==6){
                                    console.log(icons);
                                    that.$forceUpdate();
                                    icons.values[that.index]=that.baseImgUrl + response.key;
                                }
                        })
                    }
                });
              }
            });
        },
        // Banner 轮播图左右组件
        handleAvatarSuccess13(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.id == 33 && items.type == 6){
                        console.log('左侧侧')
                       items.value =  that.baseImgUrl + response.key;
                    }
                });
                }
            });
        },
        handleAvatarSuccess14(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.id == 34 && items.type == 6){
                        console.log('右侧')
                       items.value =  that.baseImgUrl + response.key;
                    }
                });
                }
            });
        },
        handleAvatarSuccess15(response){
            let that = this;
            $.each(that.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                    if(items.id == 39 && items.type == 6){
                       items.value =  that.baseImgUrl + response.key;
                    }
                });
                }
            });
        },
        //icon change事件
        iconChangeCount(val){
            let thtf = this;
            this.iconRow = val;
            if(!this.iconCount){
                this.iconCount=3;
            }
            var count = this.iconCount;
            for (let i=0;i<val;i++){
                for (let j=0;j<count;j++){
                    $.each(thtf.eleConfig.elementConfig,function(id,info){
                        if(info.elementSort == thtf.eleSort){
                        $.each(info.config,function(key,items){
                            if(items.type == 8 && items.id == 91){
                                    let iconArray = [];
                                    iconArray = items.value[0];
                                    items.value=[];
                                    for (let i=0;i<val;i++){
                                        for (let j=0;j<count;j++){
                                            $.each(iconArray,function(j,list){
                                                if(list.type==7){
                                                iconArray[3].values = list.values;
                                                }
                                            });
                                            items.value.push(iconArray);
                                        }
                                    };
                                    console.log(items.value);
                            }
                        })
                    }
                    });
                }
            };
        },
        iconChangeW(val){
            let thtf = this;
            this.iconCount = val;
            if(!this.iconRow){
                this.iconRow=1;
            }
            var count = this.iconRow;
            for (let i=0;i<val;i++){
                for (let j=0;j<count;j++){
                    $.each(thtf.eleConfig.elementConfig,function(id,info){
                        if(info.elementSort == thtf.eleSort){
                        $.each(info.config,function(key,items){
                            if(items.type == 8 && items.id == 91){
                                    let iconArray = [];
                                    iconArray = items.value[0];
                                    items.value=[];
                                    for (let i=0;i<count;i++){
                                        for (let j=0;j<val;j++){
                                            $.each(iconArray,function(j,list){
                                                if(list.type==7){
                                                iconArray[3].values = list.values;
                                                }
                                            });
                                            items.value.push(iconArray);
                                        }
                                    };
                                    console.log(items.value);
                            }
                        })
                    }
                    });
                }
            };
        },
        //标语选择
        sloganChangeCount(val){
            let thtf = this;
            $.each(thtf.eleConfig.elementConfig,function(id,info){
                 if(info.elementSort == thtf.eleSort){
                $.each(info.config,function(key,items){
                    if(items.type == 8 && items.id ==76){
                        let sloganArray = [];
                        sloganArray = items.value[0];
                        items.value=[];
                        for (let i=0;i<val;i++){
                             $.each(sloganArray,function(j,list){
                                if(list.type==7){
                                    sloganArray[4].values = list.values;
                                }
                            });
                            items.value.push(sloganArray);
                        };
                        console.log(items.value);
                    }
                })
            }
            });
        },
        //banner左右轮播图选择
        sliderChange(val){
            let thtf = this;
            console.log(val);
            if(val > 0){
                this.slideBannershow =true;
                $.each(thtf.eleConfig.elementConfig,function(id,info){
                    if(info.elementSort == thtf.eleSort){
                        $.each(info.config,function(key,items){
                            if(items.type == 8 && items.id ==61){

                                let sloganArray = [];
                                sloganArray = items.value[0];
                                items.value=[];
                                for (let i=0;i<val;i++){
                                    $.each(sloganArray,function(j,list){
                                        if(list.type==7){
                                            sloganArray[5].values = list.values;
                                        }
                                    });
                                    items.value.push(sloganArray);

                                };
                                console.log(items.value);
                                console.log(thtf.form.skipslideBanner);
                            }
                        })
                    }
                });
            }else{
               this.slideBannershow =false;
            }

        },
        moreBannerChange(val){
            let thtf = this;
            let count = parseInt(val) +1;
            console.log(count)
            $.each(thtf.eleConfig.elementConfig,function(id,info){
                if(info.elementSort == thtf.eleSort){
                $.each(info.config,function(key,items){
                    if(items.type == 8 && items.id ==47){
                        let sloganArray = [];
                        sloganArray = items.value[0];
                        items.value=[];
                        for (let i=0;i<count;i++){
                             $.each(sloganArray,function(j,list){
                                if(list.type==7){
                                    sloganArray[5].values = list.values;
                                }
                            });
                            items.value.push(sloganArray);
                        };
                        console.log(items.value);
                    }
                })
            }
            });
        },
        //保存temp接口
        async insertCmsPageWithTx (obj) {
            try {
                const res = await insertCmsPageWithTx(obj);
                if (res.data.code == 0) {
                    this.active = 2;
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
        //组件确定
        elemCofigSave(){
            let thtf = this;
            thtf.dialogFormVisible = false;
        },
        //页面保存
        savePage(){
            console.log('suc');
            console.log(this.eleConfig.elementConfig);
            let that = this;
            let eleConArray = new Array;
            let newArray = new Array;
            let iconArray0 = new Array;
            $.each(this.eleConfig.elementConfig,function(id,info){
             // if(info.elementSort == that.eleSort){
                $.each(info.config,function(key,items){
                  //  if(items.value){
                        if(items.type ==8 && items.value.length > 0){
                            if(items.id == 91 || items.id == 76 || items.id==61 || items.id==47){
                                let iconArray = [];
                                $.each(items.value,function(i,iconslist){
                                    let iconlist = [];
                                    $.each(iconslist,function(j,icons){
                                        let len = iconslist.length - 1;
                                        if(icons.type == 7){
                                            let linkSkip = new Object();
                                            if(items.id == 91 && iconslist.length>3){
                                                linkSkip.linkId = iconslist[len].linkId[i];
                                                linkSkip.linkUrl = iconslist[len].linkUrl[i];
                                                linkSkip.linkableButtonPageList = [
                                                    {
                                                        "cmsPageId":iconslist[len].linkableButtonPageList[0].cmsPageId[i],
                                                        "clientType":5
                                                    },
                                                    {
                                                        "cmsPageId":iconslist[len].linkableButtonPageList[1].cmsPageId[i],
                                                        "clientType":6
                                                    }
                                                ];
                                                linkSkip.extParam = [
                                                    {
                                                        "name":"extParam1",
                                                        "value":iconslist[len].extParam[0].linkdate1[i]
                                                    },
                                                    {
                                                        "name":"extParam2",
                                                        "value":iconslist[len].extParam[1].linkdate2[i]
                                                    },
                                                    {
                                                        "name":"extParam3",
                                                        "value":iconslist[len].extParam[2].linkdate3[i]
                                                    }
                                                ];
                                                if(icons.values[i] == undefined){
                                                    linkSkip = null;
                                                }else{
                                                    linkSkip.linkType = icons.values[i];
                                                }
                                            }else if(items.id ==76 && iconslist.length>4){
                                                linkSkip.linkId = iconslist[len].linkId[i];
                                                linkSkip.linkUrl = iconslist[len].linkUrl[i];
                                                linkSkip.linkableButtonPageList = [
                                                    {
                                                        "cmsPageId":iconslist[len].linkableButtonPageList[0].cmsPageId[i],
                                                        "clientType":5
                                                    },
                                                    {
                                                        "cmsPageId":iconslist[len].linkableButtonPageList[1].cmsPageId[i],
                                                        "clientType":6
                                                    }
                                                ];
                                                linkSkip.extParam = [
                                                    {
                                                        "name":"extParam1",
                                                        "value":iconslist[len].extParam[0].linkdate1[i]
                                                    },
                                                    {
                                                        "name":"extParam2",
                                                        "value":iconslist[len].extParam[1].linkdate2[i]
                                                    },
                                                    {
                                                        "name":"extParam3",
                                                        "value":iconslist[len].extParam[2].linkdate3[i]
                                                    }
                                                ];
                                                if(icons.values[i]== undefined){
                                                    linkSkip = null;
                                                }else{
                                                    linkSkip.linkType = icons.values[i]
                                                }
                                            }else if(items.id == 61 && iconslist.length>5){
                                                    linkSkip.linkId = iconslist[len].linkId[i];
                                                    linkSkip.linkUrl = iconslist[len].linkUrl[i];
                                                    linkSkip.linkableButtonPageList = [
                                                        {
                                                            "cmsPageId":iconslist[len].linkableButtonPageList[1].cmsPageId[i],
                                                            "clientType":5
                                                        },
                                                        {
                                                            "cmsPageId":iconslist[len].linkableButtonPageList[0].cmsPageId[i],
                                                            "clientType":6
                                                        }
                                                    ];
                                                    linkSkip.extParam = [
                                                        {
                                                            "name":"extParam1",
                                                            "value":iconslist[len].extParam[0].linkdate1[i]
                                                        },
                                                        {
                                                            "name":"extParam2",
                                                            "value":iconslist[len].extParam[1].linkdate2[i]
                                                        },
                                                        {
                                                            "name":"extParam3",
                                                            "value":iconslist[len].extParam[2].linkdate3[i]
                                                        }
                                                    ];
                                                    if(icons.values[i] == undefined){
                                                        linkSkip = null;
                                                    }else{
                                                        linkSkip.linkType = icons.values[i];
                                                    }


                                            }else if(items.id == 47 && iconslist.length>5){
                                                linkSkip.linkId = iconslist[len].linkId[i];
                                                linkSkip.linkUrl = iconslist[len].linkUrl[i];
                                                linkSkip.linkableButtonPageList = [
                                                    {
                                                        "cmsPageId":iconslist[len].linkableButtonPageList[0].cmsPageId[i],
                                                        "clientType":5
                                                    },
                                                    {
                                                        "cmsPageId":iconslist[len].linkableButtonPageList[1].cmsPageId[i],
                                                        "clientType":6
                                                    }
                                                ];
                                                linkSkip.extParam = [
                                                    {
                                                        "name":"extParam1",
                                                        "value":iconslist[len].extParam[0].linkdate1[i]
                                                    },
                                                    {
                                                        "name":"extParam2",
                                                        "value":iconslist[len].extParam[1].linkdate2[i]
                                                    },
                                                    {
                                                        "name":"extParam3",
                                                        "value":iconslist[len].extParam[2].linkdate3[i]
                                                    }
                                                ];
                                                if(icons.values[i]== undefined){
                                                    linkSkip = null;
                                                }else{
                                                    linkSkip.linkType = icons.values[i]
                                                }
                                            }
                                            iconlist.push({
                                                elementId:info.elementId,
                                                elementSort:info.elementSort,
                                                cfgKeyId:icons.id,
                                                cfgKeyType:icons.type,
                                                cfgKeyValue:linkSkip
                                            });
                                        }else if(icons.values){
                                            iconlist.push({
                                                elementId:info.elementId,
                                                elementSort:info.elementSort,
                                                cfgKeyId:icons.id,
                                                cfgKeyType:icons.type,
                                                cfgKeyValue:icons.values[i]
                                            })
                                        }
                                    });
                                    iconArray.push(iconlist);
                                    console.log(iconArray);
                                });
                                $.each(iconArray,function(m,iconsArr){
                                    iconsArr.pop();
                                    $.each(iconsArr,function(n,icons){
                                        if(icons.cfgKeyType == 4 && icons.cfgKeyValue == true){
                                            icons.cfgKeyValue = 1;
                                        }else if(icons.cfgKeyType == 4 && icons.cfgKeyValue == false){
                                            icons.cfgKeyValue = 0;
                                        }
                                    })
                                });
                                eleConArray.push({
                                    elementId:info.elementId,
                                    elementSort:info.elementSort,
                                    cfgKeyId:items.id,
                                    cfgKeyType:items.type,
                                    cfgKeyValue:iconArray
                                });
                            }else{
                                let type8ArrayInner = new Array;
                                let type8Array = new Array;
                                $.each(items.value,function(i,elesvalue){
                                    $.each(elesvalue,function(m,eles){
                                        let len = elesvalue.length - 1;
                                        if(eles.parentId == items.id){
                                            if(eles.type==7){
                                                let linkSkip = new Object();
                                                if((items.id == 152 || items.id == 111 || items.id == 120 || items.id == 129) && elesvalue.length>5){
                                                    if(!eles.value){
                                                        linkSkip = null;
                                                    }else{
                                                        linkSkip.linkType = eles.value;
                                                        linkSkip.linkId = elesvalue[len].linkId;
                                                        linkSkip.linkUrl = elesvalue[len].linkUrl;
                                                        linkSkip.linkableButtonPageList = [
                                                            {
                                                                "cmsPageId":elesvalue[len].linkableButtonPageList[0].cmsPageId,
                                                                "clientType":5
                                                            },
                                                            {
                                                                "cmsPageId":elesvalue[len].linkableButtonPageList[1].cmsPageId,
                                                                "clientType":6
                                                            }
                                                        ];
                                                        linkSkip.extParam = [
                                                            {
                                                                "name":"extParam1",
                                                                "value":elesvalue[len].extParam[0].linkdate1
                                                            },
                                                            {
                                                                "name":"extParam2",
                                                                "value":elesvalue[len].extParam[1].linkdate2
                                                            },
                                                            {
                                                                "name":"extParam3",
                                                                "value":elesvalue[len].extParam[2].linkdate3
                                                            }
                                                        ];
                                                    }
                                                }
                                                type8ArrayInner.push({
                                                    elementId:info.elementId,
                                                    elementSort:info.elementSort,
                                                    cfgKeyId:eles.id,
                                                    cfgKeyType:eles.type,
                                                    cfgKeyValue:linkSkip
                                                });
                                        }else{
                                                type8ArrayInner.push({
                                                    elementId:info.elementId,
                                                    elementSort:info.elementSort,
                                                    cfgKeyId:eles.id,
                                                    cfgKeyType:eles.type,
                                                    cfgKeyValue:eles.value,
                                                });
                                            }
                                            $.each(type8ArrayInner,function(m,info){
                                                if(info.cfgKeyType == 4){
                                                   if(info.cfgKeyValue == true){
                                                        info.cfgKeyValue = 1;
                                                    }else if(info.cfgKeyValue == false || info.cfgKeyValue == null){
                                                        info.cfgKeyValue = 0;
                                                    }
                                                }

                                            });
                                        };
                                    })
                                });
                                console.log(type8ArrayInner);
                                if(type8ArrayInner && type8ArrayInner.length>0){
                                    type8Array.push(type8ArrayInner);
                                };
                                console.log(type8Array);
                                eleConArray.push({
                                    elementId:info.elementId,
                                    elementSort:info.elementSort,
                                    cfgKeyId:items.id,
                                    cfgKeyType:items.type,
                                    cfgKeyValue:type8Array
                                });
                            }
                         }else if(items.type ==7){
                            console.log(items.obj1);
                            let linkSkip = new Object();
                            if(!items.value){
                                linkSkip = null;
                            }else{
                                linkSkip.linkType = items.value;
                                linkSkip.linkId = items.obj1.linkId;
                                linkSkip.linkUrl = items.obj1.linkUrl;
                                linkSkip.linkableButtonPageList = items.obj1.linkableButtonPageList;
                                linkSkip.extParam = [
                                    {
                                        "name":"extParam1",
                                        "value":items.obj1.extParam[0].linkdate1
                                    },
                                    {
                                        "name":"extParam2",
                                        "value":items.obj1.extParam[1].linkdate2
                                    },
                                    {
                                        "name":"extParam3",
                                        "value":items.obj1.extParam[2].linkdate3
                                    }
                                ];
                            }
                            eleConArray.push({
                                elementId:info.elementId,
                                elementSort:info.elementSort,
                                cfgKeyId:items.id,
                                cfgKeyType:items.type,
                                cfgKeyValue:linkSkip
                            });
                            $.each(eleConArray,function(id,info){
                                if(info.cfgKeyType == 4){
                                    if(info.cfgKeyValue == true){
                                        info.cfgKeyValue = 1;
                                    }else if(info.cfgKeyValue == false || info.cfgKeyValue == null){
                                        info.cfgKeyValue = 0;
                                    }
                                }
                            });
                        }else if(items.type == 3){
                            let bannerIds = new Array;
                            if(that.exampleForm.bannerIds){
                                for(var i=0;i<that.exampleForm.bannerIds.length;i++){
                                    bannerIds.push({
                                        bannerId:that.exampleForm.bannerIds[i]
                                    })
                                }
                            };
                            eleConArray.push({
                                elementId:info.elementId,
                                elementSort:info.elementSort,
                                cfgKeyValue:bannerIds,
                                cfgKeyId:items.id,
                                cfgKeyType:items.type
                            });
                            $.each(eleConArray,function(id,info){
                                if(info.cfgKeyType == 4){
                                    if(info.cfgKeyValue == true){
                                        info.cfgKeyValue = 1;
                                    }else if(info.cfgKeyValue == false || info.cfgKeyValue == null){
                                        info.cfgKeyValue = 0;
                                    }
                                }
                            });
                        }else{
                            eleConArray.push({
                                elementId:info.elementId,
                                elementSort:info.elementSort,
                                cfgKeyId:items.id,
                                cfgKeyType:items.type,
                                cfgKeyValue:items.value
                            });
                            $.each(eleConArray,function(id,info){
                                if(info.cfgKeyType == 4){
                                    if(info.cfgKeyValue == true){
                                        info.cfgKeyValue = 1;
                                    }else if(info.cfgKeyValue == false || info.cfgKeyValue == null){
                                        info.cfgKeyValue = 0;
                                    }
                                }
                            });
                        }
                   // }
                });
            });
            that.eleTempConfig = eleConArray;

            console.log('page save');
            let obj = new Object();
            let pageJson = new Object();
            let pageBascMsg0 = new Array;
            let eleBascMsg0 = new Object();
            let companyList = new Array;
            // let that = this;
            $.each(that.elementConfig,function(id,info){
                $.each(info.basicConfig,function(key,item){
                    if(item.value && item.value!=null){
                        that.eleTempConfig.push({
                            elementId:info.elementId,
                            elementSort:info.elementSort,
                            cfgKeyId:item.id,
                            cfgKeyType:item.type,
                            cfgKeyValue:item.value
                        });
                    }
                });
                companyList.push({
                    elementId:info.elementId,
                    elementSort:info.elementSort,
                    companyIds:info.companyIds
                })
            });
            console.log(that.eleTempConfig);
            $.each(that.form.tempFormBasic,function(id,info){
                if(info.value && info.id!=21 && info.id!=22 && info.id!=23 && info.id!=24 && info.id!=25 && info.id!=26 && info.id!=27 && info.id!=16){
                    {
                        pageBascMsg0.push({
                            cfgKeyId:info.id,
                            cfgKeyType:info.type,
                            cfgKeyValue:info.value
                        });
                    }
                    $.each(pageBascMsg0,function(id,info){
                       if(info.cfgKeyType == 4){
                            if(info.cfgKeyValue == true){
                                info.cfgKeyValue = 1;
                            }else if(info.cfgKeyValue == false || info.cfgKeyValue == null){
                                info.cfgKeyValue = 0;
                            }
                        }
                    });
                }else if(info.type ==7 && info.id ==16 && that.form.skipTypeTitle){
                    let linkSkip = new Object();
                    linkSkip.linkType = that.form.skipTypeTitle;
                    linkSkip.linkId = that.skipDates.linkId;
                    linkSkip.linkUrl = that.skipDates.linkUrl;
                    linkSkip.linkableButtonPageList = [
                        {
                            "cmsPageId":that.skipDates.cmsPagePcId,
                            "clientType":5
                        },
                        {
                            "cmsPageId":that.skipDates.cmsPageMId,
                            "clientType":6
                        }
                    ];
                    linkSkip.extParam = [
                        {
                            "name":"extParam1",
                            "value":that.skipDates.linkdate1
                        },
                        {
                            "name":"extParam2",
                            "value":that.skipDates.linkdate2
                        },
                        {
                            "name":"extParam3",
                            "value":that.skipDates.linkdate3
                        }
                    ];
                    pageBascMsg0.push({
                        cfgKeyId:info.id,
                        cfgKeyType:info.type,
                        cfgKeyValue:linkSkip
                    });
                }
            });
            let iconObj0 = new Object();
            let iconObj1 = new Object();
            let iconObj2 = new Object();
            let iconObj3 = new Object();
            let iconObj4 = new Object();
            let iconObj5 = new Object();
            if(that.form.iconId1!=''){
                iconObj0.cfgKeyId = 21;
                iconObj0.cfgKeyType = 1;
                iconObj0.cfgKeyValue = that.form.iconId1;
                pageBascMsg0.push(iconObj0);
            };
            if(that.form.iconId2!=''){
                iconObj1.cfgKeyId = 23;
                iconObj1.cfgKeyType = 1;
                iconObj1.cfgKeyValue = that.form.iconId2;
                pageBascMsg0.push(iconObj1);
            };
            if(that.form.iconImgUrl1!=''){
                iconObj2.cfgKeyId = 24;
                iconObj2.cfgKeyType = 6;
                iconObj2.cfgKeyValue = that.form.iconImgUrl1;
                pageBascMsg0.push(iconObj2);
            };
            if(that.form.iconImgUrl2!=''){
                iconObj3.cfgKeyId = 25;
                iconObj3.cfgKeyType = 6;
                iconObj3.cfgKeyValue = that.form.iconImgUrl2;
                pageBascMsg0.push(iconObj3);
            };
            if(that.form.linkType1!=''){
                let linkSkip = new Object();
                linkSkip.linkType = that.form.linkType1;
                linkSkip.linkId = that.skipDates2.linkId;
                linkSkip.linkUrl = that.skipDates2.linkUrl;
                linkSkip.linkableButtonPageList = [
                    {
                        "cmsPageId":that.skipDates2.cmsPagePcId,
                        "clientType":5
                    },
                    {
                        "cmsPageId":that.skipDates2.cmsPageMId,
                        "clientType":6
                    }
                ];
                linkSkip.extParam = [
                    {
                        "name":"extParam1",
                        "value":that.skipDates2.linkdate1
                    },
                    {
                        "name":"extParam2",
                        "value":that.skipDates2.linkdate2
                    },
                    {
                        "name":"extParam3",
                        "value":that.skipDates2.linkdate3
                    }
                ];
                iconObj4.cfgKeyId = 26;
                iconObj4.cfgKeyType = 7;
                iconObj4.cfgKeyValue = linkSkip;
                pageBascMsg0.push(iconObj4);
            };
            if(that.form.linkType2!=''){
                let linkSkip = new Object();
                linkSkip.linkType = that.form.linkType2;
                linkSkip.linkId = that.skipDates3.linkId;
                linkSkip.linkUrl = that.skipDates3.linkUrl;
                linkSkip.linkableButtonPageList = [
                    {
                        "cmsPageId":that.skipDates3.cmsPagePcId,
                        "clientType":5
                    },
                    {
                        "cmsPageId":that.skipDates3.cmsPageMId,
                        "clientType":6
                    }
                ];
                linkSkip.extParam = [
                    {
                        "name":"extParam1",
                        "value":that.skipDates3.linkdate1
                    },
                    {
                        "name":"extParam2",
                        "value":that.skipDates3.linkdate2
                    },
                    {
                        "name":"extParam3",
                        "value":that.skipDates3.linkdate3
                    }
                ];
                iconObj5.cfgKeyId = 27;
                iconObj5.cfgKeyType = 7;
                iconObj5.cfgKeyValue = linkSkip;
                pageBascMsg0.push(iconObj5);
            };
            console.log(pageBascMsg0);

            //保存数据
            pageJson.pageConfig = pageBascMsg0;
            pageJson.elementConfig = that.eleTempConfig;
            pageJson.elementCompanyConfig = companyList;
            obj.templateId = that.form.templateId;
            obj.pageName = that.form.name;
            obj.companyType = that.form.companyType;
            if(that.allStatus.length>0){
                obj.companyId = JSON.stringify(that.allStatus[0]);
            }else{
                obj.companyId = JSON.stringify(that.form.companyId);
            }
            obj.configJson = JSON.stringify(pageJson);
            console.log(obj);
           that.insertCmsPageWithTx(obj);
        }

    },
}
</script>

<style scoped>
    #contentCon{
        padding:10px 20px;
    }
    .formList{
        width:900px;
        height:auto;
        margin:0 auto;
        overflow:hidden;
    }
    .formList .el-checkbox-group{
        display: inline-block;
        width: 300px;
        padding-left: 10px;
    }
    #contentCon .el-form-item{
        margin-bottom:6px;
    }
    #contentCon .el-form-item .editUsalConfig{
        margin-bottom:0;
    }
    .scaleIn .remarkwarn{
        width: 500px;
        display: inline-block;
        line-height: 20px;
        padding-left: 20px;
    }
    .scaleIn{
        overflow:hidden;
        padding-left: 30px;
        box-sizing: border-box;
    }
    .scaleIn .scale{
        display:block;
        float:left;
    }
    .titleBar{
        overflow:hidden;
    }
    .titleBar div{
        float: left;
    }
    .titleBar >>> .el-form-item__label{
        text-align: left !important;
    }
    .titleBar >>> .el-input__inner{
        height:30px !important;
        line-height: 30px !important;
    }
    #contentCon .titleBar .el-form-item{
        margin-bottom: 0;
    }
    .titleBar div:nth-child(2){
        padding-left: 20px;
    }
    .titleset{
        overflow:hidden;
    }
    .titleset span{
        display:block;
        float:left;
        padding-left: 20px;
    }
    .titleset >>> .el-upload{
        width:60px !important;
        height:60px !important;
        line-height: 60px;
    }
    .titleset >>> .el-upload img{
        width:100% ;
        height:100%;
    }
    .rightIcon p{
        display:flex;
    }
    .rightIcon span{
        padding:0 10px;
    }
    .rightIcon span >>> .el-upload{
        width:40px !important;
    }
    .rightIcon span >>> .el-upload img{
        width:100% ;
        height:100%;
    }
    .rightIcon >>> .el-form-item__label{
        text-align: left !important;
        width:100px !important;
    }
    .rightIcon >>> .el-form-item__content{
        margin-left:100px !important;
    }
    .insConfigCol h3{
        font-size: 16px;
        font-weight:normal;
        padding-left: 40px;
    }
    .insConfigCol h3 small{
        padding-left: 16px;
    }
    .insConfig{
        border:1px solid #ddd;
        padding:10px;
        box-sizing:border-box;
        margin-top:10px;
        margin-left:120px;
        overflow:hidden;
    }
    .insConfig div{
        float:left;
    }
    .insConfig .editConfig{
        position:relative;
        width:300px;
        height:300px;
        border:1px dashed #ddd;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        background-size:100% 100%;
    }
    .insConfig .editConfig:after{
        content:'';
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background-color:rgba(0,0,0,0.5);
    }
    .btnEdit{
        margin: 0 auto;
        display: block;
        height: 40px;
    }
    .editUsalConfig p{
        display: block;
        overflow: hidden;
        padding-left: 20px;
    }
    .editUsalConfig >>> .el-input{
        float: left;
        width: 160px;
    }
    .editUsalConfig >>> .el-input__inner{
        line-height: 20px;
        height: 32px;
    }
    .editUsalConfig >>> .el-button{
        padding:8px;
        margin-left:10px;
    }
    .editUsalConfig >>> .el-radio{
        line-height:40px;
    }
    .editUsalConfig img{
        width:120px;
        height:120px;
    }
    .tempBtns{
        text-align: center;
        padding-top: 30px;
    }
    .allbackImg{
        width: 100px;
        height: 100px;
        line-height: 100px;
    }
    .allbackImg >>> .el-upload{
        width:100px;
    }
    .allbackImg img{
        width:100px;
        height:100px;
    }
    .eleColStyle{
        width:200px;
        float:left;
    }
    .pdlt{
        padding-left: 50px;
    }
    .eleIcstyle >>> .el-upload{
        width: 50px;
        height: 50px;
        line-height: 50px;
    }
    .eleIcstyle img{
        width:50px;
        height:50px;
    }
    .threeBanner >>> .el-form-item__label{
        width:140px !important;
    }
</style>
<style>
    .eleUlstyle .el-form-item__content{
        margin-left:30px !important;
    }
    .eleIcstyle .el-form-item__content{
        margin-left:10px !important;
    }
</style>
