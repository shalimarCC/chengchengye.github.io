<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
         <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="名称" v-model="ruleForm.name">
        </el-input>
        </el-select>

        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.enabled" placeholder="状态">
            <el-option
                :key="1"
                label="启用中"
                :value="1">
            </el-option>
            <el-option
                :key="0"
                label="未启用"
                :value="0">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

    </div>

    <div style="margin-bottom:20px;">

        <el-button :type="companyType==0?'success':'info'" @click="checkCompany(0)">正式公司</el-button>
        <el-button :type="companyType==1?'success':'info'" @click="checkCompany(1)">竞品公司</el-button>
        <el-button :type="companyType==2?'success':'info'" @click="checkCompany(2)">演示公司</el-button>

        <el-button class="filter-item" @click="addActivity" style="float:right" type="primary" size="medium" icon="edit">添加</el-button>
     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="跳转类型" min-width="100">
            <template slot-scope="scope">
                <span v-for="info in bannerSkipList" v-if="scope.row.linkType==info.value">{{info.key}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属企业" min-width="80">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="queryCompanyListByBannerId(scope.row.id)">查看</el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="状态" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.enabled==0">未启用</span>
                <span v-else-if="scope.row.enabled==1">启用中</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" v-if="scope.row.enabled == 0" plain @click="resetBannerStatusById(scope.row.id)">设为启用</el-button>
                <el-button type="warning" size="small" v-else-if="scope.row.enabled == 1" plain @click="resetBannerStatusById(scope.row.id)">设为停用</el-button>

                <el-button type="primary" plain size="small" @click="editActivity(scope.row.id)">编辑</el-button>

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
        <el-form label-width="120px">
            <el-form-item label="名称">
                <el-input v-model="bannerForm.name"></el-input>
            </el-form-item>

            <el-form-item label="所属公司">
                <el-select v-model="bannerForm.companyIds" collapse-tags multiple :disabled="allStatus.length>0">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox-group v-model="allStatus">
                    <el-checkbox :label="-1" v-if="companyType==0">全部正式公司可见</el-checkbox>
                    <el-checkbox :label="-3" v-if="companyType==1">全部演示公司可见</el-checkbox>
                    <el-checkbox :label="-2" v-if="companyType==2">全部竞品公司可见</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

           <el-form-item label="跳转类型">
                <el-select v-model="bannerForm.linkType">
                    <el-option
                        v-for="item in bannerSkipList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="图片">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseImgPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="handleError"
                        :data="imgForm">
                        <img v-if="bannerForm.imgUrl" :src="bannerForm.imgUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

            <el-form-item label="配置参数" prop="name" v-if="bannerForm.linkType==1">
                <el-select v-model="bannerForm.linkId">
                    <el-option
                        v-for="item in localList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="配置链接" prop="name" v-else-if="bannerForm.linkType==2">
                <el-input v-model="bannerForm.linkUrl"></el-input>
            </el-form-item>

            <el-form-item label="配置链接" prop="name" v-else-if="bannerForm.linkType==3">
                <el-select v-model="bannerForm.linkId">
                    <el-option
                        v-for="item in urlList"
                        :key="item.externalLinkId"
                        :label="item.externalLinkName"
                        :value="item.externalLinkId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="商品分类" prop="name" v-else-if="bannerForm.linkType==4">
                <el-select v-model="bannerForm.linkId">
                    <el-option
                        v-for="item in classifyList"
                        :key="item.standardUnitCombinationId"
                        :label="item.combinationName"
                        :value="item.standardUnitCombinationId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="配置商品" prop="name" v-else-if="bannerForm.linkType==5">
                <el-select
                    v-model="bannerForm.linkId"
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

            <el-form-item label="所属分页tab" v-else-if="bannerForm.linkType==7">
                <el-select v-model="bannerForm.linkId">
                    <el-option
                        v-for="item in tabList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="备注">
                <el-input v-model="bannerForm.remark"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateBannerByIdWithTx">确 定</el-button>
        </div>

    </el-dialog>


    <el-dialog title="关联企业" :visible.sync="dialogFormVisible2">
        <div style="height:500px;overflow:auto;">
            <el-table :data="companyData" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="企业/企业分组名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="公司类型">
                    <template slot-scope="scope">
                        <span>730新需求</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="备注">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyContent}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {queryBannerList,findCompanyIdOrName,getQiNiuToken,findStandardUnitIdAndName,localParamList,queryStandardUnitCombinationAll,
findExternalLinkAll,findByStandardUnitName,saveBanner,findBannerById,resetBannerStatusById,queryCompanyListByBannerId,findSimplePageTabAll} from '../../../api/getData';
export default {
    data() {
        return {
            imgForm:{
                key:'',
                token:'',
            },
            dataSource: [],
            offset: 0,
            limit: 10,
            count: null,
            currentPage: 1,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            dialogTitle:"新增Banner",
            activityName:'',
            bannerForm:{
                bannerId:'',
                sort:1,
                name:'',
                imgUrl:'',
                belongPage:3,
                companyIds:[],
                linkId:'',
                linkUrl:'',
                linkType:'',
                remark:'',
                companyType:''
            },
            bannerSkipList:[
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
                    key:'分页TAB'
                },
            ],
            companyList:[],
            goodsList:[],
            baseImgPath:'',
            baseImgUrl:'',
            loading: false,
            localList:[],
            urlList:[],
            classifyList:[],
            loading:false,
            allStatus:[],
            ruleForm:{
                name:'',
                companyId:'',
                enabled:'',
                belongPage:3,
                // companyType:0,
                pageNo:1,
                pageSize:10
            },
            companyType:0,
            companyData:[],
            dialogFormVisible2:false
        }
    },
    created() {
        this.queryBannerList();
        this.findCompanyIdOrName();
        this.queryStandardUnitCombinationAll();
        this.findExternalLinkAll();
        this.localParamList();
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
    watch : {
        "bannerForm.linkType":{
            handler(curVal,oldVal){
                this.linkId = '';
            }
        }
    },
    methods: {
        //获取tab列表
        async findSimplePageTabAll () {
            try {
                const res = await findSimplePageTabAll({companyType:this.companyType});
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
        //查询所属公司
        async queryCompanyListByBannerId(id) {
            try {
                const res = await queryCompanyListByBannerId({id:id});

                if (res.data.code == 0) {
                    this.companyData = res.data.data;
                    this.dialogFormVisible2 = true;
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
        //改变状态
        async resetBannerStatusById(id) {
            try {
                this.listLoading = false;
                const res = await resetBannerStatusById({id:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '改变状态成功'
                    });
                    this.queryBannerList();
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

        //获取列表
        async queryBannerList() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                if(this.companyType){obj.companyType=this.companyType;}
                if(this.companyType==0){obj.companyType=0;}
                this.listLoading = false;
                const res = await queryBannerList(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.bannerPage.totalSize;
                    this.dataSource = res.data.data.bannerPage.list;

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
            this.ruleForm.pageSize = val;
            this.queryBannerList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.queryBannerList()
        },


        //重置
        resetForm(){
            this.ruleForm={
                name:'',
                companyId:'',
                enabled:'',
                belongPage:3,
                pageNo:1,
                pageSize:10
            };

            this.queryBannerList()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.queryBannerList()
        },
        //切换公司类型
        checkCompany(type){
            this.companyType = type;
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findCompanyIdOrName();
            this.queryBannerList()
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
        async findByStandardUnitName (name) {
            try {
                console.log(name)
                const res = await findByStandardUnitName({standardUnitName:name});
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

        //获取公司列表
        async findCompanyIdOrName () {
            try {
                const res = await findCompanyIdOrName({companyType:this.companyType});
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



        //新增banner
        addActivity () {
            this.bannerForm = {
                bannerId:'',
                sort:1,
                name:'',
                imgUrl:'',
                belongPage:3,
                companyIds:[],
                linkId:'',
                linkUrl:'',
                linkType:'',
                remark:'',
                companyType:''
            };
            this.allStatus = [];
            this.findSimplePageTabAll();
            this.dialogTitle = '新增Banner';
            this.dialogFormVisible = true;
        },


        //编辑banner
        async editActivity (id) {
            this.findBannerById(id);
            this.findSimplePageTabAll();
            this.dialogTitle = '修改Banner';
            this.dialogFormVisible = true;
        },

        //根据banner ID查询信息
        async findBannerById (id) {
            try {
                const res = await findBannerById({bannerId:id});
                if (res.data.code == 0) {
                    this.bannerForm = res.data.data.banner;
                    if(res.data.data.banner.companyIds[0]<0){
                        this.allStatus = res.data.data.banner.companyIds;
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


        //保存
        async updateBannerByIdWithTx () {
            try {
                this.bannerForm.companyType = this.companyType;
                let obj = JSON.parse(JSON.stringify(this.bannerForm));
                if(this.allStatus.length>0){
                    obj.companyIds = JSON.stringify(this.allStatus);
                }else{
                    obj.companyIds = JSON.stringify(this.bannerForm.companyIds);
                }
                const res = await saveBanner(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新Banner成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.queryBannerList();
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
            this.bannerForm.companyIds = arr;
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
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
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
             console.log(this.imgForm)
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
            this.bannerForm.imgUrl = this.baseImgUrl + response.key;
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
</style>


