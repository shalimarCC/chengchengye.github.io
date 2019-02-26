<template>
    <div id="example">
        <template v-if="active==1">
            <div>
                <h3 style="line-height:80px;">基本信息：</h3>
                <el-form ref="form" :model="form" label-width="200px">
                    <el-form-item label="模板名称">
                        <el-input class="filter-item" placeholder="模板名称" :maxlength="30" v-model="form.name"></el-input>
                    </el-form-item>

                    <el-form-item label="模板备注">
                        <el-input class="filter-item" placeholder="模板备注" v-model="form.remark"></el-input>
                    </el-form-item>

                    <el-form-item label="所属客户端">
                        <el-select v-model="form.clientType" placeholder="选择所属客户端">
                            <el-option
                                v-for="item in clientTypeList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                                v-if="item.value!=5 || platformId!=2">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="是否显示平台logo">
                        <el-radio-group v-model="form.showFgj">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>

            <div>
                <h3 style="line-height:80px;">实例配置：</h3>
                <div style="width:600px;min-height:200px;border:1px solid #ccc;padding:50px;margin:60px auto;">
                    <ul>
                       <li v-for="info in form.elementList" style="border:1px dashed #ccc;border-radius:5px;margin-bottom:20px;padding:20px 40px;cursor:move" v-dragging="{ item: info, list: form.elementList, group: 'info' }" :key="info.elementId">
                            <div style="display:inline-block;" class="clearfix">
                                <div style="text-align: center;width:188px;line-height:100px;display:inline-block;background-size:100% 100%;background-repeat:no-repeat;float:left;" :style="'background-image:url('+info.imgUrl+')'">
                                    <el-button type="primary" size="mini" @click="editElement(info.elementId,info.instId)" plain>编辑</el-button>
                                    <el-button type="danger" size="mini" @click="deleteElement(info.elementId)" plain>删除</el-button>
                                </div>
                                <div style="display:inline-block;margin:0 40px;float:left;width:175px;">
                                    <p style="line-height:30px;">{{info.elementName}}</p>
                                    <p style="line-height:30px;">iOS版本号：{{info.clientVersionA}}</p>
                                    <p style="line-height:30px;">Android版本号：{{info.clientVersionI}}</p>
                                </div>
                            </div>
                        </li>

                        <li style="width:100%;height:200px;border:1px dashed #ccc;border-radius:5px;text-align:center;line-height:200px">
                            <el-button class="filter-item" @click="addExample" size="medium" type="primary" icon="edit">新增实例</el-button>
                        </li>
                    </ul>
                </div>
            </div>

            <div style="position: sticky;bottom: 0;text-align:center;background: rgba(155,155,155,0.5);width:100%;">
                <el-button size="medium" style="margin: 12px;" @click='saveTemplate'>保存</el-button>
            </div>

            <el-dialog :title="exampleTitle" :visible.sync="dialogFormVisible" width="700px"  top="4vh">
                <div style="margin-bottom:20px;width:100%;height:550px;overflow:auto;">
                    <el-form ref="form" :model="exampleForm" label-width="120px">
                        <el-form-item label="实例名称">
                            <el-input placeholder="实例名称" v-model="exampleForm.name"></el-input>
                        </el-form-item>

                        <el-form-item label="所属公司">
                            <el-select v-model="exampleForm.companyIds" collapse-tags multiple :disabled="allStatus.length>0">
                                <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                                <el-option
                                    v-for="item in companyList"
                                    :key="item.id"
                                    :label="item.companyName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-checkbox-group v-model="allStatus">
                                <el-checkbox :label="-1" v-if="form.companyType==0">全部正式公司可见</el-checkbox>
                                <el-checkbox :label="-3" v-if="form.companyType==1">全部演示公司可见</el-checkbox>
                                <el-checkbox :label="-2" v-if="form.companyType==2">全部竞品公司可见</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label="实例间距">
                            <el-input placeholder="实例间距" v-model="exampleForm.margin"><template slot="append">px</template></el-input>
                            <p>楼层间距为当前楼层距离上一个楼层的距离（单位：px）</p>
                        </el-form-item>

                        <el-form-item label="所属分页tab" v-if="form.clientType==4">
                            <el-select v-model="pageTabId">
                                <el-option
                                    v-for="item in tabList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">

                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="选择组件">
                            <div style="width:375px;height:200px;border:1px dashed #ccc;border-radius:5px;text-align:center;line-height:200px;background-size:100% 100%;background-repeat:no-repeat;" :style="'background-image:url('+elementObj.imgUrl+')'">
                                <el-button class="filter-item" @click="selectModule" size="medium" type="primary" v-if="this.elementObj.configType===''">选择组件</el-button>
                                <el-button class="filter-item" @click="selectModule" size="medium" type="primary" v-else>重新选择</el-button>
                            </div>
                        </el-form-item>

                        <el-form-item label="选择轮播图" v-if="elementObj.configType === 0||elementObj.configType === 1">
                            <div>
                                <ul>
                                    <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,key) in checkBannerList" v-dragging="{ item: info, list: checkBannerList, group: 'info' }" :key="info.id">
                                        <div style="display:inline-block;" class="clearfix">
                                            <img :src="info.imgUrl" style="width:188px;height:100px;display:inline-block;float:left;" />
                                            <div style="display:inline-block;margin:0 40px;float:left;width:175px;">
                                                <p style="line-height:30px;">{{info.name}}</p>
                                                <p style="line-height:30px;">
                                                    <el-button class="filter-item" @click="deleteBanner(key)" size="medium" type="danger">删除</el-button>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <el-button class="filter-item" @click="selectBanner" size="medium" type="primary" icon="el-icon-plus">选择轮播图</el-button>
                            </div>
                        </el-form-item>


                        <el-form-item label="标题名称" v-if="elementObj.configType >= 100 && elementObj.configType < 200 || (elementObj.configType == 501 || elementObj.configType == 601)">
                            <el-input placeholder="标题名称" v-model="exampleForm.titleName"></el-input>
                        </el-form-item>

                        <el-form-item label="标题颜色" v-if="elementObj.configType == 501 || elementObj.configType == 601">
                            <el-select v-model="exampleForm.titleColor">
                                <el-option
                                    v-for="item in colorList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">

                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="关联商品组合" v-if="(elementObj.configType >= 100 && elementObj.configType < 200)|| elementObj.configType == 601 || elementObj.configType == 501">
                            <el-select v-model="exampleForm.sucId">
                                <el-option
                                    v-for="item in classifyList"
                                    :key="item.standardUnitCombinationId"
                                    :label="item.combinationName"
                                    :value="item.standardUnitCombinationId">

                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="展示商品数" v-if="elementObj.configType >= 100 && elementObj.configType < 200 && elementObj.configType != 114 && elementObj.configType != 115 && elementObj.configType != 116">
                            <el-input-number placeholder="模板页最多展示商品数" :min="1" v-model="exampleForm.maxShow"></el-input-number>
                        </el-form-item>

                        <el-form-item label="Banner图" class="clear" v-if="elementObj.configType == 102 || elementObj.configType == 103 || elementObj.configType == 106 || elementObj.configType == 107 || elementObj.configType == 110 || elementObj.configType == 111 || elementObj.configType == 113">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseImgPath"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess6"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleError"
                                :data="imgForm">
                                <img v-if="exampleForm.bannerUrl" :src="exampleForm.bannerUrl">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>

                        <el-form-item label="Banner跳转页面" v-if="elementObj.configType == 102 || elementObj.configType == 103 || elementObj.configType == 106 || elementObj.configType == 107 || elementObj.configType == 110 || elementObj.configType == 111 || elementObj.configType == 113">
                            <el-select v-model="exampleForm.linkType" @change="bannerChUrl">
                                <el-option
                                    v-for="(item,index) in bannerSkipList"
                                    v-if="index!=6||form.clientType==4"
                                    :key="item.value"
                                    :label="item.key"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="配置参数" prop="name" v-if="exampleForm.linkType==1">
                            <el-select v-model="exampleForm.linkId">
                                <el-option
                                    v-for="item in localList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="配置链接" prop="name" v-else-if="exampleForm.linkType==2">
                            <el-input v-model="exampleForm.linkUrl"></el-input>
                        </el-form-item>

                        <el-form-item label="配置链接" prop="name" v-else-if="exampleForm.linkType==3">
                            <el-select v-model="exampleForm.linkId">
                                <el-option
                                    v-for="item in urlList"
                                    :key="item.externalLinkId"
                                    :label="item.externalLinkName"
                                    :value="item.externalLinkId">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="商品分类" prop="name" v-else-if="exampleForm.linkType==4">
                            <el-select v-model="exampleForm.linkId">
                                <el-option
                                    v-for="item in classifyList"
                                    :key="item.standardUnitCombinationId"
                                    :label="item.combinationName"
                                    :value="item.standardUnitCombinationId">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <!-- 跳转页面 -->
                        <el-form-item label="移动端页面" v-if="exampleForm.linkType==4 && form.clientType!=4" @change="changeList">
                            <el-select v-model="exampleForm.cmsPageMId" placeholder="跳转页面" @change="changeList">
                                <el-option
                                v-for="(item,index) in clientTypeDate"
                                :key="item.id"
                                :label="item.pageName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="PC端页面" v-if="exampleForm.linkType==4 && form.clientType==4">
                            <el-select v-model="exampleForm.cmsPagePcId" placeholder="跳转页面">
                                <el-option
                                    v-for="(item,index) in clientTypeDate2"
                                    :key="item.id"
                                    :label="item.pageName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="配置商品" prop="name" v-else-if="exampleForm.linkType==5">
                            <el-select
                                v-model="exampleForm.linkId"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                    <el-option
                                    v-for="item in goodsList"
                                    :key="item.standardUnitId"
                                    :label="item.standardUnitName"
                                    :value="item.standardUnitId">
                                    </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="所属分页tab" v-else-if="exampleForm.linkType==7">
                            <el-select v-model="exampleForm.linkId">
                                <el-option
                                    v-for="item in tabList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">

                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="标题名称" v-if="elementObj.configType == 201||elementObj.configType == 202">
                            <el-input placeholder="标题名称" v-model="exampleForm.iconTitle" :maxlength="6"></el-input>
                        </el-form-item>

                        <el-form-item label="icon个数" v-if="elementObj.configType >= 200 && elementObj.configType < 300&&elementObj.configType!=202&&elementObj.configType!=203">
                            <el-select v-model="exampleForm.count" @change="iconChange">
                                <el-option
                                    v-for="item in iconNum"
                                    :key="item.value"
                                    :label="item.key"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <p v-if="exampleForm.count!=''" style="color:#f00;">*切换个数后将导致已配置的icon信息丢失，请确认后再切换</p>
                        </el-form-item>

                        <el-form-item label="标题名称" v-if="elementObj.configType == 301 || elementObj.configType == 303">
                            <el-input placeholder="标题名称" v-model="exampleForm.imagetextTitle"></el-input>
                        </el-form-item>

                        <el-form-item label="标语icon" class="clear" v-if="elementObj.configType >= 400 && elementObj.configType < 500">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseImgPath"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess5"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleError"
                                :data="imgForm">
                                <img v-if="exampleForm.lableIconUrl" :src="exampleForm.lableIconUrl">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>

                        <el-form-item v-for="(info,key) in exampleForm.lableArr" :label="'标语'+(key+1)" v-if="elementObj.configType >= 400">
                            <el-input :placeholder="'标语'+(key+1)" v-model="info.labelName"></el-input>
                        </el-form-item>


                    </el-form>

                    <div style="width:100%;" v-if="elementObj.configType >= 200 && elementObj.configType < 300 && elementObj.configType!=202">
                        <p v-if="elementObj.configType==203" style="color:#f00;">*需配置5个元件(图片尺寸232x330）</p>
                        <ul>
                            <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,key) in exampleForm.iconArr" v-dragging="{ item: info, list: exampleForm.iconArr, group: 'info' }" :key="info.imgUrl">
                                <div style="float:left;width:150px;height:150px;">
                                    <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess3"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm">
                                        <img v-if="info.imgUrl!=1 && info.imgUrl!=2 && info.imgUrl!=3 && info.imgUrl!=4 && info.imgUrl!=5 && info.imgUrl!=6 && info.imgUrl!=7 && info.imgUrl!=8 && info.imgUrl!=9 && info.imgUrl!=10 && info.imgUrl!=11 && info.imgUrl!=0" :src="info.imgUrl" @click="uploadKeyIndex(key)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadKeyIndex(key)"></i>
                                    </el-upload>
                                </div>
                                <div style="float:left;">
                                    <p style="margin: 10px;">
                                        <el-input style="width: 400px;" class="filter-item" placeholder="显示名称" v-model="info.iconName"></el-input>
                                    </p>

                                    <p style="margin: 10px;" v-if="elementObj.configType == 203">
                                        <el-input style="width: 400px;" class="filter-item" placeholder="简介" v-model="info.summary"></el-input>
                                    </p>

                                    <p style="margin: 10px;">
                                        <el-select v-model="info.linkType" style="width: 400px;" placeholder="跳转页面" @change="info.linkId=''">
                                            <el-option
                                                v-for="(item,index) in bannerSkipList"
                                                v-if="(index!=0||form.clientType!=4)&&(index!=6||form.clientType==4)"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-if="info.linkType==1" style="margin: 10px;">
                                        <el-select v-model="info.linkId" placeholder="配置参数"  style="width: 400px;">
                                            <el-option
                                                v-for="item in localList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==2"  style="margin: 10px;">
                                        <el-input v-model="info.linkUrl" placeholder="配置链接" style="width: 400px;"></el-input>
                                    </p>

                                    <p v-else-if="info.linkType==3"  style="margin: 10px;">
                                        <el-select v-model="info.linkId" style="width: 400px;" placeholder="配置链接">
                                            <el-option
                                                v-for="item in urlList"
                                                :key="item.externalLinkId"
                                                :label="item.externalLinkName"
                                                :value="item.externalLinkId">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==4" style="margin: 10px;">
                                        <el-select v-model="info.linkId" style="width: 400px;" placeholder="商品分类">
                                            <el-option
                                                v-for="item in classifyList"
                                                :key="item.standardUnitCombinationId"
                                                :label="item.combinationName"
                                                :value="item.standardUnitCombinationId">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <!-- 跳转页面 -->
                                    <p  v-if="info.linkType==4 && form.clientType!=4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPageMId" style="width: 400px;" placeholder="移动端页面">
                                            <el-option
                                            v-for="(item,index) in clientTypeDate"
                                            :key="item.id"
                                            :label="item.pageName"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>
                                    <p v-if="info.linkType==4&&form.clientType==4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPagePcId" style="width: 400px;" placeholder="PC端页面">
                                            <el-option
                                                v-for="(item,index) in clientTypeDate2"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==5" style="margin: 10px;">
                                        <el-select
                                            style="width: 400px;"
                                            v-model="info.linkId"
                                            filterable
                                            remote
                                            reserve-keyword
                                            placeholder="配置商品"
                                            :remote-method="remoteMethod"
                                            :loading="loading">
                                                <el-option
                                                v-for="item in goodsList"
                                                :key="item.standardUnitId"
                                                :label="item.standardUnitName"
                                                :value="item.standardUnitId">
                                                </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==7" style="margin: 10px;">
                                        <el-select v-model="info.linkId" placeholder="配置tab">
                                            <el-option
                                                v-for="item in tabList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">

                                            </el-option>
                                        </el-select>
                                    </p>

                                </div>
                            </li>
                        </ul>
                    </div>

                    <div style="min-height:200px;border:1px solid #ccc;padding:10px 50px;margin:30px auto;" v-if="elementObj.configType == 202">
                        <h3 style="line-height:80px;">ICON配置：</h3>
                        <ul>
                            <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,key) in exampleForm.iconArr" v-dragging="{ item: info, list: exampleForm.iconArr, group: 'info' }" :key="info.index">
                                <div style="float:left;width:150px;height:150px;border:1px solid #ccc;">
                                    <img :src="info.imgUrl" v-if="info.imgUrl!=1" style="width:100%;height:100%;"/>

                                </div>
                                <div style="float:left;">
                                    <p style="margin: 10px;">
                                        {{info.iconName}}
                                    </p>
                                    <p style="margin: 10px;text-align:center;">
                                        <el-button size="medium" type="primary" @click="editIcon(key)" style="margin-right:20px;">编辑</el-button>
                                        <el-button size="medium" type="danger" @click="delIcon(key)">删除</el-button>
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <el-button class="filter-item" @click="addIcon" size="medium" type="primary" icon="el-icon-plus">添加</el-button>
                    </div>

                    <div style="min-height:200px;border:1px solid #ccc;padding:10px 50px;margin:30px auto;" v-if="elementObj.configType == 304">
                        <h3 style="line-height:80px;">ICON配置：</h3>
                        <ul>
                            <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,key) in exampleForm.imagetextArr">
                                <div style="float:left;width:150px;height:150px;border:1px solid #ccc;">
                                    <img :src="info.imagetextUrl" v-if="info.imagetextUrl!=1 && info.imagetextUrl!=2" style="width:100%;height:100%;"/>
                                </div>
                                <div style="float:left;">
                                    <p style="margin: 10px;">
                                        {{info.imagetextName}}
                                    </p>
                                    <p v-if="key==0" style="color:#f00;">此为左侧大图</p>
                                    <p style="margin: 10px;text-align:center;">
                                        <el-button size="medium" type="primary" @click="editImg(key)" style="margin-right:20px;">编辑</el-button>
                                        <el-button size="medium" type="danger" v-if="key>1" @click="delImg(key)">删除</el-button>
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <el-button class="filter-item" @click="addImg" size="medium" type="primary" icon="el-icon-plus">添加</el-button>
                    </div>

                    <div style="width:100%;" v-if="elementObj.configType >= 300 && elementObj.configType < 400 && elementObj.configType != 304">
                        <ul>
                            <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,index) in exampleForm.imagetextArr" v-dragging="{ item: info, list: exampleForm.imagetextArr, group: 'info' }" :key="info.imagetextUrl">
                                <div style="float:left;width:150px;height:150px;">
                                    <el-upload
                                        class="avatar-uploader"
                                        :action="baseImgPath"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess4"
                                        :before-upload="beforeAvatarUpload"
                                        :on-error="handleError"
                                        :data="imgForm">
                                        <img v-if="info.imagetextUrl!=1 && info.imagetextUrl!=2 && info.imagetextUrl!=3" :src="info.imagetextUrl" @click="uploadKeyIndex(index)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadKeyIndex(index)"></i>
                                    </el-upload>
                                </div>
                                <div style="float:left;">
                                    <p style="margin: 10px;">
                                        <el-input style="width: 400px;" placeholder="显示名称" v-model="info.imagetextName"></el-input>
                                    </p>

                                    <p style="margin: 10px;">
                                        <el-select v-model="info.linkType" style="width: 400px;" placeholder="跳转页面"  @change="info.linkId=''">
                                            <el-option
                                                v-for="(item,index) in bannerSkipList"
                                                v-if="(index!=0||form.clientType!=4)&&(index!=6||form.clientType==4)"
                                                :key="item.value"
                                                :label="item.key"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-if="info.linkType==1" style="margin: 10px;">
                                        <el-select v-model="info.linkId" placeholder="配置参数"  style="width: 400px;">
                                            <el-option
                                                v-for="item in localList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==2"  style="margin: 10px;">
                                        <el-input v-model="info.linkUrl" placeholder="配置链接" style="width: 400px;"></el-input>
                                    </p>

                                    <p v-else-if="info.linkType==3"  style="margin: 10px;">
                                        <el-select v-model="info.linkId" style="width: 400px;" placeholder="配置链接">
                                            <el-option
                                                v-for="item in urlList"
                                                :key="item.externalLinkId"
                                                :label="item.externalLinkName"
                                                :value="item.externalLinkId">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==4" style="margin: 10px;">
                                        <el-select v-model="info.linkId" style="width: 400px;" placeholder="商品分类">
                                            <el-option
                                                v-for="item in classifyList"
                                                :key="item.standardUnitCombinationId"
                                                :label="item.combinationName"
                                                :value="item.standardUnitCombinationId">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <!-- 跳转页面 -->
                                    <p  v-if="info.linkType==4 && form.clientType!=4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPageMId" style="width: 400px;" placeholder="移动端页面">
                                            <el-option
                                            v-for="(item,index) in clientTypeDate"
                                            :key="item.id"
                                            :label="item.pageName"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>
                                    <p v-if="info.linkType==4&&form.clientType==4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPagePcId" style="width: 400px;" placeholder="PC端页面">
                                            <el-option
                                                v-for="(item,index) in clientTypeDate2"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==5" style="margin: 10px;">
                                        <el-select
                                            style="width: 400px;"
                                            v-model="info.linkId"
                                            filterable
                                            remote
                                            reserve-keyword
                                            placeholder="配置商品"
                                            :remote-method="remoteMethod"
                                            :loading="loading">
                                                <el-option
                                                v-for="item in goodsList"
                                                :key="item.standardUnitId"
                                                :label="item.standardUnitName"
                                                :value="item.standardUnitId">
                                                </el-option>
                                        </el-select>
                                    </p>

                                    <p v-else-if="info.linkType==7" style="margin: 10px;">
                                        <el-select v-model="info.linkId" placeholder="配置tab">
                                            <el-option
                                                v-for="item in tabList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">

                                            </el-option>
                                        </el-select>
                                    </p>

                                </div>
                            </li>
                        </ul>
                    </div>


                    <div style="width:100%;" v-if="elementObj.configType == 601||elementObj.configType == 501">
                        <div v-if="elementObj.configType == 601">
                            <h3 style="line-height:80px;">上轮播配置：</h3>
                            <p style="color:#f00;">*最多配置五个,推荐尺寸474*280</p>
                            <ul v-if="handleAvatarSuccess9Show">
                                <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,index) in exampleForm.imagetextBannerArr" v-dragging="{ item: info, list: exampleForm.imagetextBannerArr, group: 'info' }" :key="info.imagetextBannerArr">
                                    <div style="float:left;width:150px;height:150px;">
                                        <el-upload
                                            class="avatar-uploader"
                                            :action="baseImgPath"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess9"
                                            :before-upload="beforeAvatarUpload"
                                            :on-error="handleError"
                                            :data="imgForm">
                                            <img v-if="info.imagetextUrl!=1 && info.imagetextUrl!=2 && info.imagetextUrl!=3" :src="info.imagetextUrl" @click="uploadKeyIndex(index)">
                                            <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadKeyIndex(index)"></i>
                                        </el-upload>
                                    </div>
                                    <div style="float:left;">

                                        <p style="margin: 10px;">
                                            <el-select v-model="info.linkType" style="width: 400px;" placeholder="跳转页面"  @change="changeList2">
                                                <el-option
                                                    v-for="(item,index) in bannerSkipList"
                                                    v-if="index!=0||form.clientType!=4"
                                                    :key="item.value"
                                                    :label="item.key"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </p>

                                        <p v-if="info.linkType==1" style="margin: 10px;">
                                            <el-select v-model="info.linkId" placeholder="配置参数"  style="width: 400px;">
                                                <el-option
                                                    v-for="item in localList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </p>

                                        <p v-else-if="info.linkType==2"  style="margin: 10px;">
                                            <el-input v-model="info.linkUrl" placeholder="配置链接" style="width: 400px;"></el-input>
                                        </p>

                                        <p v-else-if="info.linkType==3"  style="margin: 10px;">
                                            <el-select v-model="info.linkId" style="width: 400px;" placeholder="配置链接">
                                                <el-option
                                                    v-for="item in urlList"
                                                    :key="item.externalLinkId"
                                                    :label="item.externalLinkName"
                                                    :value="item.externalLinkId">
                                                </el-option>
                                            </el-select>
                                        </p>

                                        <p v-else-if="info.linkType==4" style="margin: 10px;">
                                            <el-select v-model="info.linkId" style="width: 400px;" placeholder="商品分类" @change="changeList">
                                                <el-option
                                                    v-for="item in classifyList"
                                                    :key="item.standardUnitCombinationId"
                                                    :label="item.combinationName"
                                                    :value="item.standardUnitCombinationId">
                                                </el-option>
                                            </el-select>
                                        </p>

                                         <!-- 跳转页面 -->
                                    <p  v-if="info.linkType==4 && form.clientType!=4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPageMId" style="width: 400px;" placeholder="移动端页面" @change="changeList">
                                            <el-option
                                            v-for="(item,index) in clientTypeDate"
                                            :key="item.id"
                                            :label="item.pageName"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>
                                    <p v-if="info.linkType ==4 && form.clientType == 4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPagePcId" style="width: 400px;" placeholder="PC端页面" @change="changeList">
                                            <el-option
                                                v-for="(item,index) in clientTypeDate2"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>

                                        <p v-else-if="info.linkType==5" style="margin: 10px;">
                                            <el-select
                                                style="width: 400px;"
                                                v-model="info.linkId"
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="配置商品"
                                                :remote-method="remoteMethod"
                                                :loading="loading">
                                                    <el-option
                                                    v-for="item in goodsList"
                                                    :key="item.standardUnitId"
                                                    :label="item.standardUnitName"
                                                    :value="item.standardUnitId">
                                                    </el-option>
                                            </el-select>
                                        </p>

                                        <p v-else-if="info.linkType==7" style="margin: 10px;">
                                            <el-select v-model="info.linkId" placeholder="配置tab">
                                                <el-option
                                                    v-for="item in tabList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">

                                                </el-option>
                                            </el-select>
                                        </p>

                                    </div>
                                </li>
                            </ul>
                            <el-button class="filter-item" @click="addBanner(index)" size="medium" type="primary" icon="el-icon-plus">添加</el-button>
                        </div>
                        <div>
                            <h3 style="line-height:80px;">左下角banner图（2张）</h3>
                            <ul>
                                <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,index) in exampleForm.imagetextArr" v-dragging="{ item: info, list: exampleForm.imagetextArr, group: 'info' }" :key="info.imagetextUrl">
                                    <div style="float:left;width:150px;height:150px;">
                                        <el-upload
                                            class="avatar-uploader"
                                            :action="baseImgPath"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess4"
                                            :before-upload="beforeAvatarUpload"
                                            :on-error="handleError"
                                            :data="imgForm">
                                            <img v-if="info.imagetextUrl!=1 && info.imagetextUrl!=2 && info.imagetextUrl!=3" :src="info.imagetextUrl" @click="uploadKeyIndex(index)">
                                            <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadKeyIndex(index)"></i>
                                        </el-upload>
                                    </div>
                                    <div style="float:left;">

                                        <p style="margin: 10px;">
                                            <el-select v-model="info.linkType" style="width: 400px;" placeholder="跳转页面"  @change="info.linkId=''">
                                                <el-option
                                                    v-for="(item,index) in bannerSkipList"
                                                    v-if="index!=0||form.clientType!=4"
                                                    :key="item.value"
                                                    :label="item.key"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </p>

                                        <p v-if="info.linkType==1" style="margin: 10px;">
                                            <el-select v-model="info.linkId" placeholder="配置参数"  style="width: 400px;">
                                                <el-option
                                                    v-for="item in localList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </p>

                                        <p v-else-if="info.linkType==2"  style="margin: 10px;">
                                            <el-input v-model="info.linkUrl" placeholder="配置链接" style="width: 400px;"></el-input>
                                        </p>

                                        <p v-else-if="info.linkType==3"  style="margin: 10px;">
                                            <el-select v-model="info.linkId" style="width: 400px;" placeholder="配置链接">
                                                <el-option
                                                    v-for="item in urlList"
                                                    :key="item.externalLinkId"
                                                    :label="item.externalLinkName"
                                                    :value="item.externalLinkId">
                                                </el-option>
                                            </el-select>
                                        </p>

                                        <p v-else-if="info.linkType==4" style="margin: 10px;">
                                            <el-select v-model="info.linkId" style="width: 400px;" placeholder="商品分类">
                                                <el-option
                                                    v-for="item in classifyList"
                                                    :key="item.standardUnitCombinationId"
                                                    :label="item.combinationName"
                                                    :value="item.standardUnitCombinationId">
                                                </el-option>
                                            </el-select>
                                        </p>

                                        <!-- 跳转页面 -->
                                    <p  v-if="info.linkType==4 && form.clientType!=4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPageMId" style="width: 400px;" placeholder="移动端页面">
                                            <el-option
                                            v-for="(item,index) in clientTypeDate"
                                            :key="item.id"
                                            :label="item.pageName"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>
                                    <p v-if="info.linkType==4&& form.clientType==4" style="margin: 10px;">
                                        <el-select v-model="info.cmsPagePcId" style="width: 400px;" placeholder="PC端页面">
                                            <el-option
                                                v-for="(item,index) in clientTypeDate2"
                                                :key="item.id"
                                                :label="item.pageName"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </p>

                                        <p v-else-if="info.linkType==5" style="margin: 10px;">
                                            <el-select
                                                style="width: 400px;"
                                                v-model="info.linkId"
                                                filterable
                                                remote
                                                reserve-keyword
                                                placeholder="配置商品"
                                                :remote-method="remoteMethod"
                                                :loading="loading">
                                                    <el-option
                                                    v-for="item in goodsList"
                                                    :key="item.standardUnitId"
                                                    :label="item.standardUnitName"
                                                    :value="item.standardUnitId">
                                                    </el-option>
                                            </el-select>
                                        </p>

                                        <p v-else-if="info.linkType==7" style="margin: 10px;">
                                            <el-select v-model="info.linkId" placeholder="配置tab">
                                                <el-option
                                                    v-for="item in tabList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">

                                                </el-option>
                                            </el-select>
                                        </p>

                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div slot="footer" class="dialog-footer" :span="24">
                    <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button size="medium" type="primary" :loading="btnStatus" @click="updataTemplate">确 定</el-button>
                </div>

                <el-dialog title="选择组件" :visible.sync="dialogFormVisible1" append-to-body width="600px" top="4vh">
                    <div style="width:100%;height:450px;overflow:auto;">
                        <ul>
                            <li v-for="info in elementList" style="border:1px dashed #ccc;border-radius:5px;margin-bottom:20px;padding:20px 40px;">
                                <el-radio v-model="radio" :label="info.dictId">
                                    <div style="display:inline-block;" class="clearfix">
                                        <div style="display:inline-block;margin:0 40px;float:left;width:175px;">
                                            <p style="line-height:30px;">{{info.dictName}}</p>
                                            <p style="line-height:30px;">iOS版本号：{{info.clientVersionA}}</p>
                                            <p style="line-height:30px;">Android版本号：{{info.clientVersionI}}</p>
                                        </div>
                                        <img :src="info.imgUrl" style="width:188px;height:100px;display:inline-block;" />
                                    </div>
                                </el-radio>

                            </li>
                        </ul>
                    </div>
                    <div slot="footer" class="dialog-footer" :span="24">
                        <el-button size="medium" @click="dialogFormVisible1 = false">取 消</el-button>
                        <el-button size="medium" type="primary" @click="updataElement">确 定</el-button>
                    </div>
                </el-dialog>

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
                            <el-table :key='tableKey' :data="bannerList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

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
                        <el-button size="medium" type="primary" @click="updataBanner">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="编辑ICON信息" :visible.sync="dialogFormVisible5" append-to-body top="4vh">
                    <div style="margin-bottom:20px;width:100%;height:550px;overflow:auto;">
                        <el-form ref="form" :model="iconObj" label-width="120px">
                            <el-form-item label="icon名称">
                                <el-input placeholder="icon名称" v-model="iconObj.iconName"></el-input>
                            </el-form-item>

                            <el-form-item label="所属公司">
                                <el-select v-model="iconObj.companyIds" collapse-tags multiple :disabled="allIconStatus.length>0">
                                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allIconCheck">全选</p>
                                    <el-option
                                        v-for="item in companyList"
                                        :key="item.id"
                                        :label="item.companyName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-checkbox-group v-model="allIconStatus">
                                    <el-checkbox :label="-1" v-if="form.companyType==0">全部正式公司可见</el-checkbox>
                                    <el-checkbox :label="-2" v-if="form.companyType==2">全部竞品公司可见</el-checkbox>
                                    <el-checkbox :label="-3" v-if="form.companyType==1">全部演示公司可见</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>

                            <el-form-item label="ICON图" class="clear">
                                <el-upload
                                    class="avatar-uploader"
                                    :action="baseImgPath"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess7"
                                    :before-upload="beforeAvatarUpload"
                                    :on-error="handleError"
                                    :data="imgForm">
                                    <img v-if="iconObj.imgUrl" :src="iconObj.imgUrl">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>

                            <el-form-item label="ICON跳转页面">
                                <el-select v-model="iconObj.linkType"  @change="iconObj.linkId=''">
                                    <el-option
                                        v-for="(item,index) in bannerSkipList"
                                        v-if="index!=0||form.clientType!=4"
                                        :key="item.value"
                                        :label="item.key"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="配置参数" prop="name" v-if="iconObj.linkType==1">
                                <el-select v-model="iconObj.linkId">
                                    <el-option
                                        v-for="item in localList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="配置链接" prop="name" v-else-if="iconObj.linkType==2">
                                <el-input v-model="iconObj.linkUrl"></el-input>
                            </el-form-item>

                            <el-form-item label="配置链接" prop="name" v-else-if="iconObj.linkType==3">
                                <el-select v-model="iconObj.linkId">
                                    <el-option
                                        v-for="item in urlList"
                                        :key="item.externalLinkId"
                                        :label="item.externalLinkName"
                                        :value="item.externalLinkId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="商品分类" prop="name" v-else-if="iconObj.linkType==4">
                                <el-select v-model="iconObj.linkId">
                                    <el-option
                                        v-for="item in classifyList"
                                        :key="item.standardUnitCombinationId"
                                        :label="item.combinationName"
                                        :value="item.standardUnitCombinationId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="跳转配置" v-if="iconObj.linkType==4 && form.clientType!=4">
                                <el-select v-model="iconObj.cmsPageMId" style="width: 400px;" placeholder="移动端页面" @change="changeList">
                                    <el-option
                                    v-for="(item,index) in clientTypeDate"
                                    :key="item.id"
                                    :label="item.pageName"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="跳转配置" v-if="iconObj.linkType==4 && form.clientType == 4">
                                <el-select v-model="iconObj.cmsPagePcId" style="width: 400px;" placeholder="PC端页面" @change="changeList">
                                    <el-option
                                    v-for="(item,index) in clientTypeDate"
                                    :key="item.id"
                                    :label="item.pageName"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="配置商品" prop="name" v-else-if="iconObj.linkType==5">
                                <el-select
                                    v-model="iconObj.linkId"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请输入关键词"
                                    :remote-method="remoteMethod"
                                    :loading="loading">
                                        <el-option
                                        v-for="item in goodsList"
                                        :key="item.standardUnitId"
                                        :label="item.standardUnitName"
                                        :value="item.standardUnitId">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="配置商品" prop="name" v-else-if="iconObj.linkType==7">
                                <el-select v-model="info.linkId" placeholder="配置tab">
                                    <el-option
                                        v-for="item in tabList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">

                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer" :span="24">
                        <el-button size="medium" @click="dialogFormVisible5 = false">取 消</el-button>
                        <el-button size="medium" type="primary" @click="updataIcon">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="编辑图文信息" :visible.sync="dialogFormVisible6" append-to-body top="4vh">
                    <div style="margin-bottom:20px;width:100%;height:550px;overflow:auto;">
                        <el-form ref="form" :model="imgObj" label-width="120px">
                            <el-form-item label="名称">
                                <el-input placeholder="icon名称" v-model="imgObj.imagetextName"></el-input>
                            </el-form-item>

                            <el-form-item label="图片" class="clear">
                                <el-upload
                                    class="avatar-uploader"
                                    :action="baseImgPath"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess8"
                                    :before-upload="beforeAvatarUpload"
                                    :on-error="handleError"
                                    :data="imgForm">
                                    <img v-if="imgObj.imagetextUrl!=1 && imgObj.imagetextUrl!=2" :src="imgObj.imagetextUrl">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>

                            <el-form-item label="跳转页面">
                                <el-select v-model="imgObj.linkType" @change="imgObj.linkId=''">
                                    <el-option
                                        v-for="(item,index) in bannerSkipList"
                                        v-if="index!=0||form.clientType!=4"
                                        :key="item.value"
                                        :label="item.key"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="配置参数" prop="name" v-if="imgObj.linkType==1">
                                <el-select v-model="imgObj.linkId">
                                    <el-option
                                        v-for="item in localList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="配置链接" prop="name" v-else-if="imgObj.linkType==2">
                                <el-input v-model="imgObj.linkUrl"></el-input>
                            </el-form-item>

                            <el-form-item label="配置链接" prop="name" v-else-if="imgObj.linkType==3">
                                <el-select v-model="imgObj.linkId">
                                    <el-option
                                        v-for="item in urlList"
                                        :key="item.externalLinkId"
                                        :label="item.externalLinkName"
                                        :value="item.externalLinkId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="商品分类" prop="name" v-else-if="imgObj.linkType==4">
                                <el-select v-model="imgObj.linkId">
                                    <el-option
                                        v-for="item in classifyList"
                                        :key="item.standardUnitCombinationId"
                                        :label="item.combinationName"
                                        :value="item.standardUnitCombinationId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="配置商品" prop="name" v-else-if="imgObj.linkType==5">
                                <el-select
                                    v-model="imgObj.linkId"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请输入关键词"
                                    :remote-method="remoteMethod"
                                    :loading="loading">
                                        <el-option
                                        v-for="item in goodsList"
                                        :key="item.standardUnitId"
                                        :label="item.standardUnitName"
                                        :value="item.standardUnitId">
                                        </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="配置商品" prop="name" v-else-if="imgObj.linkType==7">
                                <el-select v-model="imgObj.linkId" placeholder="配置tab">
                                    <el-option
                                        v-for="item in tabList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">

                                    </el-option>
                                </el-select>
                            </el-form-item>

                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer" :span="24">
                        <el-button size="medium" @click="dialogFormVisible6 = false">取 消</el-button>
                        <el-button size="medium" type="primary" @click="updataImg">确 定</el-button>
                    </div>
                </el-dialog>
            </el-dialog>


        </template>

        <template v-else-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>
  </div>

</template>



<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import seeGoods from '../goods/seeGoods.vue'
import {elementDict,
    getQiNiuToken,
    findCmsPageAllByClientType,
    findCompanyIdOrName,
    queryStandardUnitCombinationAll,
    findByStandardUnitName,
    findExternalLinkAll,
    queryBannerList,
    saveEleAndInst,
    eleAndInstDetail,
    templateDetail,
    deleteElement,
    saveTemplate,
    localParamList,
    findSimplePageTabAll,
    findCmsDictByParentId} from '../../../api/getData';
export default {
    data() {
        return {
            active:1,
            form:{
                name:'',
                remark:'',
                clientType:'',
                showFgj:1,
                elementList:'',
                cmsPagePcId:'',
                cmsPageMId:''
            },
            clientTypeDate:[],
            clientTypeDate2:[],
            exampleForm:{
                name:'',
                margin:20,
                pageTabId:'',
                elementDictId:'',
                elementId:'',
                instId:'',
                companyIds:'',
                bannerIds:[],
                titleName:'',
                sortType:'',
                maxShow:'',
                titleColor:'',
                sucId:'',
                bannerUrl:'',
                linkType:'',
                linkId:'',
                linkUrl:'',
                linkParam:'',
                count:'',
                iconArr:[],
                iconTitle:'',
                imagetextArr:[],
                lableIconUrl:'',
                lableArr:[],
                imagetextBannerArr:[],
                cmsPagePcId:'',
                cmsPageMId:'',
                linkableButtonPageList:[]
            },
            dialogFormVisible:false,
            dialogFormVisible1:false,
            elementList:[],
            radio:'',
            companyList:[],
            clientTypeList:[
                {
                    value:1,
                    name:'app'
                },
                {
                    value:2,
                    name:'微信'
                },
                {
                    value:3,
                    name:'小程序'
                },
                {
                    value:4,
                    name:'web商城'
                }
            ],
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
            colorList:[],
            urlList:[],
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
            ],
            goodsList:[],
            classifyList:[],
            loading: false,
            elementObj:{
                clientVersionA:'',
                clientVersionI:'',
                configType:'',
                dictId:'',
                dictName:'',
                imgUrl:''
            },
            tmplId:'',
            allStatus:[],
            index:'',
            baseImgPath:'',
            baseImgUrl:'',
            imgForm:{
                key:'',
                token:'',
            },
            dialogFormVisible4:false,
            bannerList:[],
            checkBannerList:[],
            bannerForm:{
                pageNo:1,
                pageSize:10,
                name:'',
                companyName:'',
                linkType:''
            },
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            exampleTitle:'新增实例',
            localList:[],
            dialogFormVisible5:false,
            iconObj:{
                iconName:'',
                imgUrl:'',
                linkType:'',
                linkId:'',
                linkUrl:''
            },
            allIconStatus:[],
            iconIndex:'',
            btnStatus:false,
            tabList:[],
            dialogFormVisible6:false,
            imgObj:{
                imagetextName:'',
                imagetextUrl:'',
                linkType:'',
                linkId:'',
                linkUrl:''
            },
            handleAvatarSuccess9Show:true,
            pageTabId:'',
            platformId:''
        }
    },
    created () {
        this.tmplId = this.$route.params.id;
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.templateDetail();
        this.findCmsPageAllByClientType(6);
        this.findCmsPageAllByClientType2(5);
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
    components: {
        seeGoods
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,16)
                 if(str == "/addShopTemplate"){
                    Object.assign(this.$data, this.$options.data())
                    this.tmplId = this.$route.params.id;
                    this.templateDetail();
                    this.findCmsPageAllByClientType(6);
                    this.findCmsPageAllByClientType2(5);
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
                }

            },
        }
    },
    methods:{
         changeList(){
             this.$forceUpdate();
         },
         changeList2(){
             this.$forceUpdate();
             $.each(this.exampleForm.imagetextBannerArr,function(key,info){
                 info.linkId = '';
             })
         },
        //icon change事件

        //查询模板详情
        async templateDetail () {
            try {
                const res = await templateDetail({templateId:this.tmplId});
                if (res.data.code == 0) {
                    this.form = res.data.data.template;
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
        //查询模板详情--组件列表
        async templateDetailEleList () {
            try {
                const res = await templateDetail({templateId:this.tmplId});
                if (res.data.code == 0) {
                    this.form.elementList = res.data.data.template.elementList;
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

        //新增实例
        addExample(){
            this.exampleForm = {
                name:'',
                margin:20,
                pageTabId:'',
                elementDictId:'',
                elementId:'',
                instId:'',
                companyIds:[],
                bannerIds:[],
                titleName:'',
                sortType:'',
                maxShow:'',
                sucId:'',
                bannerUrl:'',
                linkType:'',
                linkId:'',
                linkUrl:'',
                linkParam:'',
                count:'',
                iconArr:[],
                iconTitle:'',
                imagetextArr:[],
                lableIconUrl:'',
                lableArr:[],
                imagetextBannerArr:[],
                linkableButtonPageList:[],
            };
            this.elementObj = {
                clientVersionA:'',
                clientVersionI:'',
                configType:'',
                dictId:'',
                dictName:'',
                imgUrl:''
            };
            this.imgObj = {
                imagetextName:'',
                imagetextUrl:1,
                linkType:'',
                linkId:'',
                linkUrl:''
            };
            if(this.platformId == 2){
                this.exampleForm.companyIds = [2];
            }
            this.allStatus = [];
            this.checkBannerList = [];
            this.exampleTitle = '新增实例';
            this.dialogFormVisible = true;
            this.findCompanyIdOrName();
            this.queryStandardUnitCombinationAll();
            this.findExternalLinkAll();
            this.localParamList();
            this.findSimplePageTabAll();
            this.findCmsDictByParentId();
        },
        //获取tab列表
        async findSimplePageTabAll () {
            try {
                const res = await findSimplePageTabAll({templateId:this.tmplId});
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
                    message: '获取数据失败,请联系管理员！404'
                });

            }
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
        //获取颜色列表
        async findCmsDictByParentId () {
            try {
                const res = await findCmsDictByParentId({parentId:1});
                if (res.data.code == 0) {
                    this.colorList = res.data.data;
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
        //增加Banner
        addBanner(key){
            if(this.exampleForm.imagetextBannerArr.length>=5){
                return;
            }
            let obj = new Object();
            obj = {
                imagetextUrl:1,
                linkType:'',
                linkId:'',
                linkUrl:'',
                cmsPageMId:'',
                cmsPagePcId:'',
                linkableButtonPageList:[]
            };
            this.exampleForm.imagetextBannerArr.push(obj);
        },
        //增加icon
        addIcon(){
            let obj = new Object();
            obj = {
                iconName:'',
                imgUrl:'',///../../../static/img/imgOrg.jpg
                linkType:'',
                linkId:'',
                linkUrl:'',
                companyIds:[],
                linkableButtonPageList:[],
                index:this.exampleForm.iconArr.length
            };
            // if(this.form.clientType==4){
            //     $.each(this.exampleForm.iconArr,function(key,info){
            //         info.linkableButtonPageList.push({
            //             "cmsPageId": info.cmsPagePcId,
            //             "clientType": 5, // 5: pc端  6:移动端
            //         })
            //     })
            // }else if(this.form.clientType!=4){
            //         $.each(this.exampleForm.iconArr,function(key,info){
            //         info.linkableButtonPageList.push({
            //             "cmsPageId": info.cmsPageMId,
            //             "clientType": 6, // 5: pc端  6:移动端
            //         })
            //     })
            // }
            this.exampleForm.iconArr.push(obj);
            console.log(this.exampleForm.iconArr);
            console.log('111')
        },
        //编辑ICON
        editIcon(index){
            this.iconIndex = index;
            if(this.exampleForm.iconArr[index].companyIds && this.exampleForm.iconArr[index].companyIds[0] < 0){
                this.iconObj = this.exampleForm.iconArr[index];
                this.allIconStatus = this.allStatus;
                this.iconObj.companyIds = this.allIconStatus;
            }else{
                this.iconObj = this.exampleForm.iconArr[index];
            }
            this.dialogFormVisible5 = true;
        },
        //删除ICON
        delIcon(index){
            this.$confirm('此操作将删除该icon, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exampleForm.iconArr.splice(index, 1);
            }).catch(() => {

            });
        },
        //保存编辑信息
        updataIcon(){
            if(this.allIconStatus.length>0){
                this.iconObj.companyIds = this.allIconStatus;
            }
            if((this.iconObj.iconName==''||this.iconObj.imgUrl==''||this.iconObj.linkType==''||this.iconObj.companyIds.length==0)||(this.iconObj.linkId==''&&this.iconObj.linkUrl==''&&this.iconObj.linkType!=6)){
                this.$message({
                    type: 'error',
                    message: '请完善ICON信息'
                });
            }else{
                this.exampleForm.iconArr[this.iconIndex] = this.iconObj;
                this.dialogFormVisible5 = false;
            }
        },
        //增加图文
        addImg(){
            let obj = new Object();
            obj = {
                imagetextName:'',
                imagetextUrl:1,
                linkType:'',
                linkParam:''
            };
            this.exampleForm.imagetextArr.push(obj);
        },
        //编辑ICON
        editImg(index){
            this.iconIndex = index;
            this.imgObj = this.exampleForm.imagetextArr[index];

            this.dialogFormVisible6 = true;
        },
        //删除图文
        delImg(index){
            this.$confirm('此操作将删除该icon, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exampleForm.imagetextArr.splice(index, 1);
            }).catch(() => {

            });
        },
        //保存编辑信息
        updataImg(){
            // console.log(this.imgObj)
            if((this.imgObj.imagetextName==''||this.imgObj.imagetextUrl==''||this.imgObj.linkType==''||(this.imgObj.linkId==''&&this.imgObj.linkUrl==''&&this.imgObj.linkType!=6))){
                this.$message({
                    type: 'error',
                    message: '请完善信息'
                });
            }else{
                this.exampleForm.imagetextArr[this.iconIndex] = this.imgObj;
                this.dialogFormVisible6 = false;
            }
        },
        //删除组建
        deleteElement(id){
            this.$confirm('删除后该实例将不会在前端页面展示，确认删除该实例？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteElementAjax(id)
            }).catch(() => {

            });
        },
        async deleteElementAjax(id){
            try {
                const res = await deleteElement({elementId:id});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.templateDetail();
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
        //编辑组建回显
        async editElement(eleId,instId){
            try {
                this.exampleForm = {
                    name:'',
                    margin:20,
                    elementDictId:'',
                    elementId:'',
                    instId:'',
                    companyIds:'',
                    bannerIds:[],
                    titleName:'',
                    sortType:'',
                    maxShow:'',
                    sucId:'',
                    bannerUrl:'',
                    linkType:'',
                    linkId:'',
                    linkUrl:'',
                    linkParam:'',
                    count:'',
                    iconArr:[],
                    iconTitle:'',
                    imagetextArr:[],
                    lableIconUrl:'',
                    lableArr:[],
                    linkableButtonPageList:[]
                };
                const res = await eleAndInstDetail({elementId:eleId});
                if (res.data.code == 0) {
                    let data = res.data.data;
                    let thtf = this;
                    this.exampleTitle = '编辑实例';
                    this.findCompanyIdOrName();
                    this.queryStandardUnitCombinationAll();
                    this.findExternalLinkAll();
                    this.localParamList();
                    this.findSimplePageTabAll();
                    this.findCmsDictByParentId();
                    //公共信息
                    if(data.element.companyIds[0]<0){
                        this.allStatus = data.element.companyIds;
                        this.exampleForm.companyIds = [];
                    }else{
                        this.exampleForm.companyIds = data.element.companyIds;
                    }
                    this.exampleForm.name = data.element.elementName;
                    this.exampleForm.margin = data.element.margin;
                    this.exampleForm.elementId = data.element.elementId;
                    this.exampleForm.instId = data.element.instId;
                    if(this.form.clientType==4){
                        this.pageTabId = data.element.pageTabId;
                    }
                    this.elementObj = {
                        configType:data.element.type,
                        dictId:data.element.elementDictId,
                        dictName:data.element.elementName,
                        imgUrl:data.element.imgUrl
                    };

                    if(data.element.type===0||data.element.type===1){

                        //轮播图
                        this.checkBannerList = data.bannerList;
                        this.exampleForm.bannerIds = [];
                        $.each(data.bannerList,function(key,info){
                            thtf.exampleForm.bannerIds.push(info.id);
                        })
                    }else if(data.element.type>=100 && data.element.type<200){
                        this.exampleForm.bannerUrl = data.suList.bannerUrl;
                        this.exampleForm.sucId = data.suList.sucId;
                        this.exampleForm.maxShow = data.suList.maxShow;
                       // this.exampleForm.count = data.suList.suListId;
                        this.exampleForm.titleName = data.suList.titleName;
                        if(data.suList.linkableInfo!=null&&data.suList.linkableInfo!=""){
                            this.exampleForm.linkType = data.suList.linkableInfo.linkType;
                            if(this.exampleForm.linkType==5){
                                this.findByStandardUnitName('',data.suList.linkableInfo.linkId);
                            }else if(this.exampleForm.linkType == 4){
                                if(data.suList.linkableInfo.linkableButtonPageList && data.suList.linkableInfo.linkableButtonPageList.length>0){
                                    if(this.form.clientType == 4){
                                        this.exampleForm.cmsPagePcId = data.suList.linkableInfo.linkableButtonPageList[0].cmsPageId;
                                    }else{
                                        this.exampleForm.cmsPageMId = data.suList.linkableInfo.linkableButtonPageList[0].cmsPageId;
                                    }
                                }
                            }
                            this.exampleForm.linkId = data.suList.linkableInfo.linkId;
                            this.exampleForm.linkUrl = data.suList.linkableInfo.linkUrl;
                            this.exampleForm.linkParam = data.suList.linkableInfo.linkParam;
                        }
                    }else if(data.element.type>=200 && data.element.type<300){
                        //icon
                        this.exampleForm.count = data.iconGroup.count*1;
                      //  this.exampleForm.iconArr = data.iconGroup.iconList;
                        thtf.exampleForm.iconArr = [];
                        $.each(data.iconGroup.iconList,function(key,info){
                            if(info.linkType==5){
                                thtf.findByStandardUnitName('',info.linkId);
                                thtf.exampleForm.iconArr.push({
                                    iconName:info.iconName,
                                    linkType:info.linkType,
                                    imgUrl:info.imgUrl,
                                    linkParam:info.linkParam,
                                    linkId:info.linkId,
                                    linkUrl:info.linkUrl,
                                    summary:info.summary,
                                    companyIds:info.companyIds
                                });
                            }else if(info.linkType==4 && info.linkableButtonPageList && info.linkableButtonPageList.length>0){
                                if(thtf.form.clientType == 4){
                                    thtf.exampleForm.iconArr.push({
                                        iconName:info.iconName,
                                        cmsPagePcId:info.linkableButtonPageList[0].cmsPageId,
                                        linkType:info.linkType,
                                        imgUrl:info.imgUrl,
                                        linkParam:info.linkParam,
                                        linkId:info.linkId,
                                        linkUrl:info.linkUrl,
                                        summary:info.summary,
                                        companyIds:info.companyIds
                                    });
                                }else{
                                    thtf.exampleForm.iconArr.push({
                                        iconName:info.iconName,
                                        cmsPageMId:info.linkableButtonPageList[0].cmsPageId,
                                        linkType:info.linkType,
                                        imgUrl:info.imgUrl,
                                        linkParam:info.linkParam,
                                        linkId:info.linkId,
                                        linkUrl:info.linkUrl,
                                        summary:info.summary,
                                        companyIds:info.companyIds
                                    });
                                }
                            }else{
                                thtf.exampleForm.iconArr.push({
                                    iconName:info.iconName,
                                    linkType:info.linkType,
                                    imgUrl:info.imgUrl,
                                    linkParam:info.linkParam,
                                    linkId:info.linkId,
                                    linkUrl:info.linkUrl,
                                    summary:info.summary,
                                    companyIds:info.companyIds
                                });
                            }
                        });
                        this.exampleForm.iconTitle = data.iconGroup.title;
                    }else if(data.element.type>=300 && data.element.type<400){
                        //图文
                        this.exampleForm.imagetextTitle = data.imagetextGroup.title;
                       // this.exampleForm.imagetextArr = data.imagetextGroup.imagetextList;
                        this.exampleForm.imagetextArr = [];
                         $.each(data.imagetextGroup.imagetextList,function(key,info){
                            if(info.linkType==4 && info.linkableButtonPageList && info.linkableButtonPageList.length >0){
                                if(thtf.form.clientType == 4){
                                    thtf.exampleForm.imagetextArr.push({
                                        cmsPagePcId:info.linkableButtonPageList[0].cmsPageId,
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });
                                }else{
                                    thtf.exampleForm.imagetextArr.push({
                                        cmsPageMId:info.linkableButtonPageList[0].cmsPageId,
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });
                                }
                            }else if(info.linkType==5){
                                thtf.findByStandardUnitName('',info.linkId);
                                thtf.exampleForm.imagetextArr.push({
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });
                            }else{
                                thtf.exampleForm.imagetextArr.push({
                                    imagetextId:info.imagetextId,
                                    imagetextName:info.imagetextName,
                                    imagetextUrl:info.imagetextUrl,
                                    linkId:info.linkId,
                                    linkParam:info.linkParam,
                                    linkType:info.linkType,
                                    linkUrl:info.linkUrl,
                                    suCompanyAvailable:info.suCompanyAvailable,
                                    suTmplId:info.suTmplId
                                });
                            }

                        });
                    }else if(data.element.type>=400 && data.element.type<500){
                        //标语
                        this.exampleForm.lableIconUrl = data.labelGroup.imgUrl;
                        this.exampleForm.lableArr = data.labelGroup.labelList;
                    }else if(data.element.type==501){
                       // this.exampleForm.imagetextArr = data.mixInstForFive.imagetextGroup.imagetextList;
                        this.exampleForm.imagetextArr = [];
                        this.exampleForm.titleColor = data.mixInstForFive.suList.titleColor;
                        this.exampleForm.titleName = data.mixInstForFive.suList.titleName;
                        this.exampleForm.sucId = data.mixInstForFive.suList.sucId;
                        $.each(data.mixInstForFive.imagetextGroup.imagetextList,function(key,info){
                            if(info.linkType==4 && info.linkableButtonPageList && info.linkableButtonPageList.length >0){
                                if(thtf.form.clientType == 4){
                                    thtf.exampleForm.imagetextArr.push({
                                        cmsPagePcId:info.linkableButtonPageList[0].cmsPageId,
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });
                                }else{
                                    thtf.exampleForm.imagetextArr.push({
                                        cmsPageMId:info.linkableButtonPageList[0].cmsPageId,
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });
                                }
                            }else if(info.linkType==5){
                                thtf.findByStandardUnitName('',info.linkId);
                            }else{
                                thtf.exampleForm.imagetextArr.push({
                                    imagetextId:info.imagetextId,
                                    imagetextName:info.imagetextName,
                                    imagetextUrl:info.imagetextUrl,
                                    linkId:info.linkId,
                                    linkParam:info.linkParam,
                                    linkType:info.linkType,
                                    linkUrl:info.linkUrl,
                                    suCompanyAvailable:info.suCompanyAvailable,
                                    suTmplId:info.suTmplId
                                });
                            }

                        });

                    }else if(data.element.type==601){
                       // this.exampleForm.imagetextArr = data.mixInstForSix.imagetextGroupForNormal.imagetextList;
                       // this.exampleForm.imagetextBannerArr = data.mixInstForSix.imagetextGroupForBanner.imagetextList;
                        this.exampleForm.titleColor = data.mixInstForSix.suList.titleColor;
                        this.exampleForm.titleName = data.mixInstForSix.suList.titleName;
                        this.exampleForm.sucId = data.mixInstForSix.suList.sucId;
                        this.exampleForm.imagetextArr = [];
                        this.exampleForm.imagetextBannerArr = [];
                        $.each(data.mixInstForSix.imagetextGroupForBanner.imagetextList,function(key,info){
                            if(info.linkableButtonPageList && info.linkableButtonPageList.length >0){
                                if(info.linkType == 4 && thtf.form.clientType == 4){
                                    thtf.exampleForm.imagetextBannerArr.push({
                                        cmsPagePcId:info.linkableButtonPageList[0].cmsPageId,
                                        linkType:info.linkType,
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });

                                }else{
                                    // thtf.exampleForm.imagetextBannerArr.push({
                                    //     cmsPageMId:info.linkableButtonPageList[0].cmsPageId,
                                    //     imagetextId:info.imagetextId,
                                    //     imagetextName:info.imagetextName,
                                    //     imagetextUrl:info.imagetextUrl,
                                    //     linkId:info.linkId,
                                    //     linkParam:info.linkParam,
                                    //     linkType:info.linkType,
                                    //     linkUrl:info.linkUrl,
                                    //     suCompanyAvailable:info.suCompanyAvailable,
                                    //     suTmplId:info.suTmplId
                                    // });
                                }
                            }else{
                                // thtf.exampleForm.imagetextBannerArr.push({
                                //     imagetextId:info.imagetextId,
                                //     cmsPageMId:'',
                                //     imagetextName:info.imagetextName,
                                //     imagetextUrl:info.imagetextUrl,
                                //     linkId:info.linkId,
                                //     linkParam:info.linkParam,
                                //     linkType:info.linkType,
                                //     linkUrl:info.linkUrl,
                                //     suCompanyAvailable:info.suCompanyAvailable,
                                //     suTmplId:info.suTmplId
                                // });
                            }

                        });
                        $.each(data.mixInstForSix.imagetextGroupForNormal.imagetextList,function(key,info){
                            if(info.linkableButtonPageList && info.linkableButtonPageList.length >0){
                                if(thtf.form.clientType == 4){
                                    thtf.exampleForm.imagetextArr.push({
                                        cmsPagePcId:info.linkableButtonPageList[0].cmsPageId,
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });
                                }else{
                                    thtf.exampleForm.imagetextArr.push({
                                        cmsPageMId:info.linkableButtonPageList[0].cmsPageId,
                                        imagetextId:info.imagetextId,
                                        imagetextName:info.imagetextName,
                                        imagetextUrl:info.imagetextUrl,
                                        linkId:info.linkId,
                                        linkParam:info.linkParam,
                                        linkType:info.linkType,
                                        linkUrl:info.linkUrl,
                                        suCompanyAvailable:info.suCompanyAvailable,
                                        suTmplId:info.suTmplId
                                    });
                                }
                            }else{
                                thtf.exampleForm.imagetextArr.push({
                                    imagetextId:info.imagetextId,
                                    imagetextName:info.imagetextName,
                                    imagetextUrl:info.imagetextUrl,
                                    linkId:info.linkId,
                                    linkParam:info.linkParam,
                                    linkType:info.linkType,
                                    linkUrl:info.linkUrl,
                                    suCompanyAvailable:info.suCompanyAvailable,
                                    suTmplId:info.suTmplId
                                });
                            }

                        });
                        console.log(this.exampleForm.imagetextArr);
                        console.log(this.exampleForm.imagetextBannerArr);
                    }
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
        //选择轮播图
        selectBanner(){
            this.dialogFormVisible4 = true;
            this.queryBannerList();
            this.bannerForm = {
                pageNo:1,
                pageSize:10,
                name:'',
                companyName:'',
                linkType:''
            };
        },
        //查询所有轮播图
        async queryBannerList () {
            try {
                const obj = new Object();
                this.listLoading = false;
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

        //icon change事件
        iconChange(val){
            let thtf = this;
            this.exampleForm.iconArr = [];
            for (let i=0;i<val;i++){
                let obj = new Object();
                obj.iconName = '';
                obj.imgUrl = i;
                obj.linkType = '';
                obj.linkParam = '';
                obj.linkId = '';
                obj.cmsPageMId = '';
                obj.cmsPagePcId = '';
                obj.linkableButtonPageList = [];
                thtf.exampleForm.iconArr.push(obj);
            }
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                this.findByStandardUnitName(query);
            } else {
                this.loading = false;
                this.goodsList = [];
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
        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.exampleForm.companyList = arr;
        },
         //ICON公司全选
        allIconCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.iconObj.companyIds = arr;
        },

        //选择组件
        selectModule(){
            if(this.elementObj.configType===''){
                this.radio = this.elementObj.dictId;
                this.dialogFormVisible1 = true;
                this.elementDict();
            }else{
                this.$confirm('修改组件后需要重新配置实例信息，确认修改组件？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.radio = this.elementObj.dictId;
                    this.dialogFormVisible1 = true;
                    this.elementDict();
                }).catch(() => {

                });
            }

        },

        //select change监听
        bannerChUrl:function(){
            this.exampleForm.linkId ='';
            this.exampleForm.linkUrl = '';
            this.exampleForm.cmsPageMId = '';
            this.exampleForm.cmsPagePcId = '';
        },
        //查询组件列表
        async elementDict () {
            try {
                var type;
                if(this.form.clientType==4){
                    type=3;
                }else{
                    type=this.form.type;
                }
                const res = await elementDict({type:type});

                if (res.data.code == 0) {
                    this.elementList = res.data.data.dictList;
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
        //选择组件确定
        updataElement(){
            let thtf = this;
            $.each(this.elementList,function(key,info){
                if(info.dictId == thtf.radio){
                    thtf.elementObj = info;
                }
            })
            if(this.elementObj.configType == 301 || this.elementObj.configType == 300){
                this.exampleForm.imagetextArr = [
                    {
                        imagetextName:'',
                        imagetextUrl:'1',
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        linkableButtonPageList:[]
                    },
                ];
            }else if(this.elementObj.configType == 302 || this.elementObj.configType == 303){
                this.exampleForm.imagetextArr = [
                    {
                        imagetextName:'',
                        imagetextUrl:1,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        linkableButtonPageList:[]
                    },
                    {
                        imagetextName:'',
                        imagetextUrl:2,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        linkableButtonPageList:[]
                    },
                    {
                        imagetextName:'',
                        imagetextUrl:3,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        linkableButtonPageList:[]
                    }
                ];
            }else if(this.elementObj.configType == 304){
                this.exampleForm.imagetextArr = [
                    {
                        imagetextName:'',
                        imagetextUrl:1,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        cmsPageMId:'',
                        cmsPagePcId:'',
                        linkableButtonPageList:[]
                    },
                    {
                        imagetextName:'',
                        imagetextUrl:2,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        cmsPageMId:'',
                        cmsPagePcId:'',
                        linkableButtonPageList:[]
                    }
                ];
            }else if(this.elementObj.configType == 601){
                this.exampleForm.imagetextArr = [
                    {
                        imagetextUrl:1,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        cmsPageMId:'',
                        cmsPagePcId:'',
                        linkableButtonPageList:[]
                    },
                    {
                        imagetextUrl:2,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        cmsPageMId:'',
                        cmsPagePcId:'',
                        linkableButtonPageList:[]
                    }
                ];

                this.exampleForm.imagetextBannerArr = [
                    {
                        imagetextUrl:1,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        cmsPageMId:'',
                        cmsPagePcId:'',
                        linkableButtonPageList:[]
                    }
                ];

            }else if(this.elementObj.configType == 501){
                this.exampleForm.imagetextArr = [
                    {
                        imagetextUrl:1,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        linkableButtonPageList:[]
                    },
                    {
                        imagetextUrl:2,
                        linkType:'',
                        linkId:'',
                        linkUrl:'',
                        linkableButtonPageList:[]
                    }
                ];

            }
            if(this.elementObj.configType == 400){
                this.exampleForm.lableArr = [
                    {
                        labelName:'',
                    },
                    {
                        labelName:'',
                    },
                    {
                        labelName:'',
                    }
                ];
            }else if(this.elementObj.configType == 401){
                this.exampleForm.lableArr = [
                    {
                        labelName:'',
                    },
                    {
                        labelName:'',
                    },
                    {
                        labelName:'',
                    },
                    {
                        labelName:'',
                    },
                ];
            }else if(this.elementObj.configType == 203){
                let cmsIds = new Array;
                let that = this;
                that.exampleForm.iconArr = [];
                for(let i=0;i<5;i++){
                    that.exampleForm.iconArr.push(
                        {
                            iconName:'',
                            imgUrl:'',
                            linkType:'',
                            linkId:'',
                            linkUrl:'',
                            companyIds:[],
                            index:i,
                            summary:'',
                            linkableButtonPageList:[]
                        }
                    );
                };
            }
            console.log('suc')
            this.dialogFormVisible1 = false;
        },
        //选择轮播图确定
        async updataBanner(){
            try {
                const obj = new Object();
                obj.bannerIdList = JSON.stringify(this.exampleForm.bannerIds);
                obj.pageSize = this.exampleForm.bannerIds.length+10;
                obj.pageNo = 1;
                const res = await queryBannerList(obj);
                if (res.data.code == 0) {
                    this.checkBannerList = res.data.data.bannerPage.list;
                    this.dialogFormVisible4 = false;
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
        //删除banner
        deleteBanner(index){
            this.$confirm('删除后轮播图将不会在前端页面展示，确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.exampleForm.bannerIds.splice(index,1);
                this.checkBannerList.splice(index,1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {

            });
        },
        //组件保存
        updataTemplate(){
            this.btnStatus = true;
            let obj = new Object();
            //公共参数
            obj.name = this.exampleForm.name;
            obj.margin = this.exampleForm.margin;
            if(this.allStatus.length>0){
                obj.companyIds = JSON.stringify(this.allStatus);
            }else{
                obj.companyIds = JSON.stringify(this.exampleForm.companyIds);
            }
            obj.elementDictId = this.elementObj.dictId;
            obj.templateId = this.tmplId;
            obj.instId = this.exampleForm.instId;
            obj.elementId = this.exampleForm.elementId;
            obj.pageTabId = this.pageTabId;
            console.log(this.exampleForm)
            console.log(this.elementObj)
            if(this.elementObj.configType === 0 || this.elementObj.configType === 1){
//轮播图
                let arr = new Array();
                $.each(this.checkBannerList,function(key,info){
                    arr.push(info.id);
                })
                obj.bannerIds = JSON.stringify(arr);
            }else if(this.elementObj.configType >= 100 && this.elementObj.configType < 200){
//商品
                let that = this;
                obj.titleName = that.exampleForm.titleName;
                obj.maxShow = that.exampleForm.maxShow;
                obj.bannerUrl = that.exampleForm.bannerUrl;
                obj.sucId = that.exampleForm.sucId;
                obj.linkType = that.exampleForm.linkType;
                obj.linkId = that.exampleForm.linkId;
                obj.linkUrl = that.exampleForm.linkUrl;
                obj.linkParam = that.exampleForm.linkParam;
                if(that.form.clientType == 4){
                    if(that.exampleForm.linkType==4){
                        that.exampleForm.linkableButtonPageList = [];
                        that.exampleForm.linkableButtonPageList.push({
                            "cmsPageId": that.exampleForm.cmsPagePcId,
                            "clientType": 5,
                        })
                    }else{
                        that.exampleForm.linkableButtonPageList =[];
                    }
                    console.log('pc');
                    console.log(obj);
                    console.log(that.exampleForm.cmsPagePcId);
                }else{
                    if(that.exampleForm.linkType==4){
                        that.exampleForm.linkableButtonPageList = [];
                        that.exampleForm.linkableButtonPageList.push({
                            "cmsPageId": that.exampleForm.cmsPageMId,
                            "clientType": 6,
                        });
                    }else{
                        that.exampleForm.linkableButtonPageList =[];
                    }
                    console.log('mobile-WECHART');
                    console.log(that.exampleForm.linkableButtonPageList);
                    console.log(that.exampleForm.cmsPageMId);
                }
                obj.linkableButtonPageList = JSON.stringify(that.exampleForm.linkableButtonPageList);
            }else if(this.elementObj.configType >= 200 && this.elementObj.configType < 300){
//icon
                if(this.elementObj.configType == 202){
                    let that = this;
                    obj.count = that.exampleForm.iconArr.length;
                    obj.iconTitle = that.exampleForm.iconTitle;
                    let arr = that.exampleForm.iconArr;
                    // $.each(this.exampleForm.iconArr,function(key,info){
                    //     arr[key].companyIds = JSON.stringify(info.companyIds);
                    // })
                    if(that.form.clientType == 4){
                        $.each(arr,function(key,info){
                            info.linkableButtonPageList = [];
                            if(info.linkType == 4){
                                info.linkableButtonPageList.push({
                                    "cmsPageId": info.cmsPagePcId,
                                    "clientType": 5,
                                })
                            }else{
                                info.linkableButtonPageList =[];
                            }

                        });
                        console.log('pc');
                        console.log(that.exampleForm.iconArr);
                    }else{
                        $.each(arr,function(key,info){
                            info.linkableButtonPageList = [];
                            if(info.linkType == 4){
                                if(info.linkableButtonPageList){
                                    //info.linkableButtonPageList =[];
                                    info.linkableButtonPageList.push({
                                        "cmsPageId": info.cmsPageMId,
                                        "clientType": 6,
                                    })
                                }

                            }else{
                                info.linkableButtonPageList =[]
                            }
                        });
                        console.log('icon-mobile');
                        console.log(that.exampleForm.iconArr);
                        console.log(that.exampleForm.cmsPageMId);
                    }
                     obj.iconArr = JSON.stringify(arr);
                }else{
                    let that = this;
                    if(that.form.clientType == 4){
                        $.each(that.exampleForm.iconArr,function(key,info){
                            info.linkableButtonPageList = [];
                            if(info.linkType == 4){
                                info.linkableButtonPageList.push({
                                    "cmsPageId": info.cmsPagePcId,
                                    "clientType": 5,
                                })
                            }else{
                                info.linkableButtonPageList =[];
                            }

                        });
                        console.log('pc');
                        console.log(that.exampleForm.iconArr);
                    }else{
                        $.each(that.exampleForm.iconArr,function(key,info){
                            info.linkableButtonPageList = [];
                            if(info.linkType == 4){
                                if(info.linkableButtonPageList){
                                    //info.linkableButtonPageList =[];
                                    info.linkableButtonPageList.push({
                                        "cmsPageId": info.cmsPageMId,
                                        "clientType": 6,
                                    })
                                }

                            }else{
                                info.linkableButtonPageList =[]
                            }
                        });
                        console.log('mobile');
                        console.log(that.exampleForm.iconArr);
                        console.log(that.exampleForm.cmsPageMId);
                    }
                    obj.count = that.exampleForm.count;
                    obj.iconTitle = that.exampleForm.iconTitle;
                    obj.iconArr = JSON.stringify(that.exampleForm.iconArr);
                }

            }else if(this.elementObj.configType >= 300 && this.elementObj.configType < 400){
//图文
                let that = this;
                obj.imagetextTitle = that.exampleForm.imagetextTitle;
                if(that.form.clientType ==4){
                        $.each(that.exampleForm.imagetextArr,function(key,info){
                            info.linkableButtonPageList = [];
                            if(info.linkType ==4){
                                info.linkableButtonPageList.push({
                                    "cmsPageId": info.cmsPagePcId,
                                    "clientType": 5,
                                })
                            }else{
                                info.linkableButtonPageList =[]
                            }

                        })
                    }else{
                        $.each(that.exampleForm.imagetextArr,function(key,info){
                            if(info.linkType ==4){
                                if(!info.linkableButtonPageList){
                                    info.linkableButtonPageList =[];
                                    info.linkableButtonPageList.push({
                                        "cmsPageId": info.cmsPageMId,
                                        "clientType": 6,
                                    })
                                }
                            }else{
                                info.linkableButtonPageList =[]
                            }
                        })
                    }
                obj.imagetextArr = JSON.stringify(that.exampleForm.imagetextArr);
            }else if(this.elementObj.configType >= 400 && this.elementObj.configType < 500){
//标语
                obj.lableIconUrl = this.exampleForm.lableIconUrl;
                obj.lableArr = JSON.stringify(this.exampleForm.lableArr);
            }else if(this.elementObj.configType == 601){
                let that = this;
                obj.titleColor = that.exampleForm.titleColor;
                obj.titleName = that.exampleForm.titleName;

                if(that.form.clientType ==4){
                    $.each(that.exampleForm.imagetextArr,function(key,info){
                        info.linkableButtonPageList = [];
                        if(info.linkType ==4){
                            info.linkableButtonPageList.push({
                                "cmsPageId": info.cmsPagePcId,
                                "clientType": 5,
                            })
                        }else{
                            info.linkableButtonPageList =[]
                        }
                    });
                    $.each(that.exampleForm.imagetextBannerArr,function(key,info){
                        info.linkableButtonPageList = [];
                        if(info.linkType ==4){
                            info.linkableButtonPageList.push({
                                "cmsPageId": info.cmsPagePcId,
                                "clientType": 5,
                            })
                        }else{
                            info.linkableButtonPageList =[]
                        }
                    });
                }else{
                    $.each(that.exampleForm.imagetextArr,function(key,info){
                        if(info.linkType ==4){
                            if(!info.linkableButtonPageList){
                                info.linkableButtonPageList =[];
                                info.linkableButtonPageList.push({
                                    "cmsPageId": info.cmsPageMId,
                                    "clientType": 6,
                                })
                            }
                        }else{
                            info.linkableButtonPageList =[]
                        }
                    });
                    $.each(that.exampleForm.imagetextBannerArr,function(key,info){
                        if(info.linkType ==4){
                            if(!info.linkableButtonPageList){
                                info.linkableButtonPageList =[];
                                info.linkableButtonPageList.push({
                                    "cmsPageId": info.cmsPageMId,
                                    "clientType": 6,
                                })
                            }
                        }else{
                            info.linkableButtonPageList =[]
                        }
                    });
                }
                obj.imagetextArr = JSON.stringify(that.exampleForm.imagetextArr);
                obj.imagetextBannerArr = JSON.stringify(that.exampleForm.imagetextBannerArr);
                obj.sucId = that.exampleForm.sucId;

            }else if(this.elementObj.configType == 501){
                let that =this;
                obj.titleColor = that.exampleForm.titleColor;
                obj.titleName = that.exampleForm.titleName;
                if(that.form.clientType ==4){
                        $.each(that.exampleForm.imagetextArr,function(key,info){
                            info.linkableButtonPageList = [];
                            if(info.linkType ==4){
                                info.linkableButtonPageList.push({
                                    "cmsPageId": info.cmsPagePcId,
                                    "clientType": 5,
                                })
                            }else{
                                info.linkableButtonPageList =[]
                            }

                        })
                    }else{
                        $.each(that.exampleForm.imagetextArr,function(key,info){
                            if(info.linkType ==4){
                                if(!info.linkableButtonPageList){
                                    info.linkableButtonPageList =[];
                                    info.linkableButtonPageList.push({
                                        "cmsPageId": info.cmsPageMId,
                                        "clientType": 6,
                                    })
                                }
                            }else{
                                info.linkableButtonPageList =[]
                            }

                        })
                    }
                obj.imagetextArr = JSON.stringify(that.exampleForm.imagetextArr);
                obj.sucId = that.exampleForm.sucId;
            }
            this.saveEleAndInst(obj);
        },

        //保存组件请求

        async saveEleAndInst (obj) {
            try {
                const res = await saveEleAndInst(obj);

                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.templateDetailEleList();
                    this.btnStatus = false;
                    this.$message({
                        type: 'success',
                        message: '组件保存成功'
                    });
                } else {
                    this.btnStatus = false;
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.btnStatus = false;
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },

        //保存实例请求

        async saveTemplate () {
            try {
                let obj = new Object();
                obj.name = this.form.name;
                obj.remark = this.form.remark;
                obj.clientType = this.form.clientType;
                obj.showFgj = this.form.showFgj;
                obj.templateId = this.tmplId;
                let arr = new Array();
                $.each(this.form.elementList,function(key,info){
                    arr.push(info.elementId)
                })
                obj.elementIds = JSON.stringify(arr);
                const res = await saveTemplate(obj);

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

        //上传之前获取key，index
        uploadKeyIndex(index) {
            this.index = index;
        },

        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
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
        handleAvatarSuccess3(response){
            this.$set(this.exampleForm.iconArr[this.index],'imgUrl',this.baseImgUrl + response.key)
        },
        handleAvatarSuccess4(response){

            this.$set(this.exampleForm.imagetextArr[this.index],'imagetextUrl',this.baseImgUrl + response.key)
        },
        handleAvatarSuccess5(response){
            this.exampleForm.lableIconUrl = this.baseImgUrl + response.key;
        },
        handleAvatarSuccess6(response){
            this.exampleForm.bannerUrl = this.baseImgUrl + response.key;
        },
        handleAvatarSuccess7(response){
            this.iconObj.imgUrl = this.baseImgUrl + response.key;
        },
        handleAvatarSuccess8(response){
            this.imgObj.imagetextUrl = this.baseImgUrl + response.key;
        },
        handleAvatarSuccess9(response){
            this.handleAvatarSuccess9Show = false;
            this.$set(this.exampleForm.imagetextBannerArr[this.index],'imagetextUrl',this.baseImgUrl + response.key);
            this.handleAvatarSuccess9Show = true;
        },
        //通过客户端类型查询商品页列表
        async findCmsPageAllByClientType2 (clientType) {
            try {
                const res = await findCmsPageAllByClientType({clientType:clientType});
                if (res.data.code == 0) {
                    this.clientTypeDate2 = res.data.data;
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
        async findCmsPageAllByClientType (clientType) {
            try {
                const res = await findCmsPageAllByClientType({clientType:clientType});
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
        // //移动端页面获取
        // getPageDateM(){
        //     this.clientTypeDate = [];
        //     this.findCmsPageAllByClientType(6);
        // },
        // //PC页面获取
        // getPageDatePc(){
        //     this.clientTypeDate = [];
        //     this.findCmsPageAllByClientType2(5);
        // },
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
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
        },


    }


}
</script>

<style>
.clear .el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    width:100%;
    width:100%;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
}
.clear .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:100%;
    width:100%;
  }
 .clear .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
 .clear .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .clear .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }

.clear .avatar-uploader{
    display:inline-block;
    width:150px;
    height:150px;
}
.clear .avatar-uploader img{
    width:100%;
    height:100%;

}
.clear .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width:100%;
    height:100%;
    line-height:150px;
    text-align: center;
}
.clear .el-upload{
    width:100%;
    height:100%;
}
</style>


