<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="名称" v-model="ruleForm.navigationBarName">
        </el-input>

        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

     </div>

     <div style="margin-bottom:20px;">

        <el-button :type="companyType==0?'success':'info'" @click="checkCompany(0)">正式公司</el-button>
        <el-button :type="companyType==1?'success':'info'" @click="checkCompany(1)">竞品公司</el-button>
        <el-button :type="companyType==2?'success':'info'" @click="checkCompany(2)">演示公司</el-button>

        <el-button class="filter-item" style="float:right" type="primary" icon="edit" size="medium" @click="addInfo">
        新增主题
        </el-button>
        <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 同一公司下的导航主题只显示前4个。</p>
     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.navigationBarName}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="所属企业" min-width="80">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findNavigationBarCompanyOfPage(scope.row.id)">查看</el-button>
            </template>
        </el-table-column>


        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.updateTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.updateUser}}</span>
            </template>
        </el-table-column>



        <el-table-column align="center" label="操作" width="300"  fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="findNavigationBarById(scope.row.id)" :disabled="scope.row.isEdit==0" size="small" plain>编辑</el-button>
                <el-button type="primary" @click="deleteInfo(scope.row.id)" size="small" plain>删除</el-button>
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

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <div style="height:500px;overflow:auto;">
            <el-form label-width="120px">
                <el-form-item label="标签名称">
                    <el-input v-model="infoForm.navigationBarName" placeholder="标签名称"></el-input>
                </el-form-item>

                <el-form-item label="所属公司">
                    <el-select v-model="infoForm.companyIds" collapse-tags multiple :disabled="allStatus.length>0">
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

                <el-form-item label="信息栏标签" style="text-align:left;">
                    <el-tag
                    :key="tag.id"
                    v-for="(tag,key) in checkLabel"
                    closable
                    @close="tagClose(key)">
                    <span @click="tagEdit(key)" style="cursor:pointer;">{{tag.name}}</span>
                    </el-tag>

                    <el-button class="button-new-tag" size="small" @click="addLabel">+ 添加标签</el-button>
                </el-form-item>
            </el-form>

            <el-dialog
                title="标签配置"
                :visible.sync="innerVisible"
                append-to-body>
                <el-form label-width="120px">
                    <el-form-item label="名称">
                        <el-input v-model="labelForm.navigationLabelName" placeholder="名称"></el-input>
                    </el-form-item>

                    <el-form-item label="跳转页面">
                        <el-select v-model="labelForm.linkType">
                            <el-option
                                v-for="item in skipList"
                                :key="item.value"
                                :label="item.key"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="配置参数" prop="name" v-if="labelForm.linkType==1">
                        <el-select v-model="labelForm.linkId">
                            <el-option
                                v-for="item in localList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="配置链接" prop="name" v-else-if="labelForm.linkType==2">
                        <el-input v-model="labelForm.linkUrl"></el-input>
                    </el-form-item>

                    <el-form-item label="配置链接" prop="name" v-else-if="labelForm.linkType==3">
                        <el-select v-model="labelForm.linkId">
                            <el-option
                                v-for="item in urlList"
                                :key="item.externalLinkId"
                                :label="item.externalLinkName"
                                :value="item.externalLinkId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品分类" prop="name" v-else-if="labelForm.linkType==4">
                        <el-select v-model="labelForm.linkId">
                            <el-option
                                v-for="item in classifyList"
                                :key="item.standardUnitCombinationId"
                                :label="item.combinationName"
                                :value="item.standardUnitCombinationId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="配置商品" prop="name" v-else-if="labelForm.linkType==5">
                        <el-select
                            v-model="labelForm.linkId"
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

                    <el-form-item label="所属分页tab" v-else-if="labelForm.linkType==7">
                        <el-select v-model="labelForm.linkId">
                            <el-option
                                v-for="item in tabList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input v-model="labelForm.navigationLabelRemark" placeholder="备注"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" :span="24">
                    <el-button size="medium" @click="innerVisible = false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="insertOrUpdateNavigationLableWithTx">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="insertOrUpdateNavigationBarWithTx">确 定</el-button>
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
import {findCompanyIdOrName,insertOrUpdateNavigationLableWithTx,insertOrUpdateNavigationBarWithTx,findNavigationBarOfPage,queryStandardUnitCombinationAll,
findExternalLinkAll,localParamList,deleteNavigationLableWithTx,findNavigationLableById,findNavigationBarById,findByStandardUnitName,
findNavigationBarCompanyOfPage,deleteNavigationBarWithTx,findSimplePageTabAll} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            innerVisible:false,
            companyType:0,
            ruleForm:{
                navigationBarType:0,
                navigationBarName:'',
                companyId:'',
                pageNo:1,
                pageSize:10,
                // companyType:0
            },
            infoForm:{
                id:'',
                navigationBarType:0,
                navigationBarName:'',
                navigationLabelIds:'',
                companyIds:[],
                companyType:''
            },
            labelForm:{
                navigationLabelName:'',
                navigationLabelName:'',
                linkType:'',
                linkId:'',
                linkUrl:'',
                linkParam:''
            },
            companyList:[],
            loading:false,
            goodsCombinationList:[],
            goodsData:[],
            companyData:[],
            companyForm:{
                id:'',
                type:0,
                pageNo:1,
                pageSize:10
            },
            title:'新增主题',
            count2: null,
            offset2: 0,
            allStatus:[],
            dialogFormVisible2:false,
            skipList:[
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
            checkLabel:[],
            localList:[],
            urlList:[],
            goodsList:[],
            classifyList:[],
        }
    },
    created() {
        this.findNavigationBarOfPage();
        this.findCompanyIdOrName();
        this.queryStandardUnitCombinationAll();
        this.findExternalLinkAll();
        this.localParamList();
    },
    watch:{
        "labelForm.linkType":{
            handler(curVal,oldVal){
                this.labelForm.linkId = '';
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
        //编辑
        async findNavigationBarById(id){
            try {
                const res = await findNavigationBarById({id:id});
                if (res.data.code == 0) {
                    this.dialogFormVisible = true;
                    this.infoForm = {
                        id:id,
                        navigationBarType:0,
                        navigationBarName:res.data.data.navigationBarName,
                        navigationLabelIds:[],
                        companyIds:[],
                    };
                    this.checkLabel = res.data.data.navigationLabelList;
                    if(res.data.data.companyIdList[0]<0){
                        this.allStatus = res.data.data.companyIdList;
                    }else{
                        this.infoForm.companyIds = res.data.data.companyIdList;
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
        async insertOrUpdateNavigationBarWithTx(){
            try {
                this.infoForm.companyType = this.companyType;
                let arr = new Array();
                $.each(this.checkLabel,function(key,info){
                    arr.push(info.id);
                })
                this.infoForm.navigationLabelIds = JSON.stringify(arr);
                if(this.allStatus.length>0){
                    this.infoForm.companyIds = JSON.stringify(this.allStatus);
                }else{
                    this.infoForm.companyIds = JSON.stringify(this.infoForm.companyIds);
                }
                const res = await insertOrUpdateNavigationBarWithTx(this.infoForm);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '成功'
                    });
                    this.dialogFormVisible = false;
                    this.findNavigationBarOfPage();
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
        //编辑标签
        async tagEdit(key){
            try {
                const res = await findNavigationLableById({id:this.checkLabel[key].id});
                if (res.data.code == 0) {

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
        //删除导航栏详情通过id
        deleteInfo(id){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteNavigationBarWithTx(id);
            }).catch(() => {

            });
        },
        async deleteNavigationBarWithTx(id){
            try {
                const res = await deleteNavigationBarWithTx({id:id});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.findNavigationBarOfPage();
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
        //删除标签
        tagClose(key){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteNavigationLableWithTx(key);
            }).catch(() => {

            });

        },
        async deleteNavigationLableWithTx(key){
            try {
                const res = await deleteNavigationLableWithTx({id:this.checkLabel[key].id});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.checkLabel.splice(key,1);
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
        //保存标签
        async insertOrUpdateNavigationLableWithTx(){
            try {
                const res = await insertOrUpdateNavigationLableWithTx(this.labelForm);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '成功'
                    });
                    this.innerVisible = false;
                    this.checkLabel.push({
                        'id':res.data.data,
                        'name':this.labelForm.navigationLabelName
                    })
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
            this.innerVisible = true;
            this.labelForm = {
                navigationLabelName:'',
                navigationLabelName:'',
                linkType:'',
                linkId:'',
                linkUrl:'',
                linkParam:''
            };

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

        //获取列表
        async findNavigationBarOfPage() {
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
                const res = await findNavigationBarOfPage(obj);

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
        //查询所有公司
        async findCompanyIdOrName(){
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

        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findNavigationBarOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findNavigationBarOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                navigationBarType:0,
                navigationBarName:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            };

            this.findNavigationBarOfPage()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findNavigationBarOfPage()
        },
        //切换公司类型
        checkCompany(type){
            this.companyType = type;
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findCompanyIdOrName();
            this.findNavigationBarOfPage()
        },
        //新增底部信息栏
        addInfo(){
            this.infoForm = {
                id:'',
                navigationBarType:0,
                navigationBarName:'',
                navigationLabelIds:'',
                companyIds:[],
            };
            this.findSimplePageTabAll();
            this.checkLabel = [];
            this.title = '新增主题';
            this.allStatus = [];
            this.dialogFormVisible = true;
        },

        //优惠卷的所属公司列表
        async findNavigationBarCompanyOfPage(id){
            try {
                const res = await findNavigationBarCompanyOfPage({id:id});
                if (res.data.code == 0) {
                    this.dialogFormVisible2 = true;
                    this.companyData = res.data.data;
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
            this.infoForm.companyIds = arr;
        },
        //分页
        handleSizeChange2(val) {
            this.companyForm.pageSize = val;
            this.findCouponCompanyOfPage()
        },
        handleCurrentChange2(val) {
            this.companyForm.pageNo = val;
            this.offset2 = (val - 1) * this.companyForm.pageSize;
            this.findCouponCompanyOfPage()
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

        //时间戳转换
        setTime(time) {
            if(time==null){
                return '';
            }
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


