<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="模板名称" v-model="ruleForm.templateName">
        </el-input>



        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="queryCommodityTemplateOfPage">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="模板名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.templateName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="模板类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.templateType==1">电子卡券模板</span>
                <span v-else-if="scope.row.templateType==2">实物商品模版</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="Android版本号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.versionsA}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="iOS版本号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.versionsI}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否默认模板" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.show==0">否</span>
                <span v-else-if="scope.row.show==1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button :disabled="scope.row.show==1" type="success" size="small" plain @click="checkCategory(scope.row.commodityTemplateId)">设为默认</el-button>
                <el-button type="primary" plain size="small" @click="seeTempGoods(scope.row.templateName)">预览</el-button>
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

    <el-dialog title="商品详情" :visible.sync="dialogFormVisible" size="tiny">
        <div>
            <img :src="templateUrl" style="width:100%"/>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgUrl } from '../../../config/env'
import {queryCommodityTemplateOfPage,showCommodityTemplate} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            form:{
                name:'',
                content:'',
                seriesType:'',
                id:'',
            },
            ruleForm:{
                templateName:'',
                pageNo:1,
                pageSize:10
            },
            failReason:'',
            treeStatus:[
                {
                    key:"一级",
                    value:1
                },
                {
                    key:"二级",
                    value:2
                },
            ],
            templateUrl:''

        }
    },
    created() {
        this.queryCommodityTemplateOfPage();


    },

    methods: {
        //获取列表
        async queryCommodityTemplateOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await queryCommodityTemplateOfPage(obj);

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
            this.ruleForm.pageSize = val;
            this.queryCommodityTemplateOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.queryCommodityTemplateOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                templateName:'',
                pageNo:1,
                pageSize:10
            };

            this.queryCommodityTemplateOfPage()
        },
        //新增弹窗
        addCategory(){
            this.form = {
                name:'',
                content:'',
                seriesType:'',
                id:'',
            };
            this.dialogFormVisible = true;
        },




        //启用
        async checkCategory (id) {
            try {
                const res = await showCommodityTemplate({commodityTemplateId:id});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '启用成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.queryCommodityTemplateOfPage();
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
        //查看
        seeTempGoods (tempName) {
            this.dialogFormVisible = true;
            this.templateUrl = baseImgUrl + tempName;
        },


        //类目管理
        categoryManage(id){
            this.$router.push('/cetegory/'+id);
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


